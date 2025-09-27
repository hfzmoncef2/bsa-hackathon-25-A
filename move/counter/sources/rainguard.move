// Copyright (c) RainGuard Insurance, Inc.
// SPDX-License-Identifier: Apache-2.0

/// RainGuard Insurance Contract
/// A comprehensive insurance system for weather-related agricultural risks
module rainguard::rainguard {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use sui::event;

    // ========== STRUCTS ==========

    /// Insurance policy data structure
    public struct InsurancePolicy has key {
        id: UID,
        policy_id: u64,
        policyholder: address,
        coverage_amount: u64,
        premium_amount: u64,
        coverage_period_days: u64,
        start_date: u64,
        end_date: u64,
        risk_types: VecSet<u8>,
        status: u8,
        land_area_hectares: u64,
        crop_type: vector<u8>,
        location: vector<u8>,
        deductible: u64,
        max_payout: u64,
        weather_thresholds: Table<u8, u64>,
    }

    /// Insurance claim data structure
    public struct InsuranceClaim has key {
        id: UID,
        claim_id: u64,
        policy_id: u64,
        claimant: address,
        claim_amount: u64,
        weather_data: Table<vector<u8>, u64>,
        damage_assessment: vector<u8>,
        claim_date: u64,
        status: u8,
        payout_amount: u64,
        validator_notes: vector<u8>,
    }

    /// Weather data for validation
    public struct WeatherData has store {
        temperature: u64,
        rainfall_mm: u64,
        humidity: u64,
        wind_speed: u64,
        timestamp: u64,
        location: vector<u8>,
    }

    /// Insurance pool for managing funds
    public struct InsurancePool has key {
        id: UID,
        total_premiums: u64,
        total_payouts: u64,
        available_funds: u64,
        active_policies: u64,
        total_claims: u64,
    }

    /// Policy holder capability
    public struct PolicyHolderCap has key {
        id: UID,
        policy_id: u64,
    }

    /// Insurance administrator capability
    public struct AdminCap has key {
        id: UID,
    }

    // ========== CONSTANTS ==========

    const POLICY_STATUS_ACTIVE: u8 = 1;
    const POLICY_STATUS_CANCELLED: u8 = 3;
    const POLICY_STATUS_CLAIMED: u8 = 4;

    const RISK_TYPE_DROUGHT: u8 = 1;
    const RISK_TYPE_FLOOD: u8 = 2;
    const RISK_TYPE_HAIL: u8 = 3;
    const RISK_TYPE_EXCESSIVE_RAIN: u8 = 4;
    const RISK_TYPE_FROST: u8 = 5;

    const CLAIM_STATUS_PENDING: u8 = 1;
    const CLAIM_STATUS_APPROVED: u8 = 2;
    const CLAIM_STATUS_REJECTED: u8 = 3;
    const CLAIM_STATUS_PAID: u8 = 4;

    const E_UNAUTHORIZED: u64 = 1;
    const E_POLICY_EXPIRED: u64 = 2;
    const E_INSUFFICIENT_FUNDS: u64 = 3;
    const E_INVALID_CLAIM: u64 = 4;
    const E_CLAIM_ALREADY_PROCESSED: u64 = 6;

    // ========== INITIALIZATION ==========

    /// Initialize the insurance system
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        let pool = InsurancePool {
            id: object::new(ctx),
            total_premiums: 0,
            total_payouts: 0,
            available_funds: 0,
            active_policies: 0,
            total_claims: 0,
        };
        transfer::share_object(pool);
    }

    // ========== POLICY MANAGEMENT ==========

    /// Create a new insurance policy
    public fun create_policy(
        policyholder: address,
        coverage_amount: u64,
        premium_amount: u64,
        coverage_period_days: u64,
        risk_types: vector<u8>,
        land_area_hectares: u64,
        crop_type: vector<u8>,
        location: vector<u8>,
        deductible: u64,
        weather_thresholds: vector<u8>,
        threshold_values: vector<u64>,
        pool: &mut InsurancePool,
        ctx: &mut TxContext
    ): (InsurancePolicy, PolicyHolderCap) {
        let current_time = 0; // Simplified for now
        let start_date = current_time;
        let end_date = start_date + (coverage_period_days * 24 * 60 * 60 * 1000);

        let mut risk_types_set = vec_set::empty();
        let mut i = 0;
        while (i < vector::length(&risk_types)) {
            vec_set::insert(&mut risk_types_set, *vector::borrow(&risk_types, i));
            i = i + 1;
        };

        let mut weather_thresholds_table = table::new<u8, u64>(ctx);
        let mut j = 0;
        while (j < vector::length(&weather_thresholds)) {
            table::add(&mut weather_thresholds_table, *vector::borrow(&weather_thresholds, j), *vector::borrow(&threshold_values, j));
            j = j + 1;
        };

        let policy = InsurancePolicy {
            id: object::new(ctx),
            policy_id: pool.active_policies + 1,
            policyholder,
            coverage_amount,
            premium_amount,
            coverage_period_days,
            start_date,
            end_date,
            risk_types: risk_types_set,
            status: POLICY_STATUS_ACTIVE,
            land_area_hectares,
            crop_type,
            location,
            deductible,
            max_payout: coverage_amount,
            weather_thresholds: weather_thresholds_table,
        };

        let policy_cap = PolicyHolderCap {
            id: object::new(ctx),
            policy_id: pool.active_policies + 1,
        };

        pool.active_policies = pool.active_policies + 1;
        pool.total_premiums = pool.total_premiums + premium_amount;
        pool.available_funds = pool.available_funds + premium_amount;

        (policy, policy_cap)
    }

    /// Update policy details (only by policyholder)
    public fun update_policy(
        policy: &mut InsurancePolicy,
        new_coverage_amount: u64,
        new_premium_amount: u64,
        new_risk_types: vector<u8>,
        new_weather_thresholds: vector<u8>,
        new_threshold_values: vector<u64>,
        ctx: &mut TxContext
    ) {
        assert!(policy.policyholder == tx_context::sender(ctx), E_UNAUTHORIZED);
        assert!(policy.status == POLICY_STATUS_ACTIVE, E_POLICY_EXPIRED);

        policy.coverage_amount = new_coverage_amount;
        policy.premium_amount = new_premium_amount;
        policy.max_payout = new_coverage_amount;

        // Update risk types
        policy.risk_types = vec_set::empty();
        let mut i = 0;
        while (i < vector::length(&new_risk_types)) {
            vec_set::insert(&mut policy.risk_types, *vector::borrow(&new_risk_types, i));
            i = i + 1;
        };

        // Update weather thresholds - cannot reassign Table, skip for now
        // policy.weather_thresholds = table::new<u8, u64>(ctx);
        let mut j = 0;
        while (j < vector::length(&new_weather_thresholds)) {
            table::add(&mut policy.weather_thresholds, *vector::borrow(&new_weather_thresholds, j), *vector::borrow(&new_threshold_values, j));
            j = j + 1;
        };
    }

    /// Cancel a policy
    public fun cancel_policy(
        policy: &mut InsurancePolicy,
        policy_cap: PolicyHolderCap,
        ctx: &TxContext
    ) {
        assert!(policy.policyholder == tx_context::sender(ctx), E_UNAUTHORIZED);
        assert!(policy.status == POLICY_STATUS_ACTIVE, E_POLICY_EXPIRED);

        policy.status = POLICY_STATUS_CANCELLED;
        let PolicyHolderCap { id, policy_id: _ } = policy_cap;
        object::delete(id);
    }

    /// Check if policy is expired
    public fun is_policy_expired(policy: &InsurancePolicy, clock: &Clock): bool {
        clock::timestamp_ms(clock) > policy.end_date
    }

    // ========== CLAIM MANAGEMENT ==========

    /// Submit an insurance claim
    public fun submit_claim(
        policy: &mut InsurancePolicy,
        claim_amount: u64,
        weather_data: vector<vector<u8>>,
        weather_values: vector<u64>,
        damage_assessment: vector<u8>,
        pool: &mut InsurancePool,
        ctx: &mut TxContext
    ): InsuranceClaim {
        assert!(policy.policyholder == tx_context::sender(ctx), E_UNAUTHORIZED);
        assert!(policy.status == POLICY_STATUS_ACTIVE, E_POLICY_EXPIRED);
        assert!(claim_amount <= policy.max_payout, E_INVALID_CLAIM);

        let current_time = 0; // Simplified for now
        let mut weather_data_table = table::new<vector<u8>, u64>(ctx);
        let mut i = 0;
        while (i < vector::length(&weather_data)) {
            table::add(&mut weather_data_table, *vector::borrow(&weather_data, i), *vector::borrow(&weather_values, i));
            i = i + 1;
        };

        let claim = InsuranceClaim {
            id: object::new(ctx),
            claim_id: pool.total_claims + 1,
            policy_id: policy.policy_id,
            claimant: policy.policyholder,
            claim_amount,
            weather_data: weather_data_table,
            damage_assessment,
            claim_date: current_time,
            status: CLAIM_STATUS_PENDING,
            payout_amount: 0,
            validator_notes: b"",
        };

        pool.total_claims = pool.total_claims + 1;
        policy.status = POLICY_STATUS_CLAIMED;

        claim
    }

    /// Validate weather data against policy thresholds
    public fun validate_weather_claim(
        policy: &InsurancePolicy,
        claim: &InsuranceClaim,
        risk_type: u8
    ): bool {
        if (!vec_set::contains(&policy.risk_types, &risk_type)) {
            return false
        };

        let threshold = table::borrow(&policy.weather_thresholds, risk_type);
        let weather_value = table::borrow(&claim.weather_data, b"rainfall_mm");

        match (risk_type) {
            RISK_TYPE_DROUGHT => *weather_value < *threshold,
            RISK_TYPE_FLOOD => *weather_value > *threshold,
            RISK_TYPE_HAIL => *weather_value > *threshold,
            RISK_TYPE_EXCESSIVE_RAIN => *weather_value > *threshold,
            RISK_TYPE_FROST => *weather_value < *threshold,
            _ => false,
        }
    }

    /// Process and approve a claim
    public fun approve_claim(
        claim: &mut InsuranceClaim,
        policy: &InsurancePolicy,
        pool: &mut InsurancePool,
        admin_cap: &AdminCap,
        payout_amount: u64,
        validator_notes: vector<u8>,
        ctx: &TxContext
    ) {
        assert!(claim.status == CLAIM_STATUS_PENDING, E_CLAIM_ALREADY_PROCESSED);
        assert!(payout_amount <= claim.claim_amount, E_INVALID_CLAIM);
        assert!(payout_amount <= pool.available_funds, E_INSUFFICIENT_FUNDS);

        claim.status = CLAIM_STATUS_APPROVED;
        claim.payout_amount = payout_amount;
        claim.validator_notes = validator_notes;

        pool.total_payouts = pool.total_payouts + payout_amount;
        pool.available_funds = pool.available_funds - payout_amount;
    }

    /// Reject a claim
    public fun reject_claim(
        claim: &mut InsuranceClaim,
        admin_cap: &AdminCap,
        validator_notes: vector<u8>,
        ctx: &TxContext
    ) {
        assert!(claim.status == CLAIM_STATUS_PENDING, E_CLAIM_ALREADY_PROCESSED);

        claim.status = CLAIM_STATUS_REJECTED;
        claim.validator_notes = validator_notes;
    }

    /// Pay out an approved claim
    public fun payout_claim(
        claim: &mut InsuranceClaim,
        pool: &mut InsurancePool,
        admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(claim.status == CLAIM_STATUS_APPROVED, E_INVALID_CLAIM);

        claim.status = CLAIM_STATUS_PAID;
        // In a real implementation, you would transfer SUI tokens here
    }

    // ========== WEATHER INTEGRATION ==========

    /// Record weather data for a location
    public fun record_weather_data(
        temperature: u64,
        rainfall_mm: u64,
        humidity: u64,
        wind_speed: u64,
        location: vector<u8>,
        ctx: &mut TxContext
    ): WeatherData {
        WeatherData {
            temperature,
            rainfall_mm,
            humidity,
            wind_speed,
            timestamp: 0, // Simplified for now
            location,
        }
    }

    /// Check if weather conditions trigger automatic claim
    public fun check_weather_trigger(
        policy: &InsurancePolicy,
        weather: &WeatherData,
        risk_type: u8
    ): bool {
        if (!vec_set::contains(&policy.risk_types, &risk_type)) {
            return false
        };

        let threshold = table::borrow(&policy.weather_thresholds, risk_type);

        match (risk_type) {
            RISK_TYPE_DROUGHT => weather.rainfall_mm < *threshold,
            RISK_TYPE_FLOOD => weather.rainfall_mm > *threshold,
            RISK_TYPE_HAIL => weather.rainfall_mm > *threshold,
            RISK_TYPE_EXCESSIVE_RAIN => weather.rainfall_mm > *threshold,
            RISK_TYPE_FROST => weather.temperature < *threshold,
            _ => false,
        }
    }

    // ========== POOL MANAGEMENT ==========

    /// Add funds to the insurance pool
    public fun add_funds_to_pool(
        pool: &mut InsurancePool,
        amount: u64,
        admin_cap: &AdminCap,
        ctx: &TxContext
    ) {
        pool.available_funds = pool.available_funds + amount;
    }

    /// Get pool statistics
    public fun get_pool_stats(pool: &InsurancePool): (u64, u64, u64, u64, u64) {
        (pool.total_premiums, pool.total_payouts, pool.available_funds, pool.active_policies, pool.total_claims)
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get policy details
    public fun get_policy_details(policy: &InsurancePolicy): (u64, address, u64, u64, u64, u64, u8, vector<u8>, vector<u8>) {
        (policy.policy_id, policy.policyholder, policy.coverage_amount, policy.premium_amount, policy.start_date, policy.end_date, policy.status, policy.crop_type, policy.location)
    }

    /// Get claim details
    public fun get_claim_details(claim: &InsuranceClaim): (u64, u64, address, u64, u64, u8, vector<u8>) {
        (claim.claim_id, claim.policy_id, claim.claimant, claim.claim_amount, claim.payout_amount, claim.status, claim.damage_assessment)
    }

    /// Check if policyholder has active policy
    public fun has_active_policy(policy: &InsurancePolicy): bool {
        policy.status == POLICY_STATUS_ACTIVE
    }

    // ========== EVENTS ==========

    /// Emit policy creation event
    public fun emit_policy_created(policy_id: u64, policyholder: address, coverage_amount: u64) {
        event::emit(PolicyCreated {
            policy_id,
            policyholder,
            coverage_amount,
        });
    }

    /// Emit claim submitted event
    public fun emit_claim_submitted(claim_id: u64, policy_id: u64, claim_amount: u64) {
        event::emit(ClaimSubmitted {
            claim_id,
            policy_id,
            claim_amount,
        });
    }

    /// Emit claim approved event
    public fun emit_claim_approved(claim_id: u64, payout_amount: u64) {
        event::emit(ClaimApproved {
            claim_id,
            payout_amount,
        });
    }

    // ========== EVENT STRUCTS ==========

    public struct PolicyCreated has copy, drop {
        policy_id: u64,
        policyholder: address,
        coverage_amount: u64,
    }

    public struct ClaimSubmitted has copy, drop {
        claim_id: u64,
        policy_id: u64,
        claim_amount: u64,
    }

    public struct ClaimApproved has copy, drop {
        claim_id: u64,
        payout_amount: u64,
    }
}