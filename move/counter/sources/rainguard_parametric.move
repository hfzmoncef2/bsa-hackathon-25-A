module rainguard::parametric_insurance {
    use std::string::String;
    use std::vector;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use sui::vec_map::{Self, VecMap};
    use sui::event;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    // ===== CONSTANTS =====
    const ERR_INSUFFICIENT_FUNDS: u64 = 0;
    const ERR_INVALID_ORACLE_DATA: u64 = 1;
    const ERR_POLICY_NOT_FOUND: u64 = 2;
    const ERR_CLAIM_ALREADY_PROCESSED: u64 = 3;
    const ERR_INVALID_WEATHER_INDEX: u64 = 4;
    const ERR_ORACLE_QUORUM_NOT_MET: u64 = 5;
    const ERR_POLICY_EXPIRED: u64 = 6;

    // Types de produits d'assurance
    const PRODUCT_TYPE_SEASONAL: u8 = 1;  // Basé sur la pluie cumulée
    const PRODUCT_TYPE_EVENT: u8 = 2;     // Basé sur la pluie 24h

    // ===== STRUCTS =====

    /// Oracle météo sécurisé Nautilus TEE
    public struct OracleFeed has key, store {
        id: UID,
        /// Données météo signées par l'oracle
        weather_data: Table<u64, WeatherData>,
        /// Quorum requis pour validation
        quorum_threshold: u8,
        /// Oracles autorisés
        authorized_oracles: VecSet<address>,
        /// Timestamp de la dernière mise à jour
        last_update: u64,
    }

    /// Données météo validées par l'oracle
    public struct WeatherData has store {
        /// Timestamp de la mesure
        timestamp: u64,
        /// Latitude de la station météo
        latitude: u64,
        /// Longitude de la station météo  
        longitude: u64,
        /// Pluie cumulée (mm) pour produit saisonnier
        cumulative_rainfall: u64,
        /// Pluie 24h (mm) pour produit événementiel
        rainfall_24h: u64,
        /// Signature de l'oracle Nautilus
        oracle_signature: vector<u8>,
        /// Adresse de l'oracle qui a signé
        oracle_address: address,
        /// Indice de confiance (0-100)
        confidence_score: u8,
    }

    /// Police d'assurance paramétrique
    public struct ParametricPolicy has key, store {
        id: UID,
        /// Adresse du propriétaire
        policyholder: address,
        /// Type de produit (saisonnier ou événementiel)
        product_type: u8,
        /// Montant de couverture
        coverage_amount: u64,
        /// Prime payée
        premium_paid: u64,
        /// Période de couverture (début)
        coverage_start: u64,
        /// Période de couverture (fin)
        coverage_end: u64,
        /// Seuil de déclenchement (mm de pluie)
        trigger_threshold: u64,
        /// Seuil de saturation (mm de pluie)
        saturation_threshold: u64,
        /// Coordonnées géographiques couvertes
        coverage_area: CoverageArea,
        /// Statut de la police
        status: u8, // 1=active, 2=expired, 3=claimed
        /// Réclamations traitées
        claims_processed: u64,
        /// Montant total des paiements
        total_payouts: u64,
    }

    /// Zone géographique de couverture
    public struct CoverageArea has store {
        /// Latitude du centre
        center_latitude: u64,
        /// Longitude du centre
        center_longitude: u64,
        /// Rayon de couverture (mètres)
        radius_meters: u64,
    }

    /// Réclamation paramétrique
    public struct ParametricClaim has key, store {
        id: UID,
        /// ID de la police
        policy_id: ID,
        /// Type de réclamation
        claim_type: u8,
        /// Montant réclamé
        claim_amount: u64,
        /// Indice météo au moment de la réclamation
        weather_index: u64,
        /// Timestamp de la réclamation
        claim_timestamp: u64,
        /// Statut de la réclamation
        status: u8, // 1=pending, 2=approved, 3=rejected
        /// Justification du paiement
        payout_justification: String,
    }

    /// Pool d'assurance paramétrique
    public struct ParametricInsurancePool has key {
        id: UID,
        /// Solde total du pool
        total_balance: Balance<SUI>,
        /// Polices actives
        active_policies: Table<ID, ParametricPolicy>,
        /// Réclamations en cours
        pending_claims: Table<ID, ParametricClaim>,
        /// Statistiques du pool
        pool_stats: PoolStats,
        /// Oracle feeds autorisés
        authorized_oracle_feeds: VecSet<ID>,
    }

    /// Statistiques du pool
    public struct PoolStats has store {
        /// Nombre total de polices
        total_policies: u64,
        /// Nombre de polices actives
        active_policies: u64,
        /// Nombre total de réclamations
        total_claims: u64,
        /// Montant total des primes collectées
        total_premiums: u64,
        /// Montant total des paiements
        total_payouts: u64,
        /// Réclamations approuvées
        approved_claims: u64,
    }

    /// Capacité d'administration du pool
    public struct AdminCap has key, store {
        id: UID,
        /// Adresse de l'administrateur
        admin_address: address,
    }

    /// Capacité de détenteur de police
    public struct PolicyHolderCap has key, store {
        id: UID,
        /// ID de la police
        policy_id: ID,
        /// Adresse du détenteur
        holder_address: address,
    }

    // ===== EVENTS =====

    public struct PolicyCreated has copy, drop {
        policy_id: ID,
        policyholder: address,
        product_type: u8,
        coverage_amount: u64,
        premium: u64,
    }

    public struct ClaimSubmitted has copy, drop {
        claim_id: ID,
        policy_id: ID,
        claim_amount: u64,
        weather_index: u64,
    }

    public struct ClaimProcessed has copy, drop {
        claim_id: ID,
        policy_id: ID,
        payout_amount: u64,
        status: u8,
    }

    public struct OracleDataUpdated has copy, drop {
        oracle_feed_id: ID,
        timestamp: u64,
        weather_index: u64,
        oracle_address: address,
    }

    // ===== INITIALIZATION =====

    /// Initialise le système d'assurance paramétrique
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
            admin_address: tx_context::sender(ctx),
        };

        let pool = ParametricInsurancePool {
            id: object::new(ctx),
            total_balance: balance::zero<SUI>(),
            active_policies: table::new(ctx),
            pending_claims: table::new(ctx),
            pool_stats: PoolStats {
                total_policies: 0,
                active_policies: 0,
                total_claims: 0,
                total_premiums: 0,
                total_payouts: 0,
                approved_claims: 0,
            },
            authorized_oracle_feeds: vec_set::empty(),
        };

        transfer::share_object(pool);
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // ===== ORACLE MANAGEMENT =====

    /// Crée un nouveau feed oracle
    public fun create_oracle_feed(
        quorum_threshold: u8,
        authorized_oracles: vector<address>,
        ctx: &mut TxContext
    ): OracleFeed {
        let mut oracle_set = vec_set::empty<address>();
        let i = 0;
        while (i < vector::length(&authorized_oracles)) {
            vec_set::insert(&mut oracle_set, *vector::borrow(&authorized_oracles, i));
            i = i + 1;
        };

        OracleFeed {
            id: object::new(ctx),
            weather_data: table::new(ctx),
            quorum_threshold,
            authorized_oracles: oracle_set,
            last_update: 0,
        }
    }

    /// Met à jour les données météo depuis l'oracle Nautilus
    public fun update_weather_data(
        oracle_feed: &mut OracleFeed,
        weather_data: WeatherData,
        ctx: &mut TxContext
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

    // ===== POLICY MANAGEMENT =====

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
        ctx: &mut TxContext
    ): (ParametricPolicy, PolicyHolderCap) {
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
            claims_processed: 0,
            total_payouts: 0,
        };

        let policy_cap = PolicyHolderCap {
            id: object::new(ctx),
            policy_id,
            holder_address: policyholder,
        };

        // Ajouter la police au pool
        table::add(&mut pool.active_policies, policy_id, policy);
        
        // Mettre à jour les statistiques
        pool.pool_stats.total_policies = pool.pool_stats.total_policies + 1;
        pool.pool_stats.active_policies = pool.pool_stats.active_policies + 1;
        pool.pool_stats.total_premiums = pool.pool_stats.total_premiums + premium_amount;

        // Émettre l'événement
        event::emit(PolicyCreated {
            policy_id,
            policyholder,
            product_type,
            coverage_amount,
            premium: premium_amount,
        });

        (policy, policy_cap)
    }

    // ===== CLAIM PROCESSING =====

    /// Soumet une réclamation paramétrique
    public fun submit_parametric_claim(
        policy_id: ID,
        claim_type: u8,
        weather_index: u64,
        oracle_feed: &OracleFeed,
        pool: &mut ParametricInsurancePool,
        ctx: &mut TxContext
    ): ParametricClaim {
        // Récupérer la police
        let policy = table::borrow_mut(&mut pool.active_policies, policy_id);
        assert!(policy.status == 1, ERR_POLICY_NOT_FOUND); // active
        assert!(policy.status != 3, ERR_POLICY_EXPIRED); // not expired

        // Vérifier que les données oracle sont récentes
        let current_time = clock::timestamp_ms(clock::Clock::dummy());
        assert!(oracle_feed.last_update > current_time - 3600000, ERR_INVALID_ORACLE_DATA); // 1 heure

        // Calculer le montant de la réclamation
        let claim_amount = calculate_parametric_payout(
            policy,
            weather_index,
            claim_type
        );

        let claim = ParametricClaim {
            id: object::new(ctx),
            policy_id,
            claim_type,
            claim_amount,
            weather_index,
            claim_timestamp: current_time,
            status: 1, // pending
            payout_justification: string::utf8(b"Parametric trigger met"),
        };

        // Ajouter la réclamation au pool
        table::add(&mut pool.pending_claims, object::id(&claim), claim);
        pool.pool_stats.total_claims = pool.pool_stats.total_claims + 1;

        // Émettre l'événement
        event::emit(ClaimSubmitted {
            claim_id: object::id(&claim),
            policy_id,
            claim_amount,
            weather_index,
        });

        claim
    }

    /// Traite une réclamation paramétrique
    public fun process_parametric_claim(
        claim_id: ID,
        pool: &mut ParametricInsurancePool,
        ctx: &mut TxContext
    ) {
        let claim = table::borrow_mut(&mut pool.pending_claims, claim_id);
        assert!(claim.status == 1, ERR_CLAIM_ALREADY_PROCESSED); // pending

        let policy = table::borrow_mut(&mut pool.active_policies, claim.policy_id);
        
        // Vérifier les conditions de déclenchement
        let should_pay = check_parametric_trigger(
            policy,
            claim.weather_index,
            claim.claim_type
        );

        if (should_pay) {
            // Approuver la réclamation
            claim.status = 2; // approved
            policy.claims_processed = policy.claims_processed + 1;
            policy.total_payouts = policy.total_payouts + claim.claim_amount;
            
            pool.pool_stats.approved_claims = pool.pool_stats.approved_claims + 1;
            pool.pool_stats.total_payouts = pool.pool_stats.total_payouts + claim.claim_amount;
        } else {
            // Rejeter la réclamation
            claim.status = 3; // rejected
        };

        // Émettre l'événement
        event::emit(ClaimProcessed {
            claim_id,
            policy_id: claim.policy_id,
            payout_amount: claim.claim_amount,
            status: claim.status,
        });
    }

    // ===== PARAMETRIC CALCULATIONS =====

    /// Calcule le paiement paramétrique
    fun calculate_parametric_payout(
        policy: &ParametricPolicy,
        weather_index: u64,
        claim_type: u8
    ): u64 {
        if (weather_index < policy.trigger_threshold) {
            return 0
        };

        let payout_percentage: u64;
        
        if (weather_index >= policy.saturation_threshold) {
            // Paiement complet
            payout_percentage = 100
        } else {
            // Paiement proportionnel
            let range = policy.saturation_threshold - policy.trigger_threshold;
            let excess = weather_index - policy.trigger_threshold;
            payout_percentage = (excess * 100) / range
        };

        (policy.coverage_amount * payout_percentage) / 100
    }

    /// Vérifie si les conditions paramétriques sont remplies
    fun check_parametric_trigger(
        policy: &ParametricPolicy,
        weather_index: u64,
        claim_type: u8
    ): bool {
        // Vérifier le type de produit
        if (policy.product_type == PRODUCT_TYPE_SEASONAL) {
            // Produit saisonnier : pluie cumulée
            return weather_index >= policy.trigger_threshold
        } else if (policy.product_type == PRODUCT_TYPE_EVENT) {
            // Produit événementiel : pluie 24h
            return weather_index >= policy.trigger_threshold
        };

        false
    }

    // ===== VIEW FUNCTIONS =====

    /// Récupère les statistiques du pool
    public fun get_pool_stats(pool: &ParametricInsurancePool): PoolStats {
        pool.pool_stats
    }

    /// Récupère une police par ID
    public fun get_policy(pool: &ParametricInsurancePool, policy_id: ID): &ParametricPolicy {
        table::borrow(&pool.active_policies, policy_id)
    }

    /// Récupère une réclamation par ID
    public fun get_claim(pool: &ParametricInsurancePool, claim_id: ID): &ParametricClaim {
        table::borrow(&pool.pending_claims, claim_id)
    }

    /// Récupère les données météo d'un oracle
    public fun get_weather_data(oracle_feed: &OracleFeed, timestamp: u64): &WeatherData {
        table::borrow(&oracle_feed.weather_data, timestamp)
    }

    // ===== ADMIN FUNCTIONS =====

    /// Ajoute un oracle feed autorisé
    public fun add_authorized_oracle_feed(
        pool: &mut ParametricInsurancePool,
        oracle_feed_id: ID,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);
        vec_set::insert(&mut pool.authorized_oracle_feeds, oracle_feed_id);
    }

    /// Dépôt de fonds dans le pool
    public fun deposit_funds(
        pool: &mut ParametricInsurancePool,
        payment: Coin<SUI>,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);
        let balance = coin::into_balance(payment);
        balance::join(&mut pool.total_balance, balance);
    }

    /// Retrait de fonds du pool
    public fun withdraw_funds(
        pool: &mut ParametricInsurancePool,
        amount: u64,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(admin_cap.admin_address == tx_context::sender(ctx), ERR_INSUFFICIENT_FUNDS);
        let balance = balance::split(&mut pool.total_balance, amount);
        coin::from_balance(balance, ctx)
    }
}
