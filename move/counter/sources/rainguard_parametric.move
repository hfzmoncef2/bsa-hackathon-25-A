module rainguard::parametric_insurance_simple {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use sui::event;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    // ===== CONSTANTS =====
    const ERR_INSUFFICIENT_FUNDS: u64 = 0;
    const ERR_INVALID_ORACLE_DATA: u64 = 1;
    const ERR_POLICY_NOT_FOUND: u64 = 2;
    const ERR_CLAIM_ALREADY_PROCESSED: u64 = 3;
    const ERR_POLICY_EXPIRED: u64 = 6;

    // Types de produits d'assurance
    const PRODUCT_TYPE_SEASONAL: u8 = 1;  // Basé sur la pluie cumulée
    const PRODUCT_TYPE_EVENT: u8 = 2;     // Basé sur la pluie 24h

    // ===== STRUCTS =====

    /// Données météo de l'oracle Nautilus TEE
    public struct WeatherData has store, drop, copy {
        /// Timestamp des données
        timestamp: u64,
        /// Pluie cumulée (pour produit saisonnier)
        cumulative_rainfall: u64,
        /// Pluie 24h (pour produit événementiel)
        rainfall_24h: u64,
        /// Score de confiance de l'oracle
        confidence_score: u8,
        /// Adresse de l'oracle
        oracle_address: address,
        /// Signature de l'oracle
        oracle_signature: vector<u8>,
    }

    /// Feed de données oracle
    public struct OracleFeed has key, store {
        id: UID,
        /// Données météo stockées par timestamp
        weather_data: Table<u64, WeatherData>,
        /// Seuil de quorum requis
        quorum_threshold: u8,
        /// Oracles autorisés
        authorized_oracles: VecSet<address>,
        /// Dernière mise à jour
        last_update: u64,
    }

    /// Zone de couverture géographique
    public struct CoverageArea has store, drop {
        /// Latitude du centre
        center_latitude: u64,
        /// Longitude du centre
        center_longitude: u64,
        /// Rayon en mètres
        radius_meters: u64,
    }

    /// Police d'assurance paramétrique
    public struct ParametricPolicy has key, store {
        id: UID,
        /// Détenteur de la police
        policyholder: address,
        /// Type de produit (1=saisonnier, 2=événementiel)
        product_type: u8,
        /// Montant de couverture
        coverage_amount: u64,
        /// Prime payée
        premium_paid: u64,
        /// Début de couverture (timestamp)
        coverage_start: u64,
        /// Fin de couverture (timestamp)
        coverage_end: u64,
        /// Seuil de déclenchement (mm de pluie)
        trigger_threshold: u64,
        /// Seuil de saturation (mm de pluie)
        saturation_threshold: u64,
        /// Zone de couverture
        coverage_area: CoverageArea,
        /// Statut (1=active, 2=suspendue, 3=expirée)
        status: u8,
    }

    /// Réclamation paramétrique
    public struct ParametricClaim has key, store {
        id: UID,
        /// ID de la police
        policy_id: object::ID,
        /// Type de réclamation
        claim_type: u8,
        /// Montant réclamé
        claim_amount: u64,
        /// Index météo au moment de la réclamation
        weather_index: u64,
        /// Timestamp de la réclamation
        claim_timestamp: u64,
        /// Statut (1=en attente, 2=approuvée, 3=rejetée)
        status: u8,
        /// Justification du paiement
        payout_justification: std::string::String,
    }

    /// Pool d'assurance paramétrique
    public struct ParametricInsurancePool has key, store {
        id: UID,
        /// Balance du pool
        balance: Balance<SUI>,
        /// Polices actives
        active_policies: Table<object::ID, ParametricPolicy>,
        /// Réclamations en attente
        pending_claims: Table<object::ID, ParametricClaim>,
        /// Statistiques du pool
        pool_stats: PoolStats,
        /// Oracle feeds autorisés
        authorized_oracle_feeds: VecSet<object::ID>,
    }

    /// Statistiques du pool
    public struct PoolStats has store, copy, drop {
        /// Nombre total de polices
        total_policies: u64,
        /// Nombre de polices actives
        active_policies: u64,
        /// Nombre total de réclamations
        total_claims: u64,
        /// Montant total payé
        total_payouts: u64,
        /// Prime totale collectée
        total_premiums: u64,
    }

    /// Capacité de détenteur de police
    public struct PolicyHolderCap has key, store {
        id: UID,
        /// ID de la police
        policy_id: object::ID,
    }

    /// Capacité administrateur
    public struct AdminCap has key, store {
        id: UID,
        /// Adresse de l'administrateur
        admin_address: address,
    }

    // ===== EVENTS =====

    /// Événement émis lors de la mise à jour des données oracle
    public struct OracleDataUpdated has copy, drop {
        oracle_feed_id: object::ID,
        timestamp: u64,
        weather_index: u64,
        oracle_address: address,
    }

    /// Événement émis lors de la création d'une police
    public struct PolicyCreated has copy, drop {
        policy_id: object::ID,
        policyholder: address,
        product_type: u8,
        coverage_amount: u64,
    }

    /// Événement émis lors d'une réclamation
    public struct ClaimSubmitted has copy, drop {
        claim_id: object::ID,
        policy_id: object::ID,
        claim_amount: u64,
        weather_index: u64,
    }

    // ===== PUBLIC FUNCTIONS =====

    /// Fonction d'initialisation
    fun init(ctx: &mut TxContext) {
        // Créer le pool d'assurance paramétrique
        let pool = ParametricInsurancePool {
            id: object::new(ctx),
            balance: balance::zero<SUI>(),
            active_policies: table::new<object::ID, ParametricPolicy>(ctx),
            pending_claims: table::new<object::ID, ParametricClaim>(ctx),
            pool_stats: PoolStats {
                total_policies: 0,
                active_policies: 0,
                total_claims: 0,
                total_payouts: 0,
                total_premiums: 0,
            },
            authorized_oracle_feeds: vec_set::empty<object::ID>(),
        };

        // Créer la capacité administrateur
        let admin_cap = AdminCap {
            id: object::new(ctx),
            admin_address: tx_context::sender(ctx),
        };

        // Partager le pool et transférer l'admin cap
        transfer::share_object(pool);
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Crée un nouveau feed oracle
    public fun create_oracle_feed(
        quorum_threshold: u8,
        authorized_oracles: vector<address>,
        ctx: &mut TxContext
    ): OracleFeed {
        let mut oracle_set = vec_set::empty<address>();
        let mut i = 0;
        while (i < vector::length(&authorized_oracles)) {
            vec_set::insert(&mut oracle_set, *vector::borrow(&authorized_oracles, i));
            i = i + 1;
        };

        OracleFeed {
            id: object::new(ctx),
            weather_data: table::new<u64, WeatherData>(ctx),
            quorum_threshold,
            authorized_oracles: oracle_set,
            last_update: 0,
        }
    }

    /// Met à jour les données météo depuis l'oracle Nautilus
    public fun update_weather_data(
        oracle_feed: &mut OracleFeed,
        weather_data: WeatherData,
        _ctx: &mut TxContext
    ) {
        // Vérifier que l'oracle est autorisé
        assert!(vec_set::contains(&oracle_feed.authorized_oracles, &weather_data.oracle_address), ERR_INVALID_ORACLE_DATA);
        
        // Stocker les données météo
        table::add(&mut oracle_feed.weather_data, weather_data.timestamp, weather_data);
        oracle_feed.last_update = weather_data.timestamp;

        // Émettre l'événement
        event::emit(OracleDataUpdated {
            oracle_feed_id: object::id(oracle_feed),
            timestamp: weather_data.timestamp,
            weather_index: if (weather_data.cumulative_rainfall > 0) weather_data.cumulative_rainfall else weather_data.rainfall_24h,
            oracle_address: weather_data.oracle_address,
        });
    }

    /// Crée une nouvelle police d'assurance paramétrique
    public fun create_parametric_policy(
        policyholder: address,
        product_type: u8,
        coverage_amount: u64,
        premium_amount: u64,
        coverage_start: u64,
        coverage_end: u64,
        trigger_threshold: u64,
        saturation_threshold: u64,
        coverage_area: CoverageArea,
        pool: &mut ParametricInsurancePool,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ): PolicyHolderCap {
        // Vérifier que le paiement est suffisant
        assert!(coin::value(&payment) >= premium_amount, ERR_INSUFFICIENT_FUNDS);

        let policy_id = object::id_from_address(tx_context::fresh_object_address(ctx));
        
        let policy = ParametricPolicy {
            id: object::new(ctx),
            policyholder,
            product_type,
            coverage_amount,
            premium_paid: premium_amount,
            coverage_start,
            coverage_end,
            trigger_threshold,
            saturation_threshold,
            coverage_area,
            status: 1, // active
        };

        let policy_holder_cap = PolicyHolderCap {
            id: object::new(ctx),
            policy_id,
        };

        // Ajouter la prime au pool
        balance::join(&mut pool.balance, coin::into_balance(payment));
        
        // Ajouter la police au pool
        table::add(&mut pool.active_policies, policy_id, policy);
        pool.pool_stats.total_policies = pool.pool_stats.total_policies + 1;
        pool.pool_stats.active_policies = pool.pool_stats.active_policies + 1;
        pool.pool_stats.total_premiums = pool.pool_stats.total_premiums + premium_amount;

        // Émettre l'événement
        event::emit(PolicyCreated {
            policy_id,
            policyholder,
            product_type,
            coverage_amount,
        });

        policy_holder_cap
    }

    /// Soumet une réclamation paramétrique
    public fun submit_parametric_claim(
        pool: &mut ParametricInsurancePool,
        oracle_feed: &OracleFeed,
        policy_id: object::ID,
        weather_index: u64,
        claim_type: u8,
        ctx: &mut TxContext
    ): object::ID {
        // Vérifier que la police existe
        assert!(table::contains(&pool.active_policies, policy_id), ERR_POLICY_NOT_FOUND);
        
        let policy = table::borrow_mut(&mut pool.active_policies, policy_id);
        assert!(policy.status == 1, ERR_POLICY_NOT_FOUND); // active
        assert!(policy.status != 3, ERR_POLICY_EXPIRED); // not expired

        // Calculer le montant de la réclamation
        let claim_amount = calculate_parametric_payout(
            policy,
            weather_index,
        );

        let claim = ParametricClaim {
            id: object::new(ctx),
            policy_id,
            claim_type,
            claim_amount,
            weather_index,
            claim_timestamp: oracle_feed.last_update,
            status: 1, // pending
            payout_justification: std::string::utf8(b"Parametric trigger met"),
        };

        // Obtenir l'ID avant de déplacer la réclamation
        let claim_id = object::id(&claim);
        
        // Ajouter la réclamation au pool
        table::add(&mut pool.pending_claims, claim_id, claim);
        pool.pool_stats.total_claims = pool.pool_stats.total_claims + 1;

        // Émettre l'événement
        event::emit(ClaimSubmitted {
            claim_id,
            policy_id,
            claim_amount,
            weather_index,
        });

        claim_id
    }

    /// Calcule le paiement paramétrique
    fun calculate_parametric_payout(
        policy: &ParametricPolicy,
        weather_index: u64,
    ): u64 {
        if (weather_index < policy.trigger_threshold) {
            return 0
        };

        if (weather_index >= policy.saturation_threshold) {
            return policy.coverage_amount
        };

        // Paiement linéaire entre trigger et saturation
        let range = policy.saturation_threshold - policy.trigger_threshold;
        let excess = weather_index - policy.trigger_threshold;
        (policy.coverage_amount * excess) / range
    }

    /// Approuve et traite une réclamation
    public fun process_claim(
        pool: &mut ParametricInsurancePool,
        claim_id: object::ID,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ): Coin<SUI> {
        // Vérifier les permissions admin
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);

        // Récupérer la réclamation
        assert!(table::contains(&pool.pending_claims, claim_id), ERR_POLICY_NOT_FOUND);
        let claim = table::remove(&mut pool.pending_claims, claim_id);
        
        // Vérifier le solde du pool
        assert!(balance::value(&pool.balance) >= claim.claim_amount, ERR_INSUFFICIENT_FUNDS);

        // Créer le paiement
        let payout_balance = balance::split(&mut pool.balance, claim.claim_amount);
        pool.pool_stats.total_payouts = pool.pool_stats.total_payouts + claim.claim_amount;

        // Nettoyer la réclamation
        let ParametricClaim { id, policy_id: _, claim_type: _, claim_amount: _, weather_index: _, claim_timestamp: _, status: _, payout_justification: _ } = claim;
        object::delete(id);

        coin::from_balance(payout_balance, ctx)
    }

    /// Ajoute des fonds au pool
    public fun add_liquidity(
        pool: &mut ParametricInsurancePool,
        payment: Coin<SUI>,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);
        balance::join(&mut pool.balance, coin::into_balance(payment));
    }

    /// Retire des fonds du pool
    public fun withdraw_liquidity(
        pool: &mut ParametricInsurancePool,
        amount: u64,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);
        let balance = balance::split(&mut pool.balance, amount);
        coin::from_balance(balance, ctx)
    }

    // ===== VIEW FUNCTIONS =====

    /// Retourne les statistiques du pool
    public fun get_pool_stats(pool: &ParametricInsurancePool): PoolStats {
        pool.pool_stats
    }

    /// Retourne le solde du pool
    public fun get_pool_balance(pool: &ParametricInsurancePool): u64 {
        balance::value(&pool.balance)
    }

    /// Vérifie si une police existe
    public fun policy_exists(pool: &ParametricInsurancePool, policy_id: object::ID): bool {
        table::contains(&pool.active_policies, policy_id)
    }

    /// Retourne les détails d'une police
    public fun get_policy_details(pool: &ParametricInsurancePool, policy_id: object::ID): (address, u8, u64, u64, u64, u64, u8) {
        assert!(table::contains(&pool.active_policies, policy_id), ERR_POLICY_NOT_FOUND);
        let policy = table::borrow(&pool.active_policies, policy_id);
        (
            policy.policyholder,
            policy.product_type,
            policy.coverage_amount,
            policy.premium_paid,
            policy.coverage_start,
            policy.coverage_end,
            policy.status
        )
    }
}
