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
}
