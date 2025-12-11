export interface TreasuryState {
    satReserves: number; // USD value of Safe Asset Token reserves
    saitHoldings: number; // Number of SAIT tokens held
    monthlyInflows: {
        saitSales: number; // Revenue from selling SAIT (5% of 30M annually)
        grantRecoveries: number; // 10% of funded grants
        lpFees: number; // 0.3% from SAIT/ETH pair
    };
    monthlyOutflows: {
        buybacks: number; // Cost in USD (SATs)
        operations: number; // Operational costs
    };
}

export const INITIAL_SAT_RESERVES = 50_000_000; // $50M institutional capital
export const ANNUAL_SAIT_SALES_PCT = 0.05; // 5% of allocation per year
export const TREASURY_TOTAL_ALLOCATION = 30_000_000;

export interface TreasuryInput {
    month: number;
    saitPrice: number;
    buybackCost: number; // USD required for buybacks this month
    operationalSpend: number; // USD
    prevReserves: number; // USD
    prevSaitHoldings: number;
}

export function calculateMonthlyTreasuryFlow(input: TreasuryInput): TreasuryState {
    // 1. Inflows

    // SAIT Sales: 5% of 30M annually = 1.5M/year = 125,000/month
    // Sales stop if holdings are depleted (checked externally or here)
    const monthlySaitSalesVolume = Math.min(125_000, input.prevSaitHoldings);
    const saitSalesRevenue = monthlySaitSalesVolume * input.saitPrice;

    // Grant Recoveries: Assumed baseline (can be parameterized later)
    // Plan says: "10% of funded grants". Let's assume a ramp up.
    // Simple model: Start small, grow to $200k/month by Year 1 end
    const rampFactor = Math.min(1, input.month / 12);
    const grantRecoveries = 200_000 * rampFactor;

    // LP Fees: 0.3% on volume.
    // Volume model: Assume volume is proportional to Market Cap or just growing.
    // Plan: "50,000 conservative estimate"
    const lpFees = 50_000 * Math.max(1, input.month / 6); // Slight growth

    const totalInflow = saitSalesRevenue + grantRecoveries + lpFees;

    // 2. Outflows
    const totalOutflow = input.buybackCost + input.operationalSpend;

    // 3. New State
    const newReserves = input.prevReserves + totalInflow - totalOutflow;
    const newSaitHoldings = input.prevSaitHoldings - monthlySaitSalesVolume;

    return {
        satReserves: newReserves,
        saitHoldings: Math.max(0, newSaitHoldings),
        monthlyInflows: {
            saitSales: saitSalesRevenue,
            grantRecoveries,
            lpFees
        },
        monthlyOutflows: {
            buybacks: input.buybackCost,
            operations: input.operationalSpend
        }
    };
}
