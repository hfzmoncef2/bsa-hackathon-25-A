/// Simple RainGuard Insurance Contract - Version Minimale
module simple_rainguard::simple_rainguard {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;

    // ========== STRUCTS ==========

    /// Simple insurance policy
    public struct InsurancePolicy has key {
        id: UID,
        policy_id: u64,
        policyholder: address,
        coverage_amount: u64,
        premium_amount: u64,
        status: u8,
    }

    /// Admin capability
    public struct AdminCap has key {
        id: UID,
    }

    // ========== CONSTANTS ==========
    const STATUS_ACTIVE: u8 = 1;
    const STATUS_EXPIRED: u8 = 2;

    // ========== EVENTS ==========
    public struct PolicyCreated has copy, drop {
        policy_id: u64,
        policyholder: address,
        coverage_amount: u64,
    }

    // ========== INIT FUNCTION ==========
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // ========== PUBLIC FUNCTIONS ==========

    /// Create a new insurance policy
    public fun create_policy(
        admin_cap: &AdminCap,
        policy_id: u64,
        policyholder: address,
        coverage_amount: u64,
        premium_amount: u64,
        ctx: &mut TxContext
    ) {
        let policy = InsurancePolicy {
            id: object::new(ctx),
            policy_id,
            policyholder,
            coverage_amount,
            premium_amount,
            status: STATUS_ACTIVE,
        };

        event::emit(PolicyCreated {
            policy_id,
            policyholder,
            coverage_amount,
        });

        transfer::transfer(policy, policyholder);
    }

    /// Get policy info
    public fun get_policy_info(policy: &InsurancePolicy): (u64, address, u64, u64, u8) {
        (
            policy.policy_id,
            policy.policyholder,
            policy.coverage_amount,
            policy.premium_amount,
            policy.status,
        )
    }

    /// Update policy status
    public fun update_policy_status(
        policy: &mut InsurancePolicy,
        admin_cap: &AdminCap,
        new_status: u8,
    ) {
        policy.status = new_status;
    }
}

