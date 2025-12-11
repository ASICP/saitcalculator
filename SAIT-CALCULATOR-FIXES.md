# SAIT Calculator Fixes - Implementation Plan

## Issues Identified & Solutions

### 1. Initial Price Issue (Task A.5)
**Problem:** `basePrice` set to $0.10, should be $150
**Location:** Line 97
**Fix:** Change `useState<number>(0.10)` to `useState<number>(150)`

### 2. "Total Burned" Label (Task A.4)
**Problem:** SAIT uses buybacks not burns
**Location:** Line 471
**Fix:** Change "Total Burned" to "Total Bought Back" for SAIT mode

### 3. Missing Tooltip Icons (Tasks A.1-3, A.6-7, A.10)
**Solution:** Create a reusable Tooltip component

### 4. Treasury Status Layout (Task A.8)
**Problem:** Reserves and Runway numbers overlap
**Location:** Lines 695-709
**Fix:** Improve grid layout and spacing

### 5. Chart Y-Axis Formatting (Task A.9)
**Problem:** Shows "000000" instead of formatted numbers
**Fix:** Add custom tick formatter to Recharts

### 6. SAT Treasury Chart (Task A.11)
**Solution:** Add new chart component tracking SAT reserves over time

## Implementation Steps

### Step 1: Create Tooltip Component
```typescript
const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button
        onClick={() => setShow(!show)}
        className="text-blue-500 hover:text-blue-700 cursor-pointer text-xs"
      >
        ⓘ
      </button>
      {show && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShow(false)}
          />
          <div className="absolute z-50 w-64 p-3 bg-white border-2 border-blue-500 rounded-lg shadow-xl left-0 top-6">
            <div className="text-sm text-gray-700">{text}</div>
            <button
              onClick={() => setShow(false)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};
```

### Step 2: Define Tooltip Texts

```typescript
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
  speculator: "Percentage of token holders who trade frequently (high sell rate). These holders contribute to short-term price volatility.",
  utilityBuyer: "Percentage of token holders who use tokens for governance/utility (medium sell rate). These holders balance value accrual with participation.",
  hodler: "Percentage of long-term holders with low sell rates. These holders provide price stability and reduce circulating supply pressure.",
  timeHorizon: "Duration of the simulation in months. Default is 60 months (5 years) to match strategic planning horizon.",
  operationalSpend: "Quarterly operational expenses paid from treasury (converted to monthly for calculations). Includes development, audits, and operations.",
  priceChart: "Shows SAIT price over time with three key levels: Market Price (blue), Buyback Floor (red dashed), and Premium Target (purple dashed) from equilibrium model.",
  supplyChart: "Tracks circulating supply growth as vaults unlock over time. Affected by vesting schedules and buyback reductions.",
  satTreasuryChart: "Displays SAT reserve accumulation from SAIT sales (125k/mo), grant recoveries (10%), and LP fees (0.3%), minus buyback costs and operations."
};
```

### Step 3: Fix basePrice Default
Change line 97 from:
```typescript
const [basePrice, setBasePrice] = useState<number>(0.10);
```
To:
```typescript
const [basePrice, setBasePrice] = useState<number>(150);
```

### Step 4: Fix "Total Burned" Label
Lines 467-472, change to:
```typescript
<div className="text-center">
  <div className="text-2xl font-bold text-purple-600">
    {formatTokens(activeTab === 'SAIT' ? ((final as ScenarioData)?.totalBurned || 0) : ((final as ABCScenarioData)?.burnedTokens || 0))}
  </div>
  <div className="text-sm text-gray-600 flex items-center justify-center">
    {activeTab === 'SAIT' ? 'Total Bought Back' : 'Total Burned'}
    <Tooltip text={TOOLTIP_TEXTS.totalBoughtBack} />
  </div>
</div>
```

### Step 5: Add Tooltips to Key Metrics
Update all metric displays to include tooltip icons.

### Step 6: Fix Treasury Status Layout
Lines 690-710, improve spacing:
```typescript
<div className="bg-red-50 p-3 rounded-md">
  <h4 className="text-sm font-semibold text-red-800 mb-2">
    Treasury Status (SAT)
  </h4>
  <div className="grid grid-cols-2 gap-3 text-xs">
    <div>
      <span className="text-gray-500 block mb-1">Reserves:</span>
      <div className="font-bold text-lg">{formatCurrency(final?.satReserves || 0)}</div>
    </div>
    <div>
      <span className="text-gray-500 block mb-1">Runway:</span>
      <div className="font-bold text-lg">
        {final?.treasuryRunway === Infinity ? '∞' : `${final?.treasuryRunway || 0}m`}
      </div>
    </div>
    <div className="col-span-2 mt-2 pt-2 border-t border-red-200">
      <span className="text-gray-500 block mb-1">Price Floor:</span>
      <div className="font-bold text-blue-600">{formatCurrency(final?.priceFloor || 0)}</div>
    </div>
  </div>
</div>
```

### Step 7: Fix Chart Y-Axis Formatting
Add custom tick formatter:
```typescript
const formatYAxis = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toString();
};

// Apply to YAxis component
<YAxis tickFormatter={formatYAxis} />
```

### Step 8: Create SAT Treasury Chart
Add new chart after existing charts:
```typescript
{activeTab === 'SAIT' && (
  <div className="h-64 mt-4">
    <div className="text-center mb-2">
      <h3 className="text-lg font-semibold text-gray-700 inline-flex items-center">
        SAT Treasury Reserves
        <Tooltip text={TOOLTIP_TEXTS.satTreasuryChart} />
      </h3>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={calculateScenario}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
        <Area
          type="monotone"
          dataKey="satReserves"
          stroke="#ef4444"
          fill="#fecaca"
          name="SAT Reserves ($)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)}
```

## File Modifications Required

1. **saitcalculatorv24.tsx** - Main calculator component
   - Add Tooltip component (after imports)
   - Add TOOLTIP_TEXTS constant
   - Change basePrice default to 150
   - Update all metric labels with tooltips
   - Fix "Total Burned" to "Total Bought Back" for SAIT
   - Fix Treasury Status layout
   - Add formatYAxis function
   - Apply tickFormatter to all chart YAxis
   - Add SAT Treasury chart component

## Testing Checklist

- [ ] Tooltip icons appear next to all specified labels
- [ ] Clicking tooltip shows modal overlay with explanation
- [ ] Clicking outside closes tooltip
- [ ] Initial SAIT price defaults to $150
- [ ] Final price shows reasonable value (~$200-300 range)
- [ ] "Total Bought Back" label for SAIT, "Total Burned" for ABC
- [ ] Treasury Status numbers don't overlap
- [ ] Y-axis shows formatted numbers (1M, 5M, 10M not 1000000)
- [ ] SAT Treasury chart displays below other charts
- [ ] SAT Treasury chart shows reserve growth over time

## Implementation Priority

1. **HIGH:** Fix basePrice to $150 (blocks testing)
2. **HIGH:** Add Tooltip component
3. **HIGH:** Fix "Total Burned" label
4. **MEDIUM:** Add all tooltip texts
5. **MEDIUM:** Fix Treasury Status layout
6. **MEDIUM:** Fix chart Y-axis formatting
7. **LOW:** Add SAT Treasury chart (enhancement)
