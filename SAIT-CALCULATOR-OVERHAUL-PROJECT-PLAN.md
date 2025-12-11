# SAIT Token Calculator Overhaul - Project Plan

**Version:** 1.0
**Date:** December 10, 2025
**Status:** Planning Phase
**Current Calculator:** https://sait-scenario-calculator.replit.app/

---

## Executive Summary

This project plan outlines the comprehensive overhaul of the SAIT Token Calculator to accurately reflect the production-ready tokenomics and governance system implemented across the SAIT ecosystem. The current calculator (`saitcalculatorv24.tsx`) uses outdated assumptions including variable token supplies and traditional burn mechanisms that no longer align with the implemented reality.

### Critical Changes Required

1. **Fixed Supply**: Replace variable supply options (500M-10B) with fixed 100M supply for both SAIT and ABC
2. **Buyback Mechanism**: Replace token burn logic with SAIT-for-SAT buyback swaps
3. **Treasury Integration**: Implement SAT (Safe Asset Token) treasury mechanics and reserve modeling
4. **Allocation Accuracy**: Implement 50/30/20 vault-based allocation (AI Fund/Treasury/Team+Partners)
5. **Vesting Schedules**: Model time-based and KPI-based unlock mechanisms across 4 vault types
6. **Governance Parameters**: Integrate voting thresholds, institutional multipliers, and quarterly transfer limits

### Success Criteria

- Calculator outputs match smart contract behavior in SAITv2 repo
- All projections align with equilibrium targets from ASIP-SAIT-SAT-EQ-v5.pdf
- User scenarios accurately model buyback-driven price dynamics
- Treasury reserve growth projections match 3-year targets ($4M → $979M)

---

## Current State Analysis

### Source Code Location
**File:** `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/ASI-Calc/saitcalculatorv24.tsx`
**Lines of Code:** 695
**Framework:** React 18 with TypeScript

### Critical Issues Identified

#### 1. Variable Total Supply (Lines 48-54)
```typescript
const [totalSupplies] = useState<number[]>([
  500_000_000,
  1_000_000_000,
  5_000_000_000,
  10_000_000_000
]);
```
**Issue:** Allows selection of 4 different supply amounts
**Required:** Fixed constant `const TOTAL_SUPPLY = 100_000_000;`

#### 2. Burn Mechanism (Lines 76-82, 146-156)
```typescript
const usageBasedBurn = simple * (baseTokensPerCheck * 0.5) +
  complex * baseTokensPerCheck +
  enterprise * (baseTokensPerCheck * 3);
const effectiveBurn = Math.max(usageBasedBurn, burnFloor / 3);
```
**Issue:** Models token destruction instead of buyback
**Required:** SAIT→SAT swap logic with 7-day TWAP pricing and treasury reserve tracking

#### 3. Allocation Percentages (Line 56)
```typescript
const escrowReserveRatio = 0.7; // 70% escrow
```
**Issue:** Incorrect allocation structure
**Required:**
- AI Fund Vault: 50% (50M SAIT)
- Treasury Vault: 30% (30M SAIT)
- Team Vault: 15% (15M SAIT)
- Partner Vault: 5% (5M SAIT)

#### 4. Missing SAT Integration
**Issue:** No modeling of SAT reserves, $150 peg, or 150% over-collateralization
**Required:** SAT reserve tracking, monthly sales (5% of 30M annually), buyback funding

#### 5. No Vesting Logic
**Issue:** Static allocation without time-based or milestone-based unlocks
**Required:**
- AI Fund: Milestone-triggered releases (3-tier KPI system)
- Treasury: Hybrid monthly drip + milestone unlocks
- Team: 4-year vest, 1-year cliff
- Partners: 2-year vest, 10% TGE

#### 6. Missing Governance Parameters
**Issue:** No voting threshold modeling or transfer limit enforcement
**Required:**
- 1% circulating supply threshold for grant votes
- Institutional 1.5x vote multiplier
- Quarterly transfer limits (25% Q1-Q3, 50% Q4)

---

## Target State Requirements

### Source of Truth Documentation

#### Smart Contract Implementation
**Repository:** `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/SAIT_v2`

Key contracts that calculator must emulate:
- `SAITToken.sol` (393 lines): Quarterly transfer limits, 100M fixed supply
- `GovernanceStaking.sol` (287 lines): Quadratic voting (power = sqrt(stake))
- `AIFundVault.sol` (483 lines): 50M SAIT with KPI-based releases
- `TreasuryVault.sol` (454 lines): 30M SAIT with hybrid vesting
- `TeamVault.sol`: 15M SAIT, 4-year vest, 1-year cliff
- `PartnerVault.sol`: 5M SAIT, 2-year vest, 10% TGE
- `SAITSATSwap.sol`: Buyback mechanism with TWAP oracle

#### Tokenomics Specifications
**Document:** `ASIP-Allocation-v5.pdf`

**Initial Distribution at TGE (10.92% unlock = 9.73M SAIT):**
| Vault | Allocation | TGE Unlock | Amount |
|-------|-----------|-----------|---------|
| AI Fund | 50M (50%) | 5% | 2.5M |
| Treasury | 30M (30%) | 20% | 6M |
| Team | 15M (15%) | 2% | 0.3M |
| Partners | 5M (5%) | 18.6% | 0.93M |
| **Total** | **100M** | **9.73%** | **9.73M** |

**Vesting Schedules:**
- **AI Fund**: 47.5M locked, released via KPI milestones (1%, 2%, or 3% caps per milestone)
- **Treasury**: 24M locked, 18-month drip (1.33M/month) + milestone bonuses
- **Team**: 14.7M locked, 48-month linear vest after 12-month cliff
- **Partners**: 4.07M locked, 24-month linear vest

#### Price & Buyback Economics
**Document:** `ASIP-SAIT-SAT-EQ-v5.pdf`

**Price Targets:**
- Launch: $150 (parity with SAT backing)
- Year 1: $165-$175 (10-17% appreciation)
- Year 2: $200 (33% governance premium)
- Year 3: $300 (2:1 premium = fair value)

**Buyback Schedule (% of circulating supply monthly):**
- Months 1-6: 0.3%
- Months 7-18: 1.5%
- Months 19+: 2.0%

**Treasury SAT Reserve Growth:**
- Year 1: $4M → $244M
- Year 2: $244M → $626M
- Year 3: $626M → $979M

**Funding Sources:**
1. SAIT sales: 5% of 30M annually (1.5M tokens/year)
2. Grant recoveries: 10% of funded grants
3. LP fees: 0.3% on SAIT/ETH pair
4. Institutional commitments: $50M launch capital

#### Governance Mechanics
**Document:** `ASIP-Governance-v04.pdf`

**Voting Requirements:**
- Minimum stake: 1% of circulating supply for grant selection votes
- Quadratic formula: Voting power = sqrt(staked SAIT amount)
- Institutional multiplier: 1.5x for verified entities
- Board authority: Full control except grant selection (token holder vote)

**KPI System:**
- 3 tiers: Tier 1 (1% unlock), Tier 2 (2% unlock), Tier 3 (3% unlock)
- Maximum 7 active KPIs at once
- Combined unlocks cannot exceed 21% of circulating supply
- Verification period: 30 days post-milestone

**Transfer Limits (quarterly):**
- Q1-Q3: 25% of vested balance
- Q4: 50% of vested balance
- Institutional exemptions available

---

## Gap Analysis

### Calculation Engine

| Component | Current State | Target State | Effort |
|-----------|--------------|-------------|---------|
| Total Supply | Variable (500M-10B) | Fixed 100M | Low |
| Token Distribution | 70/30 escrow/reserve | 50/30/15/5 vaults | Medium |
| Burn Mechanism | Usage-based destruction | SAIT→SAT buyback | High |
| Vesting | None | 4 vault types, hybrid | High |
| Price Model | Supply/demand only | Buyback-supported floor | Medium |
| Treasury | Not modeled | SAT reserves + sales | High |
| Governance | Not modeled | Voting thresholds + limits | Medium |

### User Interface

| Feature | Current State | Target State | Effort |
|---------|--------------|-------------|---------|
| Supply Selector | 4 options dropdown | Fixed display | Low |
| Burn Controls | Burn rate sliders | Buyback rate schedule | Medium |
| Allocation Display | Single escrow % | 4 vault breakdown | Medium |
| Vesting Timeline | None | Multi-vault Gantt chart | High |
| Price Projection | Linear/exponential | Floor + premium model | Medium |
| Treasury Dashboard | None | SAT reserves + metrics | High |
| Governance Simulator | None | Vote power calculator | Medium |

### Data Dependencies

**New Data Inputs Required:**
1. SAT price peg ($150 constant)
2. SAT reserve balance (starts $50M institutional capital)
3. Monthly treasury SAIT sales rate (5% annually = 125k tokens/month)
4. Buyback rate schedule (0.3% → 1.5% → 2.0%)
5. KPI milestone definitions and unlock tiers
6. Vesting cliff dates and linear periods
7. Quarterly transfer limit percentages
8. Institutional participant count and multiplier

---

## Technical Architecture

### Core Calculation Modules

#### 1. Token Supply Module
```typescript
// Constants
const TOTAL_SUPPLY = 100_000_000;
const AI_FUND_ALLOCATION = 50_000_000;
const TREASURY_ALLOCATION = 30_000_000;
const TEAM_ALLOCATION = 15_000_000;
const PARTNER_ALLOCATION = 5_000_000;

// TGE Unlocks
const TGE_AI_FUND = 2_500_000; // 5%
const TGE_TREASURY = 6_000_000; // 20%
const TGE_TEAM = 300_000; // 2%
const TGE_PARTNERS = 930_000; // 18.6%
const TGE_TOTAL = 9_730_000; // 9.73%

interface VaultState {
  total: number;
  unlocked: number;
  locked: number;
  vested: number;
  transferable: number; // After quarterly limits
}
```

#### 2. Vesting Calculation Module
```typescript
interface VestingSchedule {
  vault: 'AIFund' | 'Treasury' | 'Team' | 'Partners';
  type: 'milestone' | 'linear' | 'hybrid';
  cliff?: number; // months
  duration?: number; // months
  dripRate?: number; // tokens per month
}

function calculateVestedAmount(
  schedule: VestingSchedule,
  currentMonth: number,
  completedKPIs?: KPIMilestone[]
): number {
  // AI Fund: Milestone-based
  if (schedule.type === 'milestone') {
    return calculateKPIUnlocks(completedKPIs);
  }

  // Treasury: Hybrid (18-month drip + milestones)
  if (schedule.type === 'hybrid') {
    const dripAmount = Math.min(
      currentMonth * 1_333_333, // 1.33M/month
      24_000_000 // Max drip amount
    );
    const milestoneBonus = calculateKPIUnlocks(completedKPIs);
    return dripAmount + milestoneBonus;
  }

  // Team: Linear after cliff
  if (schedule.vault === 'Team') {
    if (currentMonth < 12) return 0; // 1-year cliff
    const vestingMonths = currentMonth - 12;
    return Math.min(
      vestingMonths * (14_700_000 / 48), // Linear over 48 months
      14_700_000
    );
  }

  // Partners: Linear
  if (schedule.vault === 'Partners') {
    return Math.min(
      currentMonth * (4_070_000 / 24), // Linear over 24 months
      4_070_000
    );
  }
}
```

#### 3. Buyback Mechanism Module
```typescript
interface BuybackParams {
  currentMonth: number;
  circulatingSupply: number;
  satReserves: number; // USD value
  saitPrice: number; // Current market price
}

function calculateBuybackRate(month: number): number {
  if (month <= 6) return 0.003; // 0.3%
  if (month <= 18) return 0.015; // 1.5%
  return 0.020; // 2.0%
}

function calculateMonthlyBuyback(params: BuybackParams): {
  tokensToBuy: number;
  satRequired: number;
  priceFloor: number;
} {
  const rate = calculateBuybackRate(params.currentMonth);
  const tokensToTarget = params.circulatingSupply * rate;

  // Use 7-day TWAP for buyback pricing
  const buybackPrice = params.saitPrice * 0.95; // 5% discount to TWAP
  const satRequired = tokensToTarget * buybackPrice;

  // Calculate price floor from reserves
  const monthlyDemand = tokensToTarget * buybackPrice;
  const priceFloor = (params.satReserves * 150) / monthlyDemand;

  return {
    tokensToTarget,
    satRequired,
    priceFloor
  };
}
```

#### 4. SAT Treasury Module
```typescript
interface TreasuryState {
  satReserves: number; // USD value
  saitHoldings: number; // Tokens
  monthlyInflows: {
    saitSales: number; // 125k tokens/month
    grantRecoveries: number; // 10% of funded
    lpFees: number; // 0.3% from SAIT/ETH
  };
  monthlyOutflows: {
    buybacks: number; // From buyback module
    operations: number; // Operational costs
  };
}

function projectTreasuryGrowth(
  initialReserves: number,
  months: number,
  saitPrice: number
): TreasuryState[] {
  const projections: TreasuryState[] = [];
  let reserves = initialReserves; // Start with $50M

  for (let m = 1; m <= months; m++) {
    // Monthly SAIT sales: 5% of 30M annually
    const saitSales = 125_000 * saitPrice;

    // Grant recoveries (assume 10% of $2M monthly grants)
    const grantRecoveries = 200_000;

    // LP fees (0.3% on volume)
    const lpFees = 50_000; // Conservative estimate

    // Buyback costs
    const buybackCost = calculateMonthlyBuyback({
      currentMonth: m,
      circulatingSupply: 10_000_000, // Simplified
      satReserves: reserves,
      saitPrice: saitPrice
    }).satRequired;

    reserves += saitSales + grantRecoveries + lpFees - buybackCost;

    projections.push({
      satReserves: reserves,
      saitHoldings: TREASURY_ALLOCATION - (m * 125_000),
      monthlyInflows: {
        saitSales,
        grantRecoveries,
        lpFees
      },
      monthlyOutflows: {
        buybacks: buybackCost,
        operations: 100_000
      }
    });
  }

  return projections;
}
```

#### 5. Price Model Module
```typescript
interface PriceProjection {
  month: number;
  basePrice: number; // Market-driven
  priceFloor: number; // Buyback-supported
  premiumTarget: number; // From equilibrium doc
  circulatingSupply: number;
}

function calculatePriceProjection(
  month: number,
  treasury: TreasuryState,
  circulating: number
): PriceProjection {
  // Base price from supply/demand
  const basePrice = 150 * (1 + 0.05 * (month / 12)); // 5% annual growth

  // Floor from buyback support
  const buyback = calculateMonthlyBuyback({
    currentMonth: month,
    circulatingSupply: circulating,
    satReserves: treasury.satReserves,
    saitPrice: basePrice
  });
  const priceFloor = buyback.priceFloor;

  // Premium targets from ASIP-SAIT-SAT-EQ-v5.pdf
  let premiumTarget: number;
  if (month <= 12) {
    premiumTarget = 165 + (month / 12) * 10; // $165-$175 Year 1
  } else if (month <= 24) {
    premiumTarget = 175 + ((month - 12) / 12) * 25; // $175-$200 Year 2
  } else {
    premiumTarget = 200 + ((month - 24) / 12) * 100; // $200-$300 Year 3
  }

  return {
    month,
    basePrice: Math.max(basePrice, priceFloor),
    priceFloor,
    premiumTarget,
    circulatingSupply: circulating
  };
}
```

#### 6. Governance Module
```typescript
interface GovernanceParams {
  circulatingSupply: number;
  stakedAmount: number;
  isInstitutional: boolean;
}

function calculateVotingPower(params: GovernanceParams): {
  votingPower: number;
  meetsThreshold: boolean;
  effectiveMultiplier: number;
} {
  // Quadratic voting
  const baseVotingPower = Math.sqrt(params.stakedAmount);

  // Institutional multiplier
  const multiplier = params.isInstitutional ? 1.5 : 1.0;
  const votingPower = baseVotingPower * multiplier;

  // 1% threshold check
  const threshold = params.circulatingSupply * 0.01;
  const meetsThreshold = params.stakedAmount >= threshold;

  return {
    votingPower,
    meetsThreshold,
    effectiveMultiplier: multiplier
  };
}

function calculateQuarterlyTransferLimit(
  vestedBalance: number,
  quarter: number
): number {
  // Q1-Q3: 25%, Q4: 50%
  const limitPercent = (quarter % 4 === 0) ? 0.50 : 0.25;
  return vestedBalance * limitPercent;
}
```

### Data Flow Architecture

```
User Inputs (Scenario Parameters)
    ↓
[Vesting Module] → Calculates unlocked tokens per vault
    ↓
[Circulating Supply Calculator] → Applies quarterly transfer limits
    ↓
[Treasury Module] → Projects SAT reserves from SAIT sales
    ↓
[Buyback Module] → Calculates buyback demand and floor price
    ↓
[Price Model] → Projects market price with buyback support
    ↓
[Governance Module] → Calculates voting power and thresholds
    ↓
Output: Charts, Tables, Metrics
```

### State Management

```typescript
interface CalculatorState {
  // Time Parameters
  currentMonth: number;
  projectionMonths: number; // Default: 36 (3 years)

  // Vault States
  vaults: {
    aiFund: VaultState;
    treasury: VaultState;
    team: VaultState;
    partners: VaultState;
  };

  // Market State
  saitPrice: number;
  circulatingSupply: number;

  // Treasury State
  treasury: TreasuryState;

  // Governance State
  activeKPIs: KPIMilestone[];
  votingParticipation: number;
  institutionalCount: number;

  // Projections
  priceProjections: PriceProjection[];
  treasuryProjections: TreasuryState[];
}
```

---

## Implementation Phases

### Phase 1: Core Tokenomics Engine (Weeks 1-2)

**Objective:** Replace variable supply and burn logic with fixed 100M supply and vault-based allocation

**Tasks:**
1. Remove supply selector UI and state (Lines 48-54)
2. Define constants for 100M supply and vault allocations
3. Implement TGE unlock calculations (9.73M initial circulation)
4. Create `VaultState` interface and initial state
5. Build vesting calculation functions for each vault type
6. Unit test vesting outputs against smart contract behavior

**Acceptance Criteria:**
- [ ] Total supply fixed at 100M
- [ ] All 4 vaults correctly initialized with allocations
- [ ] TGE unlocks total 9.73M tokens
- [ ] Vesting calculations match `AIFundVault.sol`, `TreasuryVault.sol`, `TeamVault.sol`, `PartnerVault.sol`

**Files to Modify:**
- `saitcalculatorv24.tsx`: Lines 48-82 (supply and allocation logic)

### Phase 2: Buyback Mechanism (Weeks 2-3)

**Objective:** Replace burn logic with SAIT→SAT buyback calculations

**Tasks:**
1. Remove all burn-related code (Lines 76-82, 146-156)
2. Implement `calculateBuybackRate()` with 3-tier schedule (0.3% → 1.5% → 2.0%)
3. Implement `calculateMonthlyBuyback()` with TWAP pricing
4. Create price floor calculation from SAT reserves
5. Add buyback impact to circulating supply reduction
6. Validate against equilibrium targets from ASIP-SAIT-SAT-EQ-v5.pdf

**Acceptance Criteria:**
- [ ] No burn logic remains in codebase
- [ ] Buyback rates match specification (0.3%, 1.5%, 2.0%)
- [ ] Price floor formula implemented: `(SAT Reserves * $150) / Monthly Demand`
- [ ] Buyback reduces circulating supply correctly
- [ ] Outputs align with 3-year equilibrium projections

**Files to Modify:**
- `saitcalculatorv24.tsx`: Lines 146-200 (replace burn with buyback)

### Phase 3: SAT Treasury Integration (Week 4)

**Objective:** Model SAT reserve growth and treasury operations

**Tasks:**
1. Create `TreasuryState` interface
2. Implement monthly SAIT sales (5% of 30M annually = 125k tokens/month)
3. Model grant recovery inflows (10% of funded grants)
4. Model LP fee inflows (0.3% on SAIT/ETH volume)
5. Implement `projectTreasuryGrowth()` function
6. Validate Year 1-3 targets: $4M → $244M → $626M → $979M

**Acceptance Criteria:**
- [ ] Initial SAT reserves set to $50M (institutional capital)
- [ ] Monthly SAIT sales correctly calculated
- [ ] Treasury projections match equilibrium document targets
- [ ] Buyback funding sourced from SAT reserves

**Files to Create:**
- `src/modules/treasury.ts` (new module)

**Files to Modify:**
- `saitcalculatorv24.tsx`: Integrate treasury state

### Phase 4: KPI & Governance Systems (Week 5)

**Objective:** Implement milestone-based unlocks and governance calculations

**Tasks:**
1. Create `KPIMilestone` interface with 3-tier system (1%, 2%, 3%)
2. Implement KPI unlock calculations for AI Fund vault
3. Implement milestone bonus calculations for Treasury vault
4. Create governance voting power calculator (quadratic + multiplier)
5. Implement 1% threshold check
6. Implement quarterly transfer limit logic (25%/50%)
7. Add KPI scenario builder UI

**Acceptance Criteria:**
- [ ] KPI unlocks respect tier caps (1%, 2%, 3%)
- [ ] Maximum 7 active KPIs enforced
- [ ] Combined unlocks cannot exceed 21% circulating supply
- [ ] Voting power = sqrt(stake) * (1.5 if institutional else 1.0)
- [ ] Quarterly limits correctly applied to all vaults

**Files to Create:**
- `src/modules/governance.ts` (new module)
- `src/components/KPIScenarioBuilder.tsx` (new component)

### Phase 5: Price Modeling (Week 6)

**Objective:** Implement buyback-supported price projections

**Tasks:**
1. Create `PriceProjection` interface
2. Implement base price growth model
3. Integrate buyback price floor calculations
4. Add equilibrium premium targets ($165-$175 Y1, $200 Y2, $300 Y3)
5. Create price chart component with floor + target bands
6. Add scenario comparison (conservative/moderate/aggressive)

**Acceptance Criteria:**
- [ ] Price floor always <= market price
- [ ] Year 1 projections target $165-$175 range
- [ ] Year 2 projections target $200
- [ ] Year 3 projections target $300
- [ ] Chart shows floor, market, and premium target bands

**Files to Create:**
- `src/components/PriceProjectionChart.tsx` (new component)

**Files to Modify:**
- `saitcalculatorv24.tsx`: Replace price logic (Lines 200-300)

### Phase 6: UI/UX Overhaul (Week 7)

**Objective:** Update interface to reflect new tokenomics model

**Tasks:**
1. Remove supply selector dropdown
2. Create 4-vault allocation breakdown display
3. Add vesting timeline Gantt chart
4. Create treasury dashboard panel (SAT reserves, monthly flows)
5. Add buyback metrics panel (rate, volume, price floor)
6. Create governance metrics panel (voting power, thresholds)
7. Redesign scenario controls (KPIs, time slider, institutional toggle)
8. Update all charts to use new data sources

**Acceptance Criteria:**
- [ ] No supply selection UI remains
- [ ] All 4 vaults displayed with clear breakdown
- [ ] Vesting timeline shows unlocks for 36 months
- [ ] Treasury panel shows SAT reserves and projections
- [ ] Buyback panel shows current rate and impact
- [ ] UI matches design patterns from ASIP-Dash repo

**Files to Modify:**
- `saitcalculatorv24.tsx`: Lines 300-695 (entire UI section)

**Design Reference:**
- `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/ASIP-Dash/src/components/GovernanceDashboard.jsx`

### Phase 7: Testing & Validation (Week 8)

**Objective:** Ensure calculator accuracy against production contracts

**Tasks:**
1. Write unit tests for all calculation modules
2. Create integration tests for end-to-end scenarios
3. Validate against smart contract outputs from SAITv2 repo
4. Cross-check equilibrium targets from ASIP-SAIT-SAT-EQ-v5.pdf
5. Test edge cases (max KPIs, zero buyback scenarios, cliff periods)
6. Performance testing (handle 100+ month projections)
7. Browser compatibility testing
8. Mobile responsiveness testing

**Acceptance Criteria:**
- [ ] 90%+ code coverage for calculation modules
- [ ] All vesting outputs match contract behavior within 0.01% tolerance
- [ ] Treasury projections match equilibrium doc targets within 5%
- [ ] Price floor calculations accurate to 2 decimal places
- [ ] UI renders correctly on mobile/tablet/desktop
- [ ] Calculator handles 120-month (10-year) projections without lag

**Files to Create:**
- `tests/vesting.test.ts`
- `tests/buyback.test.ts`
- `tests/treasury.test.ts`
- `tests/governance.test.ts`
- `tests/integration.test.ts`

### Phase 8: Deployment (Week 9)

**Objective:** Deploy updated calculator to production

**Tasks:**
1. Update README with new feature documentation
2. Create user guide for new scenario controls
3. Set up production build pipeline
4. Deploy to Replit (maintain current URL)
5. Configure analytics tracking
6. Create changelog documenting all changes
7. Notify stakeholders of launch

**Acceptance Criteria:**
- [ ] Production deployment successful at https://sait-scenario-calculator.replit.app/
- [ ] All features functional in production environment
- [ ] Analytics tracking operational
- [ ] User guide published
- [ ] Stakeholder notification sent

---

## Feature Breakdown

### Feature 1: Fixed 100M Supply

**Current Behavior:** Users can select from 500M, 1B, 5B, or 10B total supply
**New Behavior:** Fixed constant of 100M displayed (no selection)

**Implementation:**
```typescript
// Remove
const [totalSupplies] = useState<number[]>([...]);
const [selectedSupply, setSelectedSupply] = useState<number>(...);

// Replace with
const TOTAL_SUPPLY = 100_000_000;
```

**UI Changes:**
- Remove dropdown selector
- Add static display: "Total Supply: 100,000,000 SAIT (Fixed)"

### Feature 2: Vault-Based Allocation

**Current Behavior:** Single escrow/reserve split (70/30)
**New Behavior:** 4 distinct vaults with different vesting schedules

**Allocation Breakdown:**

| Vault | Amount | % | TGE Unlock | Locked |
|-------|--------|---|-----------|--------|
| AI Fund | 50M | 50% | 2.5M (5%) | 47.5M |
| Treasury | 30M | 30% | 6M (20%) | 24M |
| Team | 15M | 15% | 0.3M (2%) | 14.7M |
| Partners | 5M | 5% | 0.93M (18.6%) | 4.07M |

**UI Component:**
```typescript
<VaultAllocationPanel>
  <VaultCard
    name="AI Fund"
    total={50_000_000}
    unlocked={calculateAIFundVested(month, kpis)}
    vestingType="Milestone-Based"
  />
  <VaultCard
    name="Treasury"
    total={30_000_000}
    unlocked={calculateTreasuryVested(month)}
    vestingType="Hybrid"
  />
  <VaultCard
    name="Team"
    total={15_000_000}
    unlocked={calculateTeamVested(month)}
    vestingType="Linear (4yr, 1yr cliff)"
  />
  <VaultCard
    name="Partners"
    total={5_000_000}
    unlocked={calculatePartnerVested(month)}
    vestingType="Linear (2yr)"
  />
</VaultAllocationPanel>
```

### Feature 3: Vesting Timelines

**Current Behavior:** No vesting logic
**New Behavior:** Time-based and milestone-based unlock schedules

**Vesting Logic:**

**AI Fund Vault:**
- Type: Milestone-based (KPI unlocks)
- TGE: 2.5M (5%)
- Locked: 47.5M
- Unlock mechanism: KPI completion triggers release
- Tiers: 1% (1M), 2% (2M), or 3% (3M) per milestone
- Max active KPIs: 7
- Max combined unlocks: 21% of circulating supply

**Treasury Vault:**
- Type: Hybrid (drip + milestones)
- TGE: 6M (20%)
- Locked: 24M
- Drip: 1.33M/month for 18 months
- Milestone bonuses: Additional unlocks for major KPIs

**Team Vault:**
- Type: Linear with cliff
- TGE: 0.3M (2%)
- Locked: 14.7M
- Cliff: 12 months (no vesting)
- Linear: 48 months after cliff
- Monthly unlock: 14.7M / 48 = 306,250 tokens

**Partners Vault:**
- Type: Linear
- TGE: 0.93M (18.6%)
- Locked: 4.07M
- Linear: 24 months
- Monthly unlock: 4.07M / 24 = 169,583 tokens

**UI Component:**
```typescript
<VestingTimelineChart>
  <GanttTimeline
    vaults={[aiFund, treasury, team, partners]}
    monthRange={[0, 48]}
    highlightKPIs={true}
  />
</VestingTimelineChart>
```

### Feature 4: SAIT→SAT Buyback Mechanism

**Current Behavior:** Token burns based on usage
**New Behavior:** Treasury buys back SAIT using SAT reserves

**Buyback Schedule:**

| Period | Rate | Monthly Volume (at 10M circulating) |
|--------|------|-------------------------------------|
| Months 1-6 | 0.3% | 30,000 SAIT |
| Months 7-18 | 1.5% | 150,000 SAIT |
| Months 19+ | 2.0% | 200,000 SAIT |

**Pricing Mechanism:**
- Uses 7-day TWAP (Time-Weighted Average Price)
- Buyback executes at 5% discount to TWAP
- Creates price floor: `Floor = (SAT Reserves * $150) / Monthly Buyback Demand`

**Economic Impact:**
- Reduces circulating supply (deflationary)
- Provides downside price support
- Scales with circulation (% not fixed amount)

**Implementation:**
```typescript
function executeBuyback(state: CalculatorState): BuybackResult {
  const rate = calculateBuybackRate(state.currentMonth);
  const tokensToTarget = state.circulatingSupply * rate;
  const buybackPrice = state.saitPrice * 0.95; // 5% TWAP discount
  const satRequired = tokensToTarget * buybackPrice;

  // Check treasury can afford
  if (state.treasury.satReserves < satRequired) {
    return { executed: false, reason: 'Insufficient SAT reserves' };
  }

  // Execute buyback
  return {
    executed: true,
    tokensBought: tokensToTarget,
    satSpent: satRequired,
    newCirculating: state.circulatingSupply - tokensToTarget,
    newReserves: state.treasury.satReserves - satRequired,
    priceFloor: (state.treasury.satReserves * 150) / satRequired
  };
}
```

**UI Component:**
```typescript
<BuybackDashboard>
  <MetricCard label="Current Rate" value={`${rate * 100}%`} />
  <MetricCard label="Monthly Volume" value={formatNumber(volume)} />
  <MetricCard label="Price Floor" value={`$${floor.toFixed(2)}`} />
  <Chart type="line" data={buybackHistory} />
</BuybackDashboard>
```

### Feature 5: SAT Treasury Management

**Current Behavior:** No treasury modeling
**New Behavior:** SAT reserve tracking with inflows/outflows

**Treasury Mechanics:**

**SAT Token:**
- Pegged value: $150 per SAT
- Backing: 150% over-collateralized commodity basket
- Use: Treasury reserve asset for buybacks and stability

**Initial State:**
- Starting reserves: $50M (institutional commitments)
- Starting SAIT holdings: 30M tokens

**Monthly Inflows:**
1. **SAIT Sales**: 5% of 30M annually = 1.5M tokens/year = 125k tokens/month
   - Converted to SAT at market rate
2. **Grant Recoveries**: 10% of funded grants return to treasury
   - Estimated: $200k/month in SAT
3. **LP Fees**: 0.3% fee on SAIT/ETH liquidity pool
   - Estimated: $50k/month

**Monthly Outflows:**
1. **Buybacks**: Variable based on rate schedule
2. **Operations**: ~$100k/month operational costs

**Growth Targets (from ASIP-SAIT-SAT-EQ-v5.pdf):**
- Year 1: $50M → $244M (+$194M)
- Year 2: $244M → $626M (+$382M)
- Year 3: $626M → $979M (+$353M)

**Implementation:**
```typescript
function simulateTreasuryMonth(
  current: TreasuryState,
  month: number,
  saitPrice: number
): TreasuryState {
  // Calculate inflows
  const saitSalesSAT = 125_000 * saitPrice; // 125k SAIT sold
  const grantRecoveries = 200_000; // $200k
  const lpFees = 50_000; // $50k
  const totalInflows = saitSalesSAT + grantRecoveries + lpFees;

  // Calculate outflows
  const buybackCost = calculateMonthlyBuyback({
    currentMonth: month,
    circulatingSupply: 10_000_000, // Example
    satReserves: current.satReserves,
    saitPrice: saitPrice
  }).satRequired;
  const operations = 100_000;
  const totalOutflows = buybackCost + operations;

  // Update state
  return {
    satReserves: current.satReserves + totalInflows - totalOutflows,
    saitHoldings: current.saitHoldings - 125_000,
    monthlyInflows: {
      saitSales: saitSalesSAT,
      grantRecoveries,
      lpFees
    },
    monthlyOutflows: {
      buybacks: buybackCost,
      operations
    }
  };
}
```

**UI Component:**
```typescript
<TreasuryDashboard>
  <ReservesChart
    data={treasuryProjections}
    targets={[
      { month: 12, value: 244_000_000 },
      { month: 24, value: 626_000_000 },
      { month: 36, value: 979_000_000 }
    ]}
  />
  <FlowsTable>
    <Row label="SAIT Sales" value={inflows.saitSales} />
    <Row label="Grant Recoveries" value={inflows.grantRecoveries} />
    <Row label="LP Fees" value={inflows.lpFees} />
    <Row label="Buybacks" value={outflows.buybacks} negative />
    <Row label="Operations" value={outflows.operations} negative />
  </FlowsTable>
</TreasuryDashboard>
```

### Feature 6: Price Projections with Floor

**Current Behavior:** Basic supply/demand price model
**New Behavior:** Buyback-supported price floor with premium targets

**Price Components:**

1. **Base Market Price:** Supply/demand dynamics
2. **Price Floor:** Buyback support level
3. **Premium Target:** Equilibrium goals from docs

**Equilibrium Targets:**
- **Year 1:** $165-$175 (10-17% appreciation from $150 launch)
- **Year 2:** $200 (33% governance premium)
- **Year 3:** $300 (2:1 premium = fair value)

**Price Floor Formula:**
```
Floor = (Treasury SAT Reserves * $150) / (Monthly Buyback Demand)
```

**Example Calculation (Month 12):**
- SAT Reserves: $244M
- Buyback Rate: 1.5%
- Circulating Supply: 15M SAIT
- Monthly Buyback: 15M * 0.015 = 225k SAIT
- Floor = ($244M * $150) / (225k * Expected Price)
- If Expected Price = $170, Floor ≈ $168

**Implementation:**
```typescript
function calculatePriceProjection(
  month: number,
  treasury: TreasuryState,
  circulating: number
): PriceProjection {
  // Base price (simple appreciation model)
  const basePrice = 150 * Math.pow(1.05, month / 12); // 5% annual growth

  // Buyback floor
  const buybackRate = calculateBuybackRate(month);
  const monthlyDemand = circulating * buybackRate;
  const priceFloor = (treasury.satReserves * 150) / (monthlyDemand * basePrice);

  // Premium targets
  let premiumTarget: number;
  if (month <= 12) {
    premiumTarget = 165 + (month / 12) * 10; // $165-$175
  } else if (month <= 24) {
    premiumTarget = 175 + ((month - 12) / 12) * 25; // $175-$200
  } else {
    premiumTarget = 200 + ((month - 24) / 12) * 100; // $200-$300
  }

  return {
    month,
    basePrice: Math.max(basePrice, priceFloor),
    priceFloor,
    premiumTarget,
    circulatingSupply: circulating
  };
}
```

**UI Component:**
```typescript
<PriceChart>
  <LineSeries
    name="Market Price"
    data={projections.map(p => p.basePrice)}
    color="blue"
  />
  <LineSeries
    name="Price Floor"
    data={projections.map(p => p.priceFloor)}
    color="green"
    style="dashed"
  />
  <LineSeries
    name="Premium Target"
    data={projections.map(p => p.premiumTarget)}
    color="purple"
    style="dotted"
  />
  <BandArea
    upper="premiumTarget"
    lower="priceFloor"
    fill="rgba(0,255,0,0.1)"
  />
</PriceChart>
```

### Feature 7: KPI Milestone System

**Current Behavior:** No milestone modeling
**New Behavior:** 3-tier KPI unlock system for AI Fund and Treasury vaults

**KPI Tier System:**

| Tier | Unlock % | Max SAIT | Example Milestones |
|------|----------|----------|-------------------|
| Tier 1 | 1% | 1M | Minor product launches, pilot programs |
| Tier 2 | 2% | 2M | Major partnerships, revenue milestones |
| Tier 3 | 3% | 3M | Protocol upgrades, market expansion |

**Constraints:**
- Maximum 7 active KPIs at any time
- Combined unlocks cannot exceed 21% of circulating supply
- 30-day verification period post-milestone
- Board approval required for Tier 3 KPIs

**Use Cases:**

**AI Fund Vault:**
- 47.5M locked, released exclusively via KPIs
- Example: Tier 2 KPI completion → 2M SAIT unlocked for grants

**Treasury Vault:**
- Receives bonus unlocks for major KPIs (beyond 18-month drip)
- Example: Tier 3 KPI → 1M SAIT bonus for treasury operations

**Implementation:**
```typescript
interface KPIMilestone {
  id: string;
  tier: 1 | 2 | 3;
  unlockPercent: number; // 0.01, 0.02, or 0.03
  vault: 'AIFund' | 'Treasury';
  completionMonth: number;
  verified: boolean;
  description: string;
}

function calculateKPIUnlocks(
  kpis: KPIMilestone[],
  currentMonth: number,
  circulatingSupply: number
): { aiFundUnlock: number; treasuryBonus: number; valid: boolean; error?: string } {
  // Filter to completed and verified KPIs
  const completedKPIs = kpis.filter(k =>
    k.completionMonth <= currentMonth && k.verified
  );

  // Check max 7 active KPIs
  if (completedKPIs.length > 7) {
    return { aiFundUnlock: 0, treasuryBonus: 0, valid: false, error: 'Max 7 KPIs exceeded' };
  }

  // Calculate total unlock percentage
  const totalUnlockPercent = completedKPIs.reduce((sum, k) => sum + k.unlockPercent, 0);

  // Check 21% circulating supply limit
  if (totalUnlockPercent > 0.21) {
    return { aiFundUnlock: 0, treasuryBonus: 0, valid: false, error: '21% unlock limit exceeded' };
  }

  // Separate AI Fund and Treasury unlocks
  const aiFundKPIs = completedKPIs.filter(k => k.vault === 'AIFund');
  const treasuryKPIs = completedKPIs.filter(k => k.vault === 'Treasury');

  const aiFundUnlock = aiFundKPIs.reduce((sum, k) => {
    return sum + (k.tier === 1 ? 1_000_000 : k.tier === 2 ? 2_000_000 : 3_000_000);
  }, 0);

  const treasuryBonus = treasuryKPIs.reduce((sum, k) => {
    return sum + (k.tier === 1 ? 500_000 : k.tier === 2 ? 1_000_000 : 1_500_000);
  }, 0);

  return { aiFundUnlock, treasuryBonus, valid: true };
}
```

**UI Component:**
```typescript
<KPIScenarioBuilder>
  <KPIList>
    {kpis.map(kpi => (
      <KPICard
        key={kpi.id}
        tier={kpi.tier}
        vault={kpi.vault}
        unlockAmount={getTierAmount(kpi.tier, kpi.vault)}
        completionMonth={kpi.completionMonth}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />
    ))}
  </KPIList>
  <AddKPIButton onClick={handleAddKPI} disabled={kpis.length >= 7} />
  <ValidationWarnings>
    {totalUnlock > 0.21 && <Warning>Combined unlocks exceed 21% limit</Warning>}
    {kpis.length > 7 && <Warning>Maximum 7 KPIs allowed</Warning>}
  </ValidationWarnings>
</KPIScenarioBuilder>
```

### Feature 8: Governance Metrics

**Current Behavior:** No governance modeling
**New Behavior:** Voting power calculation with thresholds and multipliers

**Voting Mechanics:**

**Quadratic Voting:**
- Formula: `Voting Power = sqrt(Staked SAIT)`
- Prevents whale dominance
- Example: 10M stake = 3,162 votes (not 10M votes)

**Institutional Multiplier:**
- Verified institutions: 1.5x multiplier
- Example: 10M institutional stake = 3,162 * 1.5 = 4,743 votes

**Voting Threshold:**
- Minimum: 1% of circulating supply
- Only applies to grant selection votes
- Board has full authority for all other decisions

**Transfer Limits:**
- Q1-Q3: 25% of vested balance per quarter
- Q4: 50% of vested balance
- Prevents market dumping
- Institutional exemptions available

**Implementation:**
```typescript
function calculateGovernanceMetrics(
  stakedAmount: number,
  circulatingSupply: number,
  isInstitutional: boolean,
  vestedBalance: number,
  currentQuarter: number
): GovernanceMetrics {
  // Quadratic voting power
  const baseVotingPower = Math.sqrt(stakedAmount);
  const multiplier = isInstitutional ? 1.5 : 1.0;
  const votingPower = baseVotingPower * multiplier;

  // Threshold check (1% of circulating)
  const threshold = circulatingSupply * 0.01;
  const meetsThreshold = stakedAmount >= threshold;
  const thresholdGap = meetsThreshold ? 0 : threshold - stakedAmount;

  // Quarterly transfer limit
  const isQ4 = currentQuarter % 4 === 0;
  const limitPercent = isQ4 ? 0.50 : 0.25;
  const transferableAmount = vestedBalance * limitPercent;

  return {
    votingPower,
    meetsThreshold,
    thresholdGap,
    threshold,
    multiplier,
    transferableAmount,
    limitPercent
  };
}
```

**UI Component:**
```typescript
<GovernanceDashboard>
  <VotingPowerCard>
    <Metric label="Staked" value={formatNumber(staked)} unit="SAIT" />
    <Metric label="Voting Power" value={formatNumber(votingPower)} />
    <Metric label="Multiplier" value={`${multiplier}x`} />
    <ThresholdIndicator
      current={staked}
      threshold={threshold}
      meets={meetsThreshold}
    />
  </VotingPowerCard>

  <TransferLimitCard>
    <Metric label="Vested Balance" value={formatNumber(vested)} />
    <Metric label="Quarterly Limit" value={`${limitPercent * 100}%`} />
    <Metric label="Transferable Now" value={formatNumber(transferable)} />
    <ProgressBar current={transferable} max={vested} />
  </TransferLimitCard>
</GovernanceDashboard>
```

---

## Testing Strategy

### Unit Testing

**Test Coverage Goals:** 90%+ for all calculation modules

**Vesting Module Tests:**
```typescript
describe('Vesting Calculations', () => {
  test('AI Fund TGE unlock is 5% (2.5M)', () => {
    const unlock = calculateAIFundVested(0, []);
    expect(unlock).toBe(2_500_000);
  });

  test('Treasury drip releases 1.33M/month', () => {
    const month6 = calculateTreasuryVested(6, []);
    expect(month6).toBeCloseTo(6_000_000 + (6 * 1_333_333), -2);
  });

  test('Team vault has 12-month cliff', () => {
    const month11 = calculateTeamVested(11);
    expect(month11).toBe(300_000); // Only TGE

    const month13 = calculateTeamVested(13);
    expect(month13).toBeGreaterThan(300_000); // Vesting started
  });

  test('Partners vest linearly over 24 months', () => {
    const month24 = calculatePartnerVested(24);
    expect(month24).toBe(5_000_000); // Fully vested
  });
});
```

**Buyback Module Tests:**
```typescript
describe('Buyback Mechanism', () => {
  test('Buyback rate is 0.3% in months 1-6', () => {
    expect(calculateBuybackRate(3)).toBe(0.003);
  });

  test('Buyback rate increases to 1.5% in months 7-18', () => {
    expect(calculateBuybackRate(12)).toBe(0.015);
  });

  test('Buyback rate reaches 2.0% from month 19', () => {
    expect(calculateBuybackRate(24)).toBe(0.020);
  });

  test('Price floor calculated correctly', () => {
    const result = calculateMonthlyBuyback({
      currentMonth: 12,
      circulatingSupply: 15_000_000,
      satReserves: 244_000_000,
      saitPrice: 170
    });

    expect(result.priceFloor).toBeGreaterThan(150); // Must exceed SAT peg
    expect(result.tokensToTarget).toBe(15_000_000 * 0.015);
  });
});
```

**Treasury Module Tests:**
```typescript
describe('Treasury Projections', () => {
  test('Year 1 target: $244M reserves', () => {
    const projections = projectTreasuryGrowth(50_000_000, 12, 170);
    const year1 = projections[11];
    expect(year1.satReserves).toBeCloseTo(244_000_000, -6);
  });

  test('Monthly SAIT sales are 125k tokens', () => {
    const month1 = simulateTreasuryMonth({
      satReserves: 50_000_000,
      saitHoldings: 30_000_000,
      monthlyInflows: { saitSales: 0, grantRecoveries: 0, lpFees: 0 },
      monthlyOutflows: { buybacks: 0, operations: 0 }
    }, 1, 170);

    expect(month1.saitHoldings).toBe(30_000_000 - 125_000);
  });
});
```

**Governance Module Tests:**
```typescript
describe('Governance Calculations', () => {
  test('Voting power is sqrt of stake', () => {
    const metrics = calculateGovernanceMetrics(10_000_000, 15_000_000, false, 5_000_000, 1);
    expect(metrics.votingPower).toBeCloseTo(Math.sqrt(10_000_000), -2);
  });

  test('Institutional multiplier is 1.5x', () => {
    const regular = calculateGovernanceMetrics(10_000_000, 15_000_000, false, 5_000_000, 1);
    const institutional = calculateGovernanceMetrics(10_000_000, 15_000_000, true, 5_000_000, 1);

    expect(institutional.votingPower).toBeCloseTo(regular.votingPower * 1.5, -2);
  });

  test('1% threshold enforced', () => {
    const belowThreshold = calculateGovernanceMetrics(100_000, 15_000_000, false, 5_000_000, 1);
    const aboveThreshold = calculateGovernanceMetrics(200_000, 15_000_000, false, 5_000_000, 1);

    expect(belowThreshold.meetsThreshold).toBe(false);
    expect(aboveThreshold.meetsThreshold).toBe(true);
  });

  test('Q1-Q3 transfer limit is 25%', () => {
    const q1 = calculateGovernanceMetrics(1_000_000, 15_000_000, false, 5_000_000, 1);
    expect(q1.transferableAmount).toBe(5_000_000 * 0.25);
  });

  test('Q4 transfer limit is 50%', () => {
    const q4 = calculateGovernanceMetrics(1_000_000, 15_000_000, false, 5_000_000, 4);
    expect(q4.transferableAmount).toBe(5_000_000 * 0.50);
  });
});
```

**KPI Module Tests:**
```typescript
describe('KPI Unlock System', () => {
  test('Tier 1 unlocks 1M SAIT', () => {
    const kpis: KPIMilestone[] = [{
      id: '1',
      tier: 1,
      unlockPercent: 0.01,
      vault: 'AIFund',
      completionMonth: 6,
      verified: true,
      description: 'Pilot launch'
    }];

    const result = calculateKPIUnlocks(kpis, 6, 15_000_000);
    expect(result.aiFundUnlock).toBe(1_000_000);
  });

  test('Max 7 KPIs enforced', () => {
    const kpis = Array(8).fill(null).map((_, i) => ({
      id: `${i}`,
      tier: 1,
      unlockPercent: 0.01,
      vault: 'AIFund',
      completionMonth: i + 1,
      verified: true,
      description: `KPI ${i}`
    }));

    const result = calculateKPIUnlocks(kpis, 10, 15_000_000);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Max 7 KPIs');
  });

  test('21% combined limit enforced', () => {
    const kpis: KPIMilestone[] = Array(8).fill(null).map((_, i) => ({
      id: `${i}`,
      tier: 3, // 3% each
      unlockPercent: 0.03,
      vault: 'AIFund',
      completionMonth: i + 1,
      verified: true,
      description: `Major KPI ${i}`
    }));

    const result = calculateKPIUnlocks(kpis.slice(0, 7), 10, 15_000_000);
    expect(result.valid).toBe(false); // 7 * 3% = 21%, but we have 8 KPIs
  });
});
```

### Integration Testing

**End-to-End Scenario Tests:**

```typescript
describe('Full Calculator Simulation', () => {
  test('36-month projection matches equilibrium targets', () => {
    const initialState: CalculatorState = {
      currentMonth: 0,
      projectionMonths: 36,
      vaults: {
        aiFund: { total: 50_000_000, unlocked: 2_500_000, locked: 47_500_000, vested: 2_500_000, transferable: 2_500_000 },
        treasury: { total: 30_000_000, unlocked: 6_000_000, locked: 24_000_000, vested: 6_000_000, transferable: 6_000_000 },
        team: { total: 15_000_000, unlocked: 300_000, locked: 14_700_000, vested: 300_000, transferable: 300_000 },
        partners: { total: 5_000_000, unlocked: 930_000, locked: 4_070_000, vested: 930_000, transferable: 930_000 }
      },
      saitPrice: 150,
      circulatingSupply: 9_730_000,
      treasury: {
        satReserves: 50_000_000,
        saitHoldings: 30_000_000,
        monthlyInflows: { saitSales: 0, grantRecoveries: 0, lpFees: 0 },
        monthlyOutflows: { buybacks: 0, operations: 0 }
      },
      activeKPIs: [],
      votingParticipation: 0,
      institutionalCount: 0,
      priceProjections: [],
      treasuryProjections: []
    };

    const finalState = runFullProjection(initialState, 36);

    // Check Year 3 targets
    expect(finalState.treasury.satReserves).toBeCloseTo(979_000_000, -6);
    expect(finalState.saitPrice).toBeGreaterThan(250); // Approaching $300 target
    expect(finalState.circulatingSupply).toBeGreaterThan(20_000_000); // Vesting unlocked
  });

  test('Buyback reduces circulating supply over time', () => {
    const month0Supply = 9_730_000;
    const state = runFullProjection(getInitialState(), 24);

    // Buybacks should reduce supply (or slow growth)
    const naturalGrowth = calculateNaturalVesting(24);
    expect(state.circulatingSupply).toBeLessThan(naturalGrowth);
  });
});
```

### Contract Validation Tests

**Cross-reference with SAITv2 smart contracts:**

```typescript
describe('Smart Contract Alignment', () => {
  test('Vesting matches AIFundVault.sol', async () => {
    // Read actual contract outputs from SAITv2 repo
    const contractOutput = await readContractTest('/Users/warmachine/Documents/PROJECTS/ASIP/Dev/SAIT_v2/test/AIFundVault.t.sol');

    // Compare calculator output
    const calculatorOutput = calculateAIFundVested(12, mockKPIs);

    expect(calculatorOutput).toBeCloseTo(contractOutput, -2); // Within 0.01% tolerance
  });

  test('Buyback logic matches SAITSATSwap.sol', async () => {
    const contractBuyback = await simulateContractBuyback(params);
    const calculatorBuyback = calculateMonthlyBuyback(params);

    expect(calculatorBuyback.tokensToTarget).toBeCloseTo(contractBuyback.amount, -2);
  });
});
```

### Performance Testing

```typescript
describe('Performance', () => {
  test('Handles 120-month projection in <2 seconds', () => {
    const start = performance.now();
    runFullProjection(getInitialState(), 120);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(2000);
  });

  test('Chart rendering with 1000+ data points', () => {
    const dataPoints = Array(1000).fill(null).map((_, i) => ({
      month: i,
      price: 150 + Math.random() * 150
    }));

    const start = performance.now();
    render(<PriceChart data={dataPoints} />);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(500);
  });
});
```

### Browser Compatibility Testing

**Target Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Test Matrix:**
- Desktop: 1920x1080, 1366x768
- Tablet: 1024x768, 768x1024
- Mobile: 375x667, 414x896

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

---

## Deployment Plan

### Pre-Deployment Checklist

- [ ] All unit tests passing (90%+ coverage)
- [ ] Integration tests passing
- [ ] Contract validation tests passing
- [ ] Performance tests passing
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] User documentation complete
- [ ] Code review approved
- [ ] Stakeholder sign-off received

### Production Build

**Environment:**
- Platform: Replit
- URL: https://sait-scenario-calculator.replit.app/
- Build tool: Vite
- Target: ES2020
- Minification: Enabled
- Source maps: Production mode

**Build Commands:**
```bash
npm run build
npm run preview # Test production build locally
```

**Environment Variables:**
```
VITE_TOTAL_SUPPLY=100000000
VITE_SAT_PEG=150
VITE_INITIAL_SAT_RESERVES=50000000
VITE_ANALYTICS_ID=<tracking-id>
```

### Deployment Steps

1. **Final Testing:**
   ```bash
   npm run test
   npm run test:integration
   npm run test:e2e
   ```

2. **Build Production Assets:**
   ```bash
   npm run build
   ```

3. **Deploy to Replit:**
   - Push to main branch
   - Replit auto-deploys from main
   - Monitor build logs for errors

4. **Smoke Testing:**
   - Verify URL loads: https://sait-scenario-calculator.replit.app/
   - Test all major features
   - Check analytics integration
   - Verify mobile rendering

5. **Rollback Plan:**
   - Keep previous version tagged: `git tag v1.0-legacy`
   - Replit supports instant rollback to previous commits

### Post-Deployment

**Monitoring:**
- Analytics: Track user engagement
- Error logging: Sentry integration
- Performance: Core Web Vitals monitoring

**User Communication:**
- Announcement: Email to stakeholders
- Changelog: Published on calculator home page
- Tutorial: Video walkthrough of new features

**Success Metrics (30-day):**
- User sessions: Baseline + 20%
- Average session duration: Baseline + 30%
- Error rate: <1%
- Mobile usage: >20% of sessions

---

## Documentation Requirements

### User Guide

**Sections:**
1. **Introduction:** What changed and why
2. **Fixed Supply:** Understanding the 100M token model
3. **Vault Breakdown:** AI Fund, Treasury, Team, Partners
4. **Vesting Schedules:** How unlocks work
5. **Buyback Mechanism:** How SAIT→SAT works
6. **Price Projections:** Understanding floor + premium
7. **KPI Scenarios:** Creating custom milestone plans
8. **Governance:** Voting power and transfer limits
9. **FAQs:** Common questions

### Technical Documentation

**API Reference:**
```typescript
/**
 * Calculate vested amount for AI Fund vault
 * @param currentMonth - Months since TGE
 * @param completedKPIs - Array of verified KPI milestones
 * @returns Total unlocked SAIT tokens
 */
function calculateAIFundVested(
  currentMonth: number,
  completedKPIs: KPIMilestone[]
): number;
```

**Architecture Diagram:**
```
┌─────────────────┐
│  User Inputs    │
│  - Month slider │
│  - KPI builder  │
│  - Toggles      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Calculation Engine              │
│  ┌──────────┐  ┌─────────────────┐ │
│  │ Vesting  │  │ Buyback         │ │
│  │ Module   │  │ Module          │ │
│  └────┬─────┘  └────┬────────────┘ │
│       │             │              │
│  ┌────▼─────┐  ┌───▼──────────┐   │
│  │ Treasury │  │ Price        │   │
│  │ Module   │  │ Model        │   │
│  └────┬─────┘  └───┬──────────┘   │
│       │             │              │
│  ┌────▼─────────────▼──────────┐  │
│  │   Governance Module         │  │
│  └────┬────────────────────────┘  │
└───────┼───────────────────────────┘
        │
        ▼
┌─────────────────┐
│  UI Components  │
│  - Charts       │
│  - Tables       │
│  - Metrics      │
└─────────────────┘
```

### Changelog

**Version 2.0.0 - Major Overhaul**

**Breaking Changes:**
- Removed variable supply options (500M-10B)
- Fixed total supply at 100M SAIT
- Replaced burn mechanism with buyback system

**New Features:**
- 4-vault allocation system (AI Fund, Treasury, Team, Partners)
- Time-based and milestone-based vesting schedules
- SAIT→SAT buyback mechanism with 3-tier rate schedule
- SAT treasury reserve modeling and projections
- Price floor calculations from buyback support
- KPI milestone system (3 tiers, 7 max active, 21% limit)
- Governance metrics (quadratic voting, institutional multiplier)
- Quarterly transfer limit enforcement
- 36-month projections aligned with equilibrium targets

**Improvements:**
- Calculator now matches SAITv2 smart contract behavior
- All projections validated against ASIP equilibrium documents
- Enhanced UI with vault breakdowns and treasury dashboard
- Added vesting timeline Gantt chart
- Mobile-responsive redesign

**Bug Fixes:**
- Corrected allocation percentages
- Fixed price modeling to include buyback floor
- Removed incorrect burn calculations

---

## Success Metrics

### Technical Accuracy

- [ ] Vesting calculations match smart contracts within 0.01% tolerance
- [ ] Treasury projections hit Year 1-3 targets within 5% variance
- [ ] Price floor formula validated against equilibrium model
- [ ] KPI unlock logic enforces all constraints correctly
- [ ] Governance calculations match quadratic + multiplier formula

### User Experience

- [ ] Page load time <2 seconds
- [ ] All charts render in <500ms
- [ ] Mobile responsiveness on all screen sizes
- [ ] Accessibility: WCAG 2.1 AA compliance
- [ ] Zero JavaScript errors in production

### Adoption

**30-Day Targets:**
- User sessions: +20% from baseline
- Average session duration: +30%
- Bounce rate: <40%
- Mobile usage: >20%
- Returning users: >30%

**Stakeholder Feedback:**
- Executive team approval
- Smart contract team validation
- Community member testing (n≥10)

---

## Risk Mitigation

### Technical Risks

**Risk:** Calculation errors lead to incorrect projections
**Mitigation:**
- Comprehensive unit test coverage (90%+)
- Cross-validation against smart contracts
- Multiple stakeholder reviews

**Risk:** Performance issues with long projections
**Mitigation:**
- Performance testing up to 120 months
- Web worker offloading for heavy calculations
- Progressive rendering for charts

**Risk:** Browser compatibility issues
**Mitigation:**
- Test matrix across major browsers
- Polyfills for older browsers
- Progressive enhancement approach

### Product Risks

**Risk:** User confusion with new features
**Mitigation:**
- Comprehensive user guide
- Tutorial tooltips in UI
- Video walkthrough
- FAQ section

**Risk:** Misalignment with actual tokenomics
**Mitigation:**
- Direct smart contract team collaboration
- Reference ASIP documents as source of truth
- Quarterly audits of calculator vs. reality

### Deployment Risks

**Risk:** Production bugs after launch
**Mitigation:**
- Staging environment testing
- Gradual rollout capability
- Instant rollback plan
- Error monitoring (Sentry)

---

## Appendix

### Reference Documents

1. **ASIP-Allocation-v5.pdf** - Canonical allocation and vesting schedules
2. **ASIP-SAIT-SAT-EQ-v5.pdf** - Price targets and treasury projections
3. **ASIP-Governance-v04.pdf** - Voting mechanics and KPI system
4. **ASIP-WP-v5-1.pdf** - Overall system architecture
5. **ASIP-Risk-Scenarios.pdf** - Risk mitigation strategies

### Repository References

1. **SAITv2 Token:** `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/SAIT_v2`
   - Smart contracts for vesting, buyback, governance

2. **ASI Governance Dashboard:** `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/ASIP-Dash`
   - UI/UX patterns for metrics display

3. **ABC Protocol:** `/Users/warmachine/Documents/PROJECTS/ASIP/Dev/ABC-Protocol`
   - Complementary 100M token protocol

### Glossary

- **SAIT:** Safe AI Token - Governance token, 100M fixed supply
- **SAT:** Safe Asset Token - Treasury reserve token, $150 peg
- **TGE:** Token Generation Event - Initial distribution
- **KPI:** Key Performance Indicator - Milestone for unlocks
- **TWAP:** Time-Weighted Average Price - 7-day average for buyback pricing
- **Quadratic Voting:** Voting power = sqrt(stake) to prevent whale dominance
- **Cliff:** Period with no vesting before linear schedule begins

### Contact & Support

**Project Lead:** [Name]
**Smart Contract Team:** [Contact]
**UI/UX Designer:** [Contact]
**QA Lead:** [Contact]

**Issue Reporting:** [GitHub Issues URL]
**Documentation:** [Wiki URL]
**Community:** [Discord/Telegram URL]

---

**Document Version:** 1.0
**Last Updated:** December 10, 2025
**Status:** Ready for Implementation
**Next Review:** Post-Phase 8 completion
