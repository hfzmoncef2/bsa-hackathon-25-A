/// Contrat d'assurance simple et fonctionnel
module 0x0::insurance {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Police d'assurance
    struct InsurancePolicy has key {
        id: UID,
        policy_id: ID,
        client_address: address,
        coverage_amount: u64,
        premium_amount: u64,
        risk_type: u8,
        status: u8,
        created_at: u64,
        // Conditions météo pour le remboursement
        max_temperature: u64,    // Température maximale (en dixièmes de degré)
        min_temperature: u64,    // Température minimale (en dixièmes de degré)
        max_rainfall: u64,       // Pluviométrie maximale (en mm)
        min_humidity: u64,       // Humidité minimale (en pourcentage)
        max_humidity: u64,       // Humidité maximale (en pourcentage)
        location_lat: u64,       // Latitude de la zone (en dixièmes de degré)
        location_lng: u64,       // Longitude de la zone (en dixièmes de degré)
        claim_amount: u64,       // Montant déjà réclamé
    }

    /// Capability pour le client
    struct PolicyCap has key {
        id: UID,
        policy_id: ID,
    }

    // ========== CONSTANTS ==========
    const STATUS_ACTIVE: u8 = 1;

    // ========== INIT FUNCTION ==========
    fun init(_ctx: &mut TxContext) {
        // Pas besoin d'objets globaux pour ce contrat simple
    }

    // ========== PUBLIC FUNCTIONS ==========

    /// Fonction pour créer une police d'assurance
    public fun create_policy_entry(
        coverage_amount: u64,
        premium_amount: u64,
        risk_type: u8,
        max_temperature: u64,
        min_temperature: u64,
        max_rainfall: u64,
        min_humidity: u64,
        max_humidity: u64,
        location_lat: u64,
        location_lng: u64,
        ctx: &mut TxContext
    ) {
        let policy_id = object::id_from_address(tx_context::sender(ctx));
        
        let policy = InsurancePolicy {
            id: object::new(ctx),
            policy_id,
            client_address: tx_context::sender(ctx),
            coverage_amount,
            premium_amount,
            risk_type,
            status: STATUS_ACTIVE,
            created_at: 0, // Timestamp simplifié pour la démo
            max_temperature,
            min_temperature,
            max_rainfall,
            min_humidity,
            max_humidity,
            location_lat,
            location_lng,
            claim_amount: 0,
        };

        let cap = PolicyCap {
            id: object::new(ctx),
            policy_id,
        };

        // Transférer la police au client
        transfer::transfer(policy, tx_context::sender(ctx));
        
        // Transférer la capability au client
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    /// Fonction pour vérifier les conditions météo et traiter les réclamations
    public fun check_weather_conditions_and_claim(
        policy: &mut InsurancePolicy,
        current_temperature: u64,
        current_rainfall: u64,
        current_humidity: u64,
        ctx: &mut TxContext
    ): u64 {
        let claim_amount = 0;
        
        // Vérifier les conditions de température
        if (current_temperature > policy.max_temperature || current_temperature < policy.min_temperature) {
            claim_amount = policy.coverage_amount;
        };
        
        // Vérifier les conditions de pluie
        if (current_rainfall > policy.max_rainfall) {
            claim_amount = policy.coverage_amount;
        };
        
        // Vérifier les conditions d'humidité
        if (current_humidity < policy.min_humidity || current_humidity > policy.max_humidity) {
            claim_amount = policy.coverage_amount;
        };
        
        // Mettre à jour le montant réclamé
        policy.claim_amount = policy.claim_amount + claim_amount;
        
        claim_amount
    }
}
