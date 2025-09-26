```tsx
import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  monthlyBurns: number;
  burnRate: number;
  speculatorHoldings: number;
  utilityBuyerHoldings: number;
  hodlerHoldings: number;
  sellPressure: number;
  complianceChecks: number;
  treasuryBalance: number;
  treasuryInflow: number;
  treasuryRunway: number;
  operationalSpend: number;
  overhangRatio?: number;
}

interface Phase {
  name: string;
  startQuarter: number;
  totalPercent: number;
  durationQuarters: number;
  buckets: { research: number; ecosystem: number; team: number };
}

const SAITCalculator: React.FC = () => {
  // Core token parameters
  const defaultTotalSupply = 1_000_000_000;
  const [totalSupplies] = useState<number[]>([
    500_000_000,
    1_000_000_000,
    5_000_000_000,
    10_000_000_000
  ]);
  const [selectedSupply, setSelectedSupply] = useState<number>(defaultTotalSupply);
  const escrowReserveRatio = 0.7; // 70% in escrow

  // Market parameters
  const [basePrice, setBasePrice] = useState<number>(0.05);
  const [priceGrowthRate, setPriceGrowthRate] = useState<number>(0.15);
  const [fomoMultiplier, setFomoMultiplier] = useState<number>(1.05);
  const [marketSentiment, setMarketSentiment] = useState<number>(1.0);
  const [regulatoryRisk, setRegulatoryRisk] = useState<number>(0.95);
  const [competitionFactor, setCompetitionFactor] = useState<number>(1.0);

  // Unlock parameters
  const [baseUnlockRate, setBaseUnlockRate] = useState<number>(0.005);
  const [milestoneUnlockRate, setMilestoneUnlockRate] = useState<number>(0.01);
  const [milestonesPerMonth, setMilestonesPerMonth] = useState<number>(0.5);
  const phases: Phase[] = [
    { name: 'Pilot', startQuarter: 1, totalPercent: 0.05, durationQuarters: 2, buckets: { research: 0.4, ecosystem: 0.4, team: 0.2 } },
    { name: 'R&D Scaling', startQuarter: 2, totalPercent: 0.10, durationQuarters: 4, buckets: { research: 0.5, ecosystem: 0.3, team: 0.2 } },
    { name: 'Expansion', startQuarter: 6, totalPercent: 0.13, durationQuarters: 8, buckets: { research: 0.3, ecosystem: 0.5, team: 0.2 } },
  ];
  const [usePhaseUnlocks, setUsePhaseUnlocks] = useState<boolean>(true);

  // Burn parameters
  const [complianceGrowthRate, setComplianceGrowthRate] = useState<number>(0.2);
  const [baseTokensPerCheck, setBaseTokensPerCheck] = useState<number>(25);
  const [checksPerMonth, setChecksPerMonth] = useState<number>(2000);
  const [burnFloor, setBurnFloor] = useState<number>(2_000_000);
  const [burnFloorFinancing, setBurnFloorFinancing] = useState<string>('treasury');

  // Fee scaling
  const [simpleCheckRatio, setSimpleCheckRatio] = useState<number>(0.6);
  const [complexCheckRatio, setComplexCheckRatio] = useState<number>(0.3);
  const [enterpriseCheckRatio, setEnterpriseCheckRatio] = useState<number>(0.1);

  // Treasury
  const [treasuryStartingCash, setTreasuryStartingCash] = useState<number>(1_500_000);
  const [operationalSpend, setOperationalSpend] = useState<number>(600_000);
  const [treasuryShare, setTreasuryShare] = useState<number>(0.3);

  // Buyer behavior
  const [speculatorRatio, setSpeculatorRatio] = useState<number>(0.4);
  const [utilityBuyerRatio, setUtilityBuyerRatio] = useState<number>(0.35);
  const [hodlerRatio, setHodlerRatio] = useState<number>(0.25);
  const [speculatorSellRate, setSpeculatorSellRate] = useState<number>(0.1);
  const [utilityBuyerSellRate, setUtilityBuyerSellRate] = useState<number>(0.03);
  const [hodlerSellRate, setHodlerSellRate] = useState<number>(0.01);

  // Time horizon
  const [timeHorizon, setTimeHorizon] = useState<number>(36);

  // Scenario presets
  const scenarios = {
    baseMid: { basePrice: 0.05, priceGrowthRate: 0.15, baseUnlockRate: 0.005, milestoneUnlockRate: 0.01, checksPerMonth: 2000 },
    leanSupply: { basePrice: 0.05, priceGrowthRate: 0.10, baseUnlockRate: 0.003, milestoneUnlockRate: 0.008, checksPerMonth: 1500 },
    highAdoption: { basePrice: 0.06, priceGrowthRate: 0.20, baseUnlockRate: 0.006, milestoneUnlockRate: 0.012, checksPerMonth: 3000 },
    runwayGuard: { basePrice: 0.04, priceGrowthRate: 0.12, baseUnlockRate: 0.004, milestoneUnlockRate: 0.007, checksPerMonth: 1800 },
  };
  const [selectedScenario, setSelectedScenario] = useState<string>('baseMid');

  const calculateScenario = useMemo<{ totalSupply: number; data: ScenarioData[] }[]>(
    () => {
      return totalSupplies.map(totalSupply => {
        const escrowReserve = totalSupply * escrowReserveRatio;
        const months: ScenarioData[] = [];
        let currentPrice = basePrice;
        let circulatingSupply = totalSupply * 0.15;
        let escrowRemaining = escrowReserve;
        let totalBurned = 0;

        let speculatorHoldings = circulatingSupply * speculatorRatio;
        let utilityBuyerHoldings = circulatingSupply * utilityBuyerRatio;
        let hodlerHoldings = circulatingSupply * hodlerRatio;

        for (let month = 0; month < timeHorizon; month++) {
          // Unlocks
          let totalUnlock = 0;
          if (usePhaseUnlocks) {
            const currentQuarter = Math.floor(month / 3) + 1;
            const activePhases = phases.filter(
              p => currentQuarter >= p.startQuarter && currentQuarter < p.startQuarter + p.durationQuarters
            );
            totalUnlock = activePhases.reduce((sum, p) => {
              const monthlyPercent = p.totalPercent / (p.durationQuarters * 3);
              return sum + escrowRemaining * monthlyPercent;
            }, 0);
            totalUnlock = Math.min(totalUnlock, escrowRemaining);
          } else {
            const baseUnlock = escrowRemaining * baseUnlockRate;
            const milestoneUnlock = escrowRemaining * milestoneUnlockRate * milestonesPerMonth;
            totalUnlock = Math.min(baseUnlock + milestoneUnlock, escrowRemaining);
          }

          // Compliance checks & burn
          const monthlyChecks = checksPerMonth * Math.pow(1 + complianceGrowthRate, month);
          const simple = monthlyChecks * simpleCheckRatio;
          const complex = monthlyChecks * complexCheckRatio;
          const enterprise = monthlyChecks * enterpriseCheckRatio;
          const usageBasedBurn =
            simple * (baseTokensPerCheck * 0.5) +
            complex * baseTokensPerCheck +
            enterprise * (baseTokensPerCheck * 3);
          const effectiveBurn = Math.max(usageBasedBurn, burnFloor / 3);
          const treasuryBurnCost =
            burnFloorFinancing === 'treasury'
              ? Math.max(0, effectiveBurn - usageBasedBurn) * currentPrice
              : 0;

          // Treasury
          const monthlyRevenue = monthlyChecks * 0.25;
          const treasuryInflow = monthlyRevenue * treasuryShare - treasuryBurnCost;
          const monthlyOpex = operationalSpend / 3;
          const priorCashFlow = months.length
            ? months.reduce((sum, m) => sum + (m.treasuryInflow - m.operationalSpend), 0)
            : 0;
          const treasuryBalance =
            treasuryStartingCash + priorCashFlow + treasuryInflow - monthlyOpex;

          // Update supplies
          circulatingSupply += totalUnlock - effectiveBurn;
          escrowRemaining -= totalUnlock;
          totalBurned += effectiveBurn;

          // Selling pressure
          const sells =
            speculatorHoldings * speculatorSellRate +
            utilityBuyerHoldings * utilityBuyerSellRate +
            hodlerHoldings * hodlerSellRate;

          speculatorHoldings =
            speculatorHoldings -
            speculatorHoldings * speculatorSellRate +
            totalUnlock * speculatorRatio;
          utilityBuyerHoldings =
            utilityBuyerHoldings -
            utilityBuyerHoldings * utilityBuyerSellRate +
            totalUnlock * utilityBuyerRatio;
          hodlerHoldings =
            hodlerHoldings -
            hodlerHoldings * hodlerSellRate +
            totalUnlock * hodlerRatio;

          // Overhang calculation (next two quarters)
          let nextTwoQuartersUnlocks = 0;
          if (usePhaseUnlocks) {
            const nextQuarter = Math.floor(month / 3) + 1;
            const futurePhases = phases.filter(
              p => p.startQuarter >= nextQuarter && p.startQuarter <= nextQuarter + 2
            );
            nextTwoQuartersUnlocks = futurePhases.reduce((sum, p) => {
              const monthlyPercent = p.totalPercent / (p.durationQuarters * 3);
              return sum + escrowRemaining * monthlyPercent * 6;
            }, 0);
          } else {
            nextTwoQuartersUnlocks =
              (baseUnlockRate + milestoneUnlockRate * milestonesPerMonth) *
              escrowRemaining *
              6;
          }
          const overhangRatio = nextTwoQuartersUnlocks / circulatingSupply;

          // Price dynamics
          const supplyPressure = (totalUnlock + sells) / circulatingSupply;
          const demandPressure = effectiveBurn / circulatingSupply;
          const netPressure = supplyPressure - demandPressure;
          const priceGrowth = Math.pow(1 + priceGrowthRate, month);
          const milestoneBoost = Math.pow(fomoMultiplier, milestonesPerMonth * month);
          const adjustment = 1 - netPressure * 0.5;

          currentPrice =
            basePrice *
            priceGrowth *
            milestoneBoost *
            adjustment *
            marketSentiment *
            regulatoryRisk *
            competitionFactor;

          const marketCap = circulatingSupply * currentPrice;
          const burnRate = (effectiveBurn / circulatingSupply) * 100;
          const runway =
            treasuryBalance > 0 && monthlyOpex > treasuryInflow
              ? Math.floor(treasuryBalance / (monthlyOpex - treasuryInflow))
              : treasuryBalance > 0
              ? Infinity
              : 0;

          months.push({
            month: month + 1,
            price: currentPrice,
            circulatingSupply: Math.round(circulatingSupply),
            escrowRemaining: Math.round(escrowRemaining),
            totalBurned: Math.round(totalBurned),
            marketCap,
            monthlyUnlocks: Math.round(totalUnlock),
            monthlyBurns: Math.round(effectiveBurn),
            burnRate,
            speculatorHoldings: Math.round(speculatorHoldings),
            utilityBuyerHoldings: Math.round(utilityBuyerHoldings),
            hodlerHoldings: Math.round(hodlerHoldings),
            sellPressure: sells,
            complianceChecks: Math.round(monthlyChecks),
            treasuryBalance,
            treasuryInflow,
            treasuryRunway: runway,
            operationalSpend: monthlyOpex,
            overhangRatio
          });
        }

        return { totalSupply, data: months };
      });
    },
    [
      basePrice,
      priceGrowthRate,
      fomoMultiplier,
      baseUnlockRate,
      milestoneUnlockRate,
      milestonesPerMonth,
      complianceGrowthRate,
      baseTokensPerCheck,
      checksPerMonth,
      simpleCheckRatio,
      complexCheckRatio,
      enterpriseCheckRatio,
      speculatorRatio,
      utilityBuyerRatio,
      hodlerRatio,
      speculatorSellRate,
      utilityBuyerSellRate,
      hodlerSellRate,
      marketSentiment,
      regulatoryRisk,
      competitionFactor,
      treasuryStartingCash,
      operationalSpend,
      treasuryShare,
      timeHorizon,
      burnFloor,
      burnFloorFinancing,
      totalSupplies,
      usePhaseUnlocks
    ]
  );

  // Formatting helpers
  const formatCurrency = (v: number) =>
    v >= 1e9
      ? `$${(v / 1e9).toFixed(2)}B`
      : v >= 1e6
      ? `$${(v / 1e6).toFixed(2)}M`
      : v >= 1e3
      ? `$${(v / 1e3).toFixed(2)}K`
      : `$${v.toFixed(2)}`;

  const formatTokens = (v: number) =>
    v >= 1e6
      ? `${(v / 1e6).toFixed(0)}M`
      : v >= 1e3
      ? `${(v / 1e3).toFixed(0)}K`
      : v.toString();

  // Pick the data slice for the currently selected supply
  const selectedScenarioData =
    calculateScenario.find(s => s.totalSupply === selectedSupply)?.data || [];
  const final = selectedScenarioData[selectedScenarioData.length - 1] as ScenarioData;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          SAIT Token Scenario Calculator
        </h1>
        <p className="text-gray-600 mb-4">
          Comprehensive tokenomics modeling for Sovereign AI Token
        </p>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(final?.price || 0)}
            </div>
            <div className="text-sm text-gray-600">Final Price</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(final?.marketCap || 0)}
            </div>
            <div className="text-sm text-gray-600">Market Cap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatTokens(final?.totalBurned || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Burned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatTokens(final?.circulatingSupply || 0)}
            </div>
            <div className="text-sm text-gray-600">Circulating Supply</div>
          </div>
        </div>

        {/* Overhang Warning */}
        {selectedScenarioData.some(m => (m.overhangRatio || 0) > 0.4) && (
          <div className="text-red-600 text-sm mb-4">
            ⚠️ High overhang risk:{' '}
            {(Math.max(...selectedScenarioData.map(m => m.overhangRatio || 0)) * 100).toFixed(0)}%
            in next 2 quarters
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Token Supply Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">
            Token Supply
          </h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Supply
          </label>
          <select
            value={selectedSupply}
            onChange={e => setSelectedSupply(parseInt(e.target.value, 10))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {totalSupplies.map(s => (
              <option key={s} value={s}>
                {formatTokens(s)} SAIT
              </option>
            ))}
          </select>
        </div>

        {/* Market Parameters */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Market Parameters
          </h3>
          <div className="space-y-4">
            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={basePrice}
                onChange={e => setBasePrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Price Growth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Price Growth Rate
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
                {(priceGrowthRate * 100).toFixed(1)}%
              </span>
            </div>

            {/* FOMO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FOMO Multiplier per Milestone
              </label>
              <input
                type="range"
                min="1"
                max="1.2"
                step="0.01"
                value={fomoMultiplier}
                onChange={e => setFomoMultiplier(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {((fomoMultiplier - 1) * 100).toFixed(1)}%
              </span>
            </div>

            {/* Sentiment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Sentiment
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={marketSentiment}
                onChange={e => setMarketSentiment(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {marketSentiment.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>

        {/* Tokenomics Parameters */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            Tokenomics Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unlock System
              </label>
              <select
                value={usePhaseUnlocks ? 'phases' : 'monthly'}
                onChange={e => setUsePhaseUnlocks(e.target.value === 'phases')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="phases">Phase-Based Unlocks</option>
                <option value="monthly">Monthly Unlocks</option>
              </select>
            </div>

            {!usePhaseUnlocks && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Monthly Unlock Rate
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="0.02"
                    step="0.001"
                    value={baseUnlockRate}
                    onChange={e => setBaseUnlockRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {(baseUnlockRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Milestone Unlock Rate
                  </label>
                  <input
                    type="range"
                    min="0.005"
                    max="0.03"
                    step="0.005"
                    value={milestoneUnlockRate}
                    onChange={e => setMilestoneUnlockRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {(milestoneUnlockRate * 100).toFixed(1)}%
                  </span>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Compliance Checks/Month
              </label>
              <input
                type="number"
                value={checksPerMonth}
                onChange={e => setChecksPerMonth(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Type Distribution
              </label>
              <div className="text-xs text-gray-600">
                <div>Simple: {(simpleCheckRatio * 100).toFixed(0)}% (0.5x cost)</div>
                <div>Complex: {(complexCheckRatio * 100).toFixed(0)}% (1x cost)</div>
                <div>Enterprise: {(enterpriseCheckRatio * 100).toFixed(0)}% (3x cost)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Treasury Management
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Treasury Cash ($)
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operational Spend ($ per quarter)
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treasury Fee Share
              </label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={treasuryShare}
                onChange={e => setTreasuryShare(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {(treasuryShare * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burn Floor (SAIT per quarter)
              </label>
              <input
                type="number"
                step="100000"
                value={burnFloor}
                onChange={e => setBurnFloor(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Treasury Health Check */}
            <div className="bg-red-50 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-red-800 mb-2">
                Treasury Health Check
              </h4>
              {(() => {
                const minRunway = Math.min(
                  ...selectedScenarioData.map(m => m.treasuryRunway || Infinity)
                );
                const minBalance = Math.min(
                  ...selectedScenarioData.map(m => m.treasuryBalance || 0)
                );
                if (minBalance < 0) {
                  return (
                    <div className="text-red-600 text-sm">
                      ⚠️ Treasury goes negative!
                    </div>
                  );
                } else if (minRunway < 12) {
                  return (
                    <div className="text-yellow-600 text-sm">
                      ⚠️ Runway below 12 months
                    </div>
                  );
                } else {
                  return (
                    <div className="text-green-600 text-sm">
                      ✓ Treasury runway healthy
                    </div>
                  );
                }
              })()}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Preset
              </label>
              <select
                value={selectedScenario}
                onChange={e => {
                  const sc = scenarios[e.target.value];
                  setSelectedScenario(e.target.value);
                  setBasePrice(sc.basePrice);
                  setPriceGrowthRate(sc.priceGrowthRate);
                  setBaseUnlockRate(sc.baseUnlockRate);
                  setMilestoneUnlockRate(sc.milestoneUnlockRate);
                  setChecksPerMonth(sc.checksPerMonth);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="baseMid">Base Mid</option>
                <option value="leanSupply">Lean Supply</option>
                <option value="highAdoption">High Adoption</option>
                <option value="runwayGuard">Runway Guard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Horizon (months)
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speculator Ratio
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utility Buyer Ratio
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hodler Ratio
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
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price Over Time */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedScenarioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3182ce"
                  name="Price"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Circulating Supply Over Time */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedScenarioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
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
    </div>
  );
};

export default SAITCalculator;
```
