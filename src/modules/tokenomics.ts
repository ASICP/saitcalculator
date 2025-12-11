export const TOTAL_SUPPLY = 100_000_000;
export const AI_FUND_ALLOCATION = 50_000_000;
export const TREASURY_ALLOCATION = 30_000_000;
export const TEAM_ALLOCATION = 15_000_000;
export const PARTNER_ALLOCATION = 5_000_000;

// TGE Unlocks (Amounts)
export const TGE_AI_FUND = 2_500_000; // 5%
export const TGE_TREASURY = 6_000_000; // 20%
export const TGE_TEAM = 300_000; // 2%
export const TGE_PARTNERS = 930_000; // 18.6%
export const TGE_TOTAL = 9_730_000; // 9.73%

export type VaultType = 'AIFund' | 'Treasury' | 'Team' | 'Partners';
export type VestingType = 'milestone' | 'linear' | 'hybrid';

export interface KPIMilestone {
    id: string;
    name: string;
    tier: 1 | 2 | 3; // 1%, 2%, 3% unlock
    achievedMonth?: number;
}

export interface VestingSchedule {
    vault: VaultType;
    type: VestingType;
    cliff?: number; // months
    duration?: number; // months
    dripRate?: number; // tokens per month
}

export interface VaultState {
    total: number;
    unlocked: number;
    locked: number;
    vested: number;
    transferable: number; // After quarterly limits
}

/**
 * Calculates the amount vested for a given vault at a specific month.
 * Does NOT include TGE unlocks (those are separate).
 * @param schedule - Vesting schedule configuration for the vault
 * @param currentMonth - Current month (1-indexed)
 * @param completedKPIs - Array of completed KPI milestones (optional)
 * @param circulatingSupply - Current circulating supply (required for treasury milestone bonus cap)
 */
export function calculateVestedAmount(
    schedule: VestingSchedule,
    currentMonth: number,
    completedKPIs: KPIMilestone[] = [],
    circulatingSupply: number = 0
): number {
    // AI Fund: Milestone-based
    if (schedule.type === 'milestone') {
        return calculateKPIUnlocks(completedKPIs);
    }

    // Treasury: Hybrid (18-month drip + milestones)
    if (schedule.type === 'hybrid') {
        // Drip: 1.33M/month for 18 months (~24M total)
        // 24M locked, 18-month drip (1.33M/month)
        const dripMonths = Math.min(currentMonth, 18);
        const dripAmount = dripMonths * 1_333_333;

        // Cap drip at 24M (just in case rounding or extra months)
        const cappedDrip = Math.min(dripAmount, 24_000_000);

        // Treasury Milestone Bonuses: Variable but capped at 1% of circulating supply
        // These are separate from AI Fund KPI unlocks
        const rawMilestoneBonus = calculateKPIUnlocks(completedKPIs);
        const maxTreasuryBonus = circulatingSupply * 0.01; // 1% cap
        const milestoneBonus = Math.min(rawMilestoneBonus, maxTreasuryBonus);

        return cappedDrip + milestoneBonus;
    }

    // Team: Linear after cliff
    if (schedule.vault === 'Team') {
        // 14.7M locked, 48-month linear vest after 12-month cliff
        if (currentMonth < 12) return 0; // 1-year cliff
        const vestingMonths = currentMonth - 12;
        // 14.7M over 48 months
        const totalToVest = 14_700_000;
        const monthlyRate = totalToVest / 48;
        return Math.min(
            vestingMonths * monthlyRate,
            totalToVest
        );
    }

    // Partners: Linear
    if (schedule.vault === 'Partners') {
        // 4.07M locked, 24-month linear vest
        // Assuming no cliff? "2-year vest, 10% TGE" -> actually 18.6% TGE in table.
        // Table: Partners 5M total, 0.93M TGE (18.6%). 4.07M locked.
        // "Partners: 4.07M locked, 24-month linear vest"
        const totalToVest = 4_070_000;
        const monthlyRate = totalToVest / 24;
        return Math.min(
            currentMonth * monthlyRate,
            totalToVest
        );
    }

    return 0;
}

function calculateKPIUnlocks(completedKPIs: KPIMilestone[]): number {
    // Validation 1: Max 7 Active KPIs
    const activeKpiCount = completedKPIs.filter(k => k.achievedMonth !== undefined).length;
    if (activeKpiCount > 7) {
        console.warn('KPI Validation Error: Maximum 7 active KPIs allowed.');
        // For calculation safety, we might just proceed with the first 7, or return 0, but let's just log and cap.
    }

    let totalUnlockedPercent = 0;
    for (const kpi of completedKPIs) {
        if (kpi.achievedMonth !== undefined) {
            // Tier 1 (1%), Tier 2 (2%), Tier 3 (3%)
            totalUnlockedPercent += kpi.tier;
        }
    }

    // Validation 2: Max 21% Total Unlock
    if (totalUnlockedPercent > 21) {
        console.warn('KPI Validation Error: Unlocks exceed 21% limit. Capping at 21%.');
        totalUnlockedPercent = 21;
    }

    return totalUnlockedPercent * 1_000_000; // 1% = 1M tokens (since 100M total)
}
