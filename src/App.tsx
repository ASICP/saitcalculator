
import React, { useState, useMemo } from 'react';
import {
  TOTAL_SUPPLY,
  TGE_TOTAL,
  calculateVestedAmount,
  VaultState,
  VestingSchedule,
  KPIMilestone,
  TGE_AI_FUND,
  TGE_TREASURY,
  TGE_TEAM,
  TGE_PARTNERS,
  AI_FUND_ALLOCATION,
  TREASURY_ALLOCATION,
  TEAM_ALLOCATION,
  PARTNER_ALLOCATION
} from './modules/tokenomics';
import {
  calculateMonthlyTreasuryFlow,
  INITIAL_SAT_RESERVES,
  TREASURY_TOTAL_ALLOCATION
} from './modules/treasury';
import { STANDARD_KPIS } from './modules/governance';
import {
  ABC_TOTAL_SUPPLY,
  ABC_ALLOCATIONS,
  ABCScenarioData,
  ABCUsageParams,
  getTreasuryUnlock,
  getInstituteUnlock,
  getLiquidityUnlock,
  ABC_PAPER_SUBMISSION_FEE
} from './modules/abcTokenomics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface ScenarioData {
  month: number;
  price: number;
  circulatingSupply: number;
  escrowRemaining: number;
  totalBurned: number;
  marketCap: number;
  monthlyUnlocks: number;
  monthlyBurns: number; // Represents Buybacks tokens bought
  burnRate: number;
  speculatorHoldings: number;
  utilityBuyerHoldings: number;
  hodlerHoldings: number;
  sellPressure: number;
  complianceChecks: number;
  treasuryBalance: number; // SAT Reserves ($)
  treasuryInflow: number; // Total monthly inflow ($)
  treasuryRunway: number;
  operationalSpend: number;
  overhangRatio?: number;
  // Vault specific
  aiFundVested: number;
  treasuryVested: number;
  teamVested: number;
  partnersVested: number;
  // Treasury specifics
  saitHoldings: number;
  satReserves: number;
  priceFloor: number;
  premiumTarget: number;
}

interface Phase {
  name: string;
  startQuarter: number;
  totalPercent: number;
  durationQuarters: number;
  buckets: { research: number; ecosystem: number; team: number };
}

// Tooltip Component
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative inline-block ml-1 group z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="text-blue-500 hover:text-blue-700 cursor-pointer text-xs font-bold"
        type="button"
      >
        ⓘ
      </button>
      {show && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleBackdropClick}
          />
          <div
            className="fixed z-50 w-72 p-4 bg-white border-2 border-blue-500 rounded-lg shadow-xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={handleContentClick}
          >
            <div className="text-sm text-gray-700 leading-relaxed">{text}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="mt-3 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-semibold"
              type="button"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Tooltip Explanation Texts
const TOOLTIP_TEXTS = {
  unlocked: "The amount of tokens that have vested and are available from this vault. These tokens have passed their vesting schedule and can be used according to quarterly transfer limits.",
  kpiVesting: "Tokens unlock when Key Performance Indicators (KPIs) are achieved. Maximum 7 active KPIs, with combined unlocks capped at 21% of circulating supply.",
  finalPrice: "The projected SAIT price at the end of the simulation period, based on supply/demand dynamics, buyback pressure, and market sentiment factors.",
  marketCap: "Total value of all circulating SAIT tokens (Price × Circulating Supply). This represents the protocol's market valuation.",
  circulatingSupply: "The number of SAIT tokens currently in circulation, including vested tokens minus buybacks. Does not include locked tokens in vaults.",
  totalBoughtBack: "Total SAIT tokens removed from circulation through treasury buyback operations. Buybacks occur at 0.3%, 1.5%, and 2.0% monthly rates depending on timeline.",
  initialPrice: "Starting price for SAIT token. Set to $150 based on SAT backing parity. This establishes the initial price floor from treasury reserves.",
  marketSentiment: "Multiplier representing overall market conditions (0.5 = bearish, 1.0 = neutral, 2.0 = bullish). Affects price projections by simulating investor confidence.",
  priceGrowth: "Monthly percentage increase in base price. 2% monthly equals ~27% annual growth. This models organic price appreciation from adoption.",
  treasuryReserves: "Total value of SAT (Safe Asset Token) held in treasury reserves. Used to fund buybacks and provide SAIT price floor support.",
  treasuryRunway: "Number of months the treasury can sustain operations and buybacks at current burn rate before reserves are depleted.",
  treasuryStartingCash: "Initial SAT reserves from institutional capital commitments. Used to fund operations and SAIT buybacks.",
  operationalSpend: "Quarterly operational expenses paid from treasury. Includes development, audits, operations, and team costs.",
  speculator: "Percentage of token holders who trade frequently (high sell rate). These holders contribute to short-term price volatility.",
  utilityBuyer: "Percentage of token holders who use tokens for governance/utility (medium sell rate). These holders balance value accrual with participation.",
  hodler: "Percentage of long-term holders with low sell rates. These holders provide price stability and reduce circulating supply pressure.",
  timeHorizon: "Duration of the simulation in months. Default is 60 months (5 years) to match strategic planning horizon.",
  priceChart: "Shows SAIT price over time with three key levels: Market Price (blue), Buyback Floor (red dashed), and Premium Target (purple dashed) from equilibrium model.",
  supplyChart: "Tracks circulating supply growth as vaults unlock over time. Affected by vesting schedules and buyback reductions.",
  satTreasuryChart: "Displays SAT reserve accumulation from SAIT sales (125k/mo), grant recoveries (10%), and LP fees (0.3%), minus buyback costs and operations.",
  monthlyHiring: "Placeholder for monthly hiring tooltip text.",
  vaultVesting: "Describes the vesting mechanism for this specific vault.",
  vaultUnlocked: "The amount of tokens from this vault that have vested and are available.",
  sentiment: "Multiplier representing overall market conditions (0.5 = bearish, 1.0 = neutral, 2.0 = bullish). Affects price projections by simulating investor confidence.",
  startingCash: "Initial SAT reserves from institutional capital commitments. Used to fund operations and SAIT buybacks.",
  totalBurned: "Total ABC tokens removed from circulation through various mechanisms like failed bounties or slashing.",
  // Formula tooltips
  priceFloorFormula: "Price Floor = SAT Reserves / (Circulating Supply × Velocity). This establishes the minimum SAIT price based on treasury backing divided by active supply turnover. Lower velocity (hodling) = higher floor.",
  premiumTargetFormula: "Premium Target = Price Floor × 2.0. When market price exceeds 2x the floor, it indicates strong confidence and healthy premium above backing.",
  marketCapFormula: "Market Cap = Price × Circulating Supply. Total value of all SAIT tokens in circulation, representing the protocol's market valuation.",
  treasuryRunwayFormula: "Runway = Reserves / Monthly Net Burn. Number of months treasury can sustain operations and buybacks. Infinity (∞) means reserves are growing, not depleting.",
  buybackScheduleFormula: "Buyback schedule increases over time: Months 1-6 at 0.3%, Months 7-18 at 1.5%, Months 19+ at 2.0%. Percentages are of circulating supply bought monthly.",
  // ABC-specific tooltips
  stakedCuration: "ABC tokens staked by researchers to curate and validate scientific papers. Stakers earn rewards for accurate curation and risk slashing for poor quality work.",
  stakedBounties: "ABC tokens staked by participants working on bounties and research challenges. Successful completion returns stake plus rewards; failure results in slashing.",
  avgAuthorityScore: "Average reputation score of participants in the ABC ecosystem. Ranges from 0-200, with 100 being baseline. Higher scores unlock greater rewards and governance weight.",
  abcSupplyAlloc: "ABC Supply Allocations (100M Fixed): Total ABC token distribution across Beacon Treasury (50%), Liquidity (20%), ASI Institute (15%), and other allocations. Fixed supply, no inflation.",
  abcUsageParams: "ABC Usage Parameters: Configure monthly paper submissions, active bounties, and staking levels. These drive ABC token demand and circulation through research activities."
};

const SAITCalculator: React.FC = () => {
  // Core token parameters


  // --- Common State ---
  const [activeTab, setActiveTab] = useState<'SAIT' | 'ABC'>('SAIT');
  const [timeHorizon, setTimeHorizon] = useState<number>(12); // 12 months default

  // --- SAIT State ---
  const [basePrice, setBasePrice] = useState<number>(150); // $150 SAT backing parity
  const [priceGrowthRate, setPriceGrowthRate] = useState<number>(0.02); // 2% m/m
  const [aiFundInitialUnlocked, setAiFundInitialUnlocked] = useState<number>(1_000_000); // 1M tokens initially unlocked
  const [activeKPIs, setActiveKPIs] = useState<KPIMilestone[]>([
    { ...STANDARD_KPIS[0], achievedMonth: 1 } // Beta Launch default
  ]);
  const [speculatorRatio, setSpeculatorRatio] = useState<number>(0.15); // 15% speculators
  const [utilityBuyerRatio, setUtilityBuyerRatio] = useState<number>(0.51); // 51% utility buyers
  const [hodlerRatio, setHodlerRatio] = useState<number>(0.34); // 34% hodlers
  const [speculatorSellRate, setSpeculatorSellRate] = useState<number>(0.3);
  const [utilityBuyerSellRate, setUtilityBuyerSellRate] = useState<number>(0.1);
  const [hodlerSellRate, setHodlerSellRate] = useState<number>(0.05);
  const [marketSentimentSAIT, setMarketSentimentSAIT] = useState<number>(1.0); // Renamed to avoid conflict
  const [regulatoryRiskSAIT, setRegulatoryRiskSAIT] = useState<number>(1.0); // Renamed to avoid conflict
  const [competitionFactorSAIT, setCompetitionFactorSAIT] = useState<number>(1.0); // Renamed to avoid conflict
  const [velocity, setVelocity] = useState<number>(0.10); // 10% monthly velocity (normal market)
  const [buybackRateMultiplier, setBuybackRateMultiplier] = useState<number>(1.0); // 1.0 = base rates (0.3%, 1.5%, 2%)
  const [treasuryStartingCash, setTreasuryStartingCash] = useState<number>(4_000_000); // $4M
  const [operationalSpend, setOperationalSpend] = useState<number>(250_000); // $250k per quarter

  // --- ABC State ---
  const [abcBasePrice, setAbcBasePrice] = useState<number>(0.10);
  const [abcMonthlyPapers, setAbcMonthlyPapers] = useState<number>(150);
  const [abcBountiesMonthly, setAbcBountiesMonthly] = useState<number>(20);

  // SAIT Calculation
  const calculateScenario = useMemo<ScenarioData[]>(
    () => {
      const months: ScenarioData[] = [];
      let currentPrice = basePrice;
      let previousPrice = basePrice; // Track previous month's price for estimates
      // Calculate adjusted TGE total using custom AI Fund unlocked amount
      const adjustedTgeTotal = aiFundInitialUnlocked + TGE_TREASURY + TGE_TEAM + TGE_PARTNERS;
      let circulatingSupply = adjustedTgeTotal;
      let escrowRemaining = TOTAL_SUPPLY - adjustedTgeTotal;
      let totalBoughtBack = 0; // Track cumulative buybacks (no burns in this version)

      // Initial Holdings Dist
      let speculatorHoldings = circulatingSupply * speculatorRatio;
      let utilityBuyerHoldings = circulatingSupply * utilityBuyerRatio;
      let hodlerHoldings = circulatingSupply * hodlerRatio;

      // Treasury Initial State
      let satReserves = treasuryStartingCash; // Use user-configurable starting cash instead of constant
      let treasurySaitHoldings = TREASURY_TOTAL_ALLOCATION; // 30M - Treasury holds all allocation including TGE portion for gradual sales
      // Treasury allocation is 30M total. 6M unlocked at TGE (20%) is controlled by treasury for strategic sales.
      // Treasury sells 5% of 30M annually (1.5M/year = 125k/month) from total holdings.

      for (let month = 1; month <= timeHorizon; month++) {
        // 1. Calculate Vested Amounts (Portion of LOCKED that is now open)
        const aiFundVested = calculateVestedAmount(
          { vault: 'AIFund', type: 'milestone' },
          month,
          activeKPIs,
          circulatingSupply
        );
        const treasuryVested = calculateVestedAmount(
          { vault: 'Treasury', type: 'hybrid' },
          month,
          activeKPIs,
          circulatingSupply
        );
        const teamVested = calculateVestedAmount(
          { vault: 'Team', type: 'linear' },
          month,
          [],
          circulatingSupply
        );
        const partnersVested = calculateVestedAmount(
          { vault: 'Partners', type: 'linear' },
          month,
          [],
          circulatingSupply
        );

        const totalVestedFromLocked = aiFundVested + treasuryVested + teamVested + partnersVested;
        const totalUnlockedSupply = adjustedTgeTotal + totalVestedFromLocked;

        // Monthly Unlock (Delta from last month)
        const prevVested = month === 1 ? 0 :
          (months[month - 2].aiFundVested + months[month - 2].treasuryVested + months[month - 2].teamVested + months[month - 2].partnersVested);
        const monthlyNewTokens = totalVestedFromLocked - prevVested;

        // 2. Buyback (Burn Replacement)
        // Base rates: 0.3% (mo 1-6), 1.5% (mo 7-18), 2.0% (mo 19+)
        // Scaled by buybackRateMultiplier
        let baseBuybackRate = 0.003;
        if (month > 6 && month <= 18) baseBuybackRate = 0.015;
        if (month > 18) baseBuybackRate = 0.020;

        const buybackRate = baseBuybackRate * buybackRateMultiplier;
        const tokensToBuyTarget = (circulatingSupply + monthlyNewTokens) * buybackRate;

        // Buyback Price (use previousPrice to avoid circular dependency)
        const buybackPrice = previousPrice;
        const desiredBuybackCost = tokensToBuyTarget * buybackPrice;

        // Buyback Affordability Check - Only buy what treasury can afford
        const monthlyOpex = operationalSpend / 3;

        // Calculate available funds after operational expenses
        // Use previousPrice for sales estimates to avoid circular dependency
        const estimatedSaitSales = 125_000 * previousPrice;
        const estimatedGrantRecoveries = 200_000 * Math.min(1, month / 12);
        const estimatedLpFees = 50_000 * Math.max(1, month / 6);
        const estimatedInflows = estimatedSaitSales + estimatedGrantRecoveries + estimatedLpFees;
        const availableForBuyback = Math.max(0, satReserves + estimatedInflows - monthlyOpex);

        // Cap buyback to affordable amount
        const affordableBuybackCost = Math.min(desiredBuybackCost, availableForBuyback * 0.8); // Use 80% buffer for safety
        const actualTokensToBuy = affordableBuybackCost / buybackPrice;
        const buybackCost = affordableBuybackCost;

        // Track cumulative buybacks
        totalBoughtBack += actualTokensToBuy;

        // 3. Treasury Update
        // Use previousPrice for SAIT sales to avoid circular dependency with price floor
        const treasuryState = calculateMonthlyTreasuryFlow({
          month,
          saitPrice: previousPrice,
          buybackCost,
          operationalSpend: monthlyOpex,
          prevReserves: satReserves,
          prevSaitHoldings: treasurySaitHoldings
        });

        satReserves = treasuryState.satReserves;
        treasurySaitHoldings = treasuryState.saitHoldings;

        // 4. Update Supplies
        // NO BURNS in this version - buybacks cost money but don't reduce circulating supply
        circulatingSupply = totalUnlockedSupply;
        escrowRemaining = (TOTAL_SUPPLY - TGE_TOTAL) - totalVestedFromLocked;

        // 5. Price Dynamics - Equilibrium Model
        // SAIT Price Floor depends on treasury backing AND circulating supply velocity
        // Formula: SAIT Price Floor = (Treasury SAT reserves in USD) / (Circulating SAIT × Velocity)
        // Note: satReserves is already in USD, no need to multiply by $150

        // Effective Floor (normal market conditions with current velocity)
        const effectiveFloor = satReserves / (circulatingSupply * velocity || 1);

        // Stress Floor (crisis scenario - 50% monthly velocity)
        const stressFloor = satReserves / (circulatingSupply * 0.50 || 1);

        // Use Effective Floor as the enforceable price floor
        const priceFloor = effectiveFloor;

        // Apply Price Change
        const sells = speculatorHoldings * speculatorSellRate +
          utilityBuyerHoldings * utilityBuyerSellRate +
          hodlerHoldings * hodlerSellRate;

        // Update Holdings
        speculatorHoldings = speculatorHoldings - (speculatorHoldings * speculatorSellRate) + (monthlyNewTokens * speculatorRatio);
        utilityBuyerHoldings = utilityBuyerHoldings - (utilityBuyerHoldings * utilityBuyerSellRate) + (monthlyNewTokens * utilityBuyerRatio);
        hodlerHoldings = hodlerHoldings - (hodlerHoldings * hodlerSellRate) + (monthlyNewTokens * hodlerRatio);

        const supplyPressure = (monthlyNewTokens + sells) / circulatingSupply;
        const demandPressure = 0; // No burns in this version
        const netPressure = supplyPressure - demandPressure;

        // Monthly compounding: each month price grows by (1 + rate)
        // Month 1: no growth yet (base price), Month 2: base * (1 + rate), etc.
        const priceGrowth = month === 1 ? 1 : Math.pow(1 + priceGrowthRate, month - 1);
        const adjustment = 1 - netPressure * 0.5;

        let projectedPrice = basePrice * priceGrowth * adjustment * marketSentimentSAIT * regulatoryRiskSAIT * competitionFactorSAIT;

        // Enforce Floor
        projectedPrice = Math.max(projectedPrice, priceFloor);
        currentPrice = projectedPrice;

        // Premium Target Calculation - Equilibrium Model
        // Healthy indicator: Market Price > 2× Effective Floor = Strong confidence
        // Premium target represents the "healthy premium" price level
        const premiumTarget = effectiveFloor * 2.0;

        const marketCap = circulatingSupply * currentPrice;
        const burnRate = 0; // No burns in this version
        const totalMonthlyInflows = treasuryState.monthlyInflows.saitSales + treasuryState.monthlyInflows.grantRecoveries + treasuryState.monthlyInflows.lpFees;
        const netBurn = monthlyOpex + buybackCost - totalMonthlyInflows;
        const runway = satReserves > 0 && netBurn > 0
          ? Math.floor(satReserves / netBurn)
          : Infinity;

        months.push({
          month,
          price: currentPrice,
          circulatingSupply: Math.round(circulatingSupply),
          escrowRemaining: Math.round(escrowRemaining),
          totalBurned: Math.round(totalBoughtBack), // Track total buybacks (no burns)
          marketCap,
          monthlyUnlocks: Math.round(monthlyNewTokens),
          monthlyBurns: Math.round(actualTokensToBuy), // Monthly buybacks (not burns)
          burnRate,
          speculatorHoldings: Math.round(speculatorHoldings),
          utilityBuyerHoldings: Math.round(utilityBuyerHoldings),
          hodlerHoldings: Math.round(hodlerHoldings),
          sellPressure: sells,
          complianceChecks: 0,
          treasuryBalance: satReserves,
          treasuryInflow: treasuryState.monthlyInflows.saitSales + treasuryState.monthlyInflows.grantRecoveries + treasuryState.monthlyInflows.lpFees,
          treasuryRunway: runway,
          operationalSpend: monthlyOpex,
          overhangRatio: 0,
          aiFundVested,
          treasuryVested,
          teamVested,
          partnersVested,
          saitHoldings: treasurySaitHoldings,
          satReserves,
          priceFloor: priceFloor,
          premiumTarget
        });

        // Update previousPrice for next month
        previousPrice = currentPrice;
      }
      return months;
    },
    [
      basePrice,
      priceGrowthRate,
      aiFundInitialUnlocked,
      activeKPIs,
      timeHorizon,
      speculatorRatio,
      utilityBuyerRatio,
      hodlerRatio,
      speculatorSellRate,
      utilityBuyerSellRate,
      hodlerSellRate,
      marketSentimentSAIT,
      regulatoryRiskSAIT,
      competitionFactorSAIT,
      velocity,
      buybackRateMultiplier,
      treasuryStartingCash,
      operationalSpend,
    ]
  );

  // ABC Calculation
  const calculateABC = useMemo<ABCScenarioData[]>(() => {
    const months: ABCScenarioData[] = [];
    // Static TGE Unlocks (Public + Partners)
    const staticSupply = ABC_ALLOCATIONS.PUBLIC + ABC_ALLOCATIONS.PARTNERS;

    let totalBurned = 0;

    for (let month = 1; month <= timeHorizon; month++) {
      // Dynamic Unlocks
      const treasuryUnlocked = getTreasuryUnlock(month);
      const instituteUnlocked = getInstituteUnlock(month);
      const liquidityUnlocked = getLiquidityUnlock(month);

      const totalSupplyPossible = staticSupply + treasuryUnlocked + instituteUnlocked + liquidityUnlocked;

      // Usage Drivers
      // 1. Curation Staking
      // Assume average lockup of 3 months for curation process/dispute window
      const activePapersWindow = 3;
      const activePapers = abcMonthlyPapers * Math.min(month, activePapersWindow); // Ramp up to window
      const curatingStakersPerPaper = 5;
      const stakePerCurator = 200; // 200 ABC
      const activePapersCurationStake = activePapers * curatingStakersPerPaper * stakePerCurator;

      // 2. Bounty Staking
      // Assume average lockup 1 month for bounty completion
      const stakePerBounty = 5000; // 5000 ABC
      const activeBountyStake = abcBountiesMonthly * stakePerBounty;

      // 3. Burns (Deflation)
      // Burn Rate from failed bounties or slashing
      const failureRate = 0.15; // 15% failure/slash
      const monthlyBurn = (abcBountiesMonthly * stakePerBounty * failureRate) + (abcMonthlyPapers * ABC_PAPER_SUBMISSION_FEE * failureRate);
      totalBurned += monthlyBurn;

      // Circulating Supply (Liquid) = Total Unlocked - Burns
      // (Staked tokens are technically circulating but locked in contracts, reducing sell pressure)
      // For price, we care about "Free Float".
      const stakedMatches = activePapersCurationStake + activeBountyStake;
      const circulating = Math.max(0, totalSupplyPossible - totalBurned);
      // const freeFloat = Math.max(0, circulating - stakedMatches);

      // Price Dynamics
      // Base growth + Scarcity Premium
      // Scarcity = Staked / Circulating. Higher staked % -> Higher Price.
      const scarcityRatio = circulating > 0 ? stakedMatches / circulating : 0;
      const scarcityPremium = 1 + (scarcityRatio * 2.5); // Multiplier: High impact of staking

      // Adoption/Speculation Curve (simulated)
      const timeFactor = Math.pow(1 + 0.02, month); // 2% monthly base growth

      const price = abcBasePrice * timeFactor * scarcityPremium;
      const marketCap = circulating * price;

      months.push({
        month,
        circulatingSupply: Math.round(circulating),
        treasuryEmitted: Math.round(treasuryUnlocked),
        stakedCuration: Math.round(activePapersCurationStake),
        stakedBounties: Math.round(activeBountyStake),
        burnedTokens: Math.round(totalBurned),
        price,
        marketCap,
        curationCount: abcMonthlyPapers * month,
        activeBounties: abcBountiesMonthly,
        authorityScoreAvg: 100 + (month * 5)
      });
    }
    return months;
  }, [abcBasePrice, abcMonthlyPapers, abcBountiesMonthly, timeHorizon]);

  // Formatting helpers
  const formatCurrency = (v: number) => {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(2)}K`;
    return `$${v.toFixed(2)}`;
  };

  const formatTokens = (v: number) => {
    if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(2)}K`;
    return v.toFixed(2);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  };

  // Select Data based on Tab
  const final = activeTab === 'SAIT'
    ? (calculateScenario.length > 0 ? calculateScenario[calculateScenario.length - 1] : undefined) as ScenarioData
    : (calculateABC.length > 0 ? calculateABC[calculateABC.length - 1] : undefined) as ABCScenarioData;

  const dataToRender = activeTab === 'SAIT' ? calculateScenario : calculateABC;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            ASI Scenario Calculator
          </h1>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('SAIT')}
              className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'SAIT' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'} `}
            >
              SAIT (Sovereign)
            </button>
            <button
              onClick={() => setActiveTab('ABC')}
              className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'ABC' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'} `}
            >
              ABC (Commons)
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {activeTab === 'SAIT' ?
            "Projecting SAIT tokenomics: Buybacks, Treasury Saturation, and Price Floors." :
            "Projecting ABC tokenomics: Commons Treasury Emissions, Curation Staking, and Reputation."}
        </p>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(final?.price || 0)}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              Final Price
              <InfoTooltip text={TOOLTIP_TEXTS.finalPrice} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(final?.marketCap || 0)}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              Market Cap
              <InfoTooltip text={TOOLTIP_TEXTS.marketCap} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatTokens(activeTab === 'SAIT' ? ((final as ScenarioData)?.totalBurned || 0) : ((final as ABCScenarioData)?.burnedTokens || 0))}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              {activeTab === 'SAIT' ? 'Total Bought Back' : 'Total Burned'}
              <InfoTooltip text={activeTab === 'SAIT' ? TOOLTIP_TEXTS.totalBoughtBack : TOOLTIP_TEXTS.totalBurned} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatTokens(final?.circulatingSupply || 0)}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              Circulating Supply
              <InfoTooltip text={TOOLTIP_TEXTS.circulatingSupply} />
            </div>
          </div>
        </div>

        {activeTab === 'ABC' && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="text-center">
              <div className="text-xl font-bold text-green-700">
                {formatTokens((final as ABCScenarioData)?.stakedCuration || 0)}
              </div>
              <div className="text-xs text-green-600">Staked (Curation)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-700">
                {formatTokens((final as ABCScenarioData)?.stakedBounties || 0)}
              </div>
              <div className="text-xs text-green-600">Staked (Bounties)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-700">
                {((final as ABCScenarioData)?.authorityScoreAvg || 0).toFixed(0)}
              </div>
              <div className="text-xs text-green-600">Avg Authority Score</div>
            </div>
          </div>
        )}

        {/* Overhang Warning */}
        {activeTab === 'SAIT' && calculateScenario.some(m => (m.overhangRatio || 0) > 0.4) && (
          <div className="text-red-600 text-sm mb-4">
            ⚠️ High overhang risk:{' '}
            {(Math.max(...calculateScenario.map(m => m.overhangRatio || 0)) * 100).toFixed(0)}%
            in next 2 quarters
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Allocations & Vaults */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {activeTab === 'SAIT' ? 'SAIT Vault Allocations (100M Fixed)' : 'ABC Supply Allocations (100M Fixed)'}
          </h3>

          {activeTab === 'SAIT' ? (
            <div className="space-y-3">
              <div className="p-2 border rounded bg-indigo-50">
                <div className="text-xs font-bold text-gray-500">AI Fund (50%)</div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg">{formatTokens(50_000_000)}</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-flex items-center">
                    KPI Vesting
                    <InfoTooltip text={TOOLTIP_TEXTS.vaultVesting} />
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600 flex items-center">
                    <label className="flex items-center gap-1">
                      Initial Unlocked:
                      <InfoTooltip text={TOOLTIP_TEXTS.vaultUnlocked} />
                    </label>
                  </div>
                  <input
                    type="number"
                    step="100000"
                    value={aiFundInitialUnlocked}
                    onChange={e => setAiFundInitialUnlocked(parseInt(e.target.value) || 0)}
                    className="w-full p-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="text-xs text-gray-500">
                    Current Total: {formatTokens((final as ScenarioData)?.aiFundVested || 0)}
                  </div>
                </div>
              </div>

              {/* Buyback Rate Multiplier */}
              <div className="mt-4 p-3 border rounded bg-yellow-50">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Buyback Rate Multiplier
                  <InfoTooltip text="Scales monthly buyback rates. Base: 0.3% (months 1-6), 1.5% (months 7-18), 2.0% (months 19+). Multiplier of 1.0 = base rates, 2.0 = double, 0.5 = half." />
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={buybackRateMultiplier}
                  onChange={e => setBuybackRateMultiplier(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  {buybackRateMultiplier.toFixed(1)}x (Current: {(0.003 * buybackRateMultiplier * 100).toFixed(2)}% → {(0.015 * buybackRateMultiplier * 100).toFixed(2)}% → {(0.020 * buybackRateMultiplier * 100).toFixed(2)}%)
                </div>
              </div>

              {/* Other SAIT Vaults Simplified for this response, the previous tool put them there. */}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2 border rounded bg-purple-50">
                <div className="text-xs font-bold text-gray-500">Commons Treasury (50%)</div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg">{formatTokens(ABC_ALLOCATIONS.TREASURY)}</span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">5yr Emission</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">Emitted: {formatTokens((final as ABCScenarioData)?.treasuryEmitted || 0)}</div>
              </div>
              <div className="p-2 border rounded bg-blue-50">
                <div className="text-xs font-bold text-gray-500">Liquidity (20%)</div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg">{formatTokens(ABC_ALLOCATIONS.LIQUIDITY)}</span>
                </div>
              </div>
              <div className="p-2 border rounded bg-orange-50">
                <div className="text-xs font-bold text-gray-500">ASI Institute (15%)</div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg">{formatTokens(ABC_ALLOCATIONS.INSTITUTE)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market / Scenario Parameters */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            {activeTab === 'SAIT' ? 'Market Parameters' : 'ABC Usage Parameters'}
          </h3>
          <div className="space-y-4">
            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                {activeTab === 'SAIT' ? 'Initial SAIT Price ($)' : 'Initial ABC Price ($)'}
                <InfoTooltip text={TOOLTIP_TEXTS.initialPrice} />
              </label>
              <input
                type="number"
                step="0.01"
                value={activeTab === 'SAIT' ? basePrice : abcBasePrice}
                onChange={e => activeTab === 'SAIT' ? setBasePrice(parseFloat(e.target.value) || 0) : setAbcBasePrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {activeTab === 'SAIT' && (
              <>
                {/* Price Growth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Monthly Price Growth Rate
                    <InfoTooltip text={TOOLTIP_TEXTS.priceGrowth} />
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={priceGrowthRate}
                    onChange={e => setPriceGrowthRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {(priceGrowthRate * 100).toFixed(2)}%
                  </span>
                </div>

                {/* Sentiment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Market Sentiment
                    <InfoTooltip text={TOOLTIP_TEXTS.sentiment} />
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={marketSentimentSAIT}
                    onChange={e => setMarketSentimentSAIT(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {marketSentimentSAIT.toFixed(2)}x
                  </span>
                </div>

                {/* Velocity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Market Velocity
                    <InfoTooltip text="Monthly turnover rate of circulating supply. Bull: 1-5%, Normal: 5-15%, Bear: 15-30%, Crisis: 30-50%. Affects price floor calculation." />
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.50"
                    step="0.01"
                    value={velocity}
                    onChange={e => setVelocity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {(velocity * 100).toFixed(0)}% monthly
                  </span>
                </div>
              </>
            )}

            {activeTab === 'ABC' && (
              <>
                {/* Monthly Papers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Research Papers
                  </label>
                  <input
                    type="number"
                    value={abcMonthlyPapers}
                    onChange={e => setAbcMonthlyPapers(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Monthly Bounties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Bounties
                  </label>
                  <input
                    type="number"
                    value={abcBountiesMonthly}
                    onChange={e => setAbcBountiesMonthly(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>



        {/* Treasury Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Treasury Management
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Starting Treasury Cash ($)
                <InfoTooltip text={TOOLTIP_TEXTS.startingCash} />
              </label>
              <input
                type="number"
                step="100000"
                value={treasuryStartingCash}
                onChange={e =>
                  setTreasuryStartingCash(parseInt(e.target.value) || 0)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Operational Spend ($ per quarter)
                <InfoTooltip text={TOOLTIP_TEXTS.operationalSpend} />
              </label>
              <input
                type="number"
                step="50000"
                value={operationalSpend}
                onChange={e =>
                  setOperationalSpend(parseInt(e.target.value) || 0)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>



            {/* Treasury Health Check */}
            <div className="p-3 rounded-md" style={{ backgroundColor: '#B5C7EB' }}>
              <h4 className="text-sm font-semibold mb-2 text-black">
                Treasury Status (SAT)
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 block mb-1">Reserves:</span>
                  <div className="text-sm text-black">{formatCurrency((final as ScenarioData)?.satReserves || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Runway:</span>
                  <div className="text-sm text-black">
                    {(final as ScenarioData)?.treasuryRunway === Infinity ? '∞' : `${(final as ScenarioData)?.treasuryRunway || 0}m`}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t" style={{ borderColor: '#8FA3D0' }}>
                  <span className="text-gray-500 block mb-1">Price Floor:</span>
                  <div className="text-blue-600">{formatCurrency((final as ScenarioData)?.priceFloor || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Behavior & Scenario Presets */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">
            Buyer Behavior & Scenarios
          </h3>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Time Horizon (months)
                <InfoTooltip text={TOOLTIP_TEXTS.timeHorizon} />
              </label>
              <input
                type="number"
                min="12"
                max="60"
                value={timeHorizon}
                onChange={e => setTimeHorizon(parseInt(e.target.value) || 12)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Speculator Ratio
                <InfoTooltip text={TOOLTIP_TEXTS.speculator} />
              </label>
              <input
                type="range"
                min="0.1"
                max="0.7"
                step="0.05"
                value={speculatorRatio}
                onChange={e => {
                  const newRatio = parseFloat(e.target.value);
                  const remaining = 1 - newRatio;
                  setSpeculatorRatio(newRatio);
                  setUtilityBuyerRatio(remaining * 0.6);
                  setHodlerRatio(remaining * 0.4);
                }}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {(speculatorRatio * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Utility Buyer Ratio
                <InfoTooltip text={TOOLTIP_TEXTS.utilityBuyer} />
              </label>
              <input
                type="range"
                min="0.1"
                max="0.7"
                step="0.05"
                value={utilityBuyerRatio}
                onChange={e => setUtilityBuyerRatio(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {(utilityBuyerRatio * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Hodler Ratio
                <InfoTooltip text={TOOLTIP_TEXTS.hodler} />
              </label>
              <input
                type="range"
                min="0.1"
                max="0.7"
                step="0.05"
                value={hodlerRatio}
                onChange={e => setHodlerRatio(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {(hodlerRatio * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Formula Reference Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center">
            Key Formulas
            <InfoTooltip text="Major calculations used in the SAIT and SAT treasury model. Click for detailed explanations." />
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-bold text-gray-700">Price Floor</div>
              <div className="font-mono text-gray-600">Floor = SAT Reserves / (Circ. Supply × Velocity)</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="font-bold text-gray-700">Premium Target</div>
              <div className="font-mono text-gray-600">Target = Price Floor × 2.0</div>
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <div className="font-bold text-gray-700">Market Cap</div>
              <div className="font-mono text-gray-600">Market Cap = Price × Circ. Supply</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <div className="font-bold text-gray-700">Treasury Runway</div>
              <div className="font-mono text-gray-600">Runway = Reserves / Monthly Net Burn</div>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <div className="font-bold text-gray-700">Buyback Schedule</div>
              <div className="font-mono text-gray-600">Mo 1-6: 0.3% | Mo 7-18: 1.5% | Mo 19+: 2.0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price Over Time */}
          <div className="h-72">
            <div className="text-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700 inline-flex items-center">
                Price Over Time
                <InfoTooltip text={TOOLTIP_TEXTS.priceChart} />
              </h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataToRender}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['auto', 'auto']} tickFormatter={formatYAxis} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3182ce"
                  name="Market Price"
                  strokeWidth={2}
                  dot={false}
                />
                {activeTab === 'SAIT' && (
                  <>
                    <Line
                      type="step"
                      dataKey="priceFloor"
                      stroke="#e53e3e"
                      name="Buyback Floor"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="premiumTarget"
                      stroke="#805ad5"
                      name="Premium"
                      strokeDasharray="3 3"
                      opacity={0.5}
                      dot={false}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Circulating Supply Over Time */}
          <div className="h-72">
            <div className="text-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700 inline-flex items-center">
                Circulating Supply
                <InfoTooltip text={TOOLTIP_TEXTS.supplyChart} />
              </h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataToRender}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="circulatingSupply"
                  stroke="#38a169"
                  fill="#68d391"
                  name="Circulating Supply"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SAT Treasury Chart - SAIT Mode Only */}
      {activeTab === 'SAIT' && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700 inline-flex items-center justify-center">
              SAT Treasury Reserves
              <InfoTooltip text={TOOLTIP_TEXTS.satTreasuryChart} />
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculateScenario}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  label={{ value: 'USD Value', angle: -90, position: 'insideLeft', offset: 3 }}
                />
                <RechartsTooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="satReserves"
                  stroke="#657797"
                  fill="#B5C7EB"
                  name="SAT Reserves ($)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-gray-500">Starting Reserves</div>
              <div className="font-bold text-lg">{formatCurrency(treasuryStartingCash)}</div>
            </div>
            <div>
              <div className="text-gray-500">Current Reserves</div>
              <div className="font-bold text-lg text-black">{formatCurrency((final as ScenarioData)?.satReserves || 0)}</div>
            </div>
            <div>
              <div className="text-gray-500">Growth</div>
              <div className="font-bold text-lg text-green-600">
                {(((((final as ScenarioData)?.satReserves || treasuryStartingCash) - treasuryStartingCash) / treasuryStartingCash) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SAITCalculator;

