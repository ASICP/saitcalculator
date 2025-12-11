export const ABC_TOTAL_SUPPLY = 100_000_000;

// ABC Allocations (from ABC-Commons-Unified-Protocol.md)
export const ABC_ALLOCATIONS = {
    TREASURY: 50_000_000,   // 50%
    LIQUIDITY: 20_000_000,  // 20%
    INSTITUTE: 15_000_000,  // 15%
    PARTNERS: 10_000_000,   // 10%
    PUBLIC: 5_000_000       // 5%
};

// Vesting Schedules
// Treasury: 5-year emission schedule
// Year 1: 15M, Y2: 12M, Y3: 10M, Y4: 8M, Y5: 5M
export const COMMONS_EMISSION_SCHEDULE = [
    15_000_000, // Year 1 total
    12_000_000, // Year 2
    10_000_000, // Year 3
    8_000_000,  // Year 4
    5_000_000   // Year 5
];

// Paper submission fee (used in burn calculations)
export const ABC_PAPER_SUBMISSION_FEE = 10; // ABC tokens

export interface ABCScenarioData {
    month: number;
    circulatingSupply: number;
    treasuryEmitted: number;
    stakedCuration: number;
    stakedBounties: number;
    burnedTokens: number;
    price: number;
    marketCap: number;
    curationCount: number;
    activeBounties: number;
    authorityScoreAvg: number;
}

export interface ABCUsageParams {
    monthlyPapers: number;    // e.g. 150
    curatorsPerPaper: number; // e.g. 5
    bountiesPerMonth: number; // e.g. 20
    avgBountyStake: number;   // 5000 ABC
    avgBountySize: number;    // 50,000 ABC (approx $5k)
}

// Calculate Treasury Unlock for a given month (1-60)
export function getTreasuryUnlock(month: number): number {
    const yearIndex = Math.floor((month - 1) / 12);
    if (yearIndex >= 5) return ABC_ALLOCATIONS.TREASURY;

    const annualAmount = COMMONS_EMISSION_SCHEDULE[yearIndex];
    const monthlyAmount = annualAmount / 12;

    // Sum previous years
    let totalPrev = 0;
    for (let i = 0; i < yearIndex; i++) {
        totalPrev += COMMONS_EMISSION_SCHEDULE[i];
    }

    const currentYearProgress = ((month - 1) % 12) + 1;
    return totalPrev + (monthlyAmount * currentYearProgress);
}

/**
 * Calculate Institute Unlock for a given month.
 * @param month - Month number starting from 1 (not 0-indexed).
 * @returns Total unlocked ABC tokens from the Institute vault up to this month.
 */
export function getInstituteUnlock(month: number): number {
    if (month <= 6) return 0;
    if (month >= 30) return ABC_ALLOCATIONS.INSTITUTE;

    const duration = 24;
    const elapsed = month - 6;
    return ABC_ALLOCATIONS.INSTITUTE * (elapsed / duration);
}

// Calculate Liquidity Unlock (50% TGE, 50% 4yr linear)
export function getLiquidityUnlock(month: number): number {
    const tge = ABC_ALLOCATIONS.LIQUIDITY * 0.5;
    const remaining = ABC_ALLOCATIONS.LIQUIDITY * 0.5;
    if (month >= 48) return ABC_ALLOCATIONS.LIQUIDITY;

    return tge + (remaining * (month / 48));
}
