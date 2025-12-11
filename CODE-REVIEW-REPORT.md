# Code Review Report: ASI Calculator Upgrade
**Date:** December 10, 2025
**Reviewer:** Claude Code
**Status:** Pre-Deployment Review

---

## Executive Summary

The ASI Calculator upgrade successfully implements the Trinity Token System (SAIT/ABC/SAT) with a modular architecture. However, **7 critical errors and 4 minor issues** have been identified that must be fixed before deployment. These issues range from calculation errors to UI rendering bugs.

**Overall Assessment:** ⚠️ **NOT READY FOR DEPLOYMENT**
**Estimated Fix Time:** 2-4 hours
**Risk Level:** MEDIUM (calculation errors could lead to incorrect projections)

---

## Critical Errors (Must Fix Before Deployment)

### 1. ❌ CRITICAL: Double-Counting Burns in Circulating Supply
**File:** `saitcalculatorv24.tsx:201-202`
**Severity:** HIGH - Incorrect calculations

**Current Code:**
```typescript
circulatingSupply = totalUnlockedSupply - totalBurned - effectiveBurn;
totalBurned += effectiveBurn;
```

**Issue:**
The code subtracts both `totalBurned` (cumulative) AND `effectiveBurn` (current month), then adds `effectiveBurn` to `totalBurned`. This double-counts the current month's burn, leading to incorrect circulating supply calculations.

**Correct Logic:**
```typescript
// First add current burn to cumulative total
totalBurned += effectiveBurn;
// Then calculate circulating supply using cumulative total only
circulatingSupply = totalUnlockedSupply - totalBurned;
```

**Impact:** Circulating supply will be understated by the cumulative sum of all monthly burns, leading to progressively incorrect projections.

---

### 2. ❌ CRITICAL: CSS Class Syntax Error in Tab Buttons
**File:** `saitcalculatorv24.tsx:426,432`
**Severity:** HIGH - UI rendering broken

**Current Code:**
```typescript
className={`px - 4 py - 2 rounded - md font - semibold ${...}`}
```

**Issue:**
Spaces between class name components (e.g., `px - 4` instead of `px-4`) will prevent Tailwind CSS from applying styles. The tab buttons will render without proper styling.

**Correct Syntax:**
```typescript
className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'SAIT' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
```

**Impact:** Tab switching UI will be visually broken and may confuse users.

---

### 3. ❌ CRITICAL: Incorrect Type Casting for Final Metrics
**File:** `saitcalculatorv24.tsx:410-412,461`
**Severity:** MEDIUM - Runtime type errors

**Current Code:**
```typescript
// Line 410-412
const final = activeTab === 'SAIT'
  ? (calculateScenario.length > 0 ? calculateScenario[calculateScenario.length - 1] : undefined) as ScenarioData
  : (calculateABC.length > 0 ? calculateABC[calculateABC.length - 1] : undefined) as ABCScenarioData;

// Line 461 - Always casts to ScenarioData even when ABC is active
{formatTokens(activeTab === 'SAIT' ? (final as ScenarioData)?.totalBurned : (final as ABCScenarioData)?.burnedTokens || 0)}
```

**Issue:**
When `activeTab === 'ABC'`, `final` is of type `ABCScenarioData`, but the code tries to access `totalBurned` (which is `burnedTokens` in ABC). The ternary correctly handles this on line 461, but the type system is confused.

**Correct Implementation:**
```typescript
// Create properly typed accessors
const finalSait = activeTab === 'SAIT' && calculateScenario.length > 0
  ? calculateScenario[calculateScenario.length - 1]
  : null;

const finalAbc = activeTab === 'ABC' && calculateABC.length > 0
  ? calculateABC[calculateABC.length - 1]
  : null;

// Then use appropriate accessor
{formatTokens(activeTab === 'SAIT' ? (finalSait?.totalBurned || 0) : (finalAbc?.burnedTokens || 0))}
```

**Impact:** May cause TypeScript errors and potential runtime issues when switching between tabs.

---

### 4. ❌ CRITICAL: Treasury Runway Calculation Logic Error
**File:** `saitcalculatorv24.tsx:268-270`
**Severity:** MEDIUM - Misleading metrics

**Current Code:**
```typescript
const runway = satReserves > 0 && monthlyOpex > treasuryState.monthlyInflows.saitSales
  ? Math.floor(satReserves / monthlyOpex)
  : Infinity;
```

**Issue:**
Compares `monthlyOpex` only to `saitSales` inflows, ignoring `grantRecoveries` and `lpFees`. This incorrectly shows Infinity runway when total inflows exceed opex, even if SAIT sales alone don't.

**Correct Logic:**
```typescript
const totalMonthlyInflows =
  treasuryState.monthlyInflows.saitSales +
  treasuryState.monthlyInflows.grantRecoveries +
  treasuryState.monthlyInflows.lpFees;

const netBurn = monthlyOpex + buybackCost - totalMonthlyInflows;

const runway = netBurn > 0 && satReserves > 0
  ? Math.floor(satReserves / netBurn)
  : Infinity;
```

**Impact:** Treasury runway will be incorrectly reported as infinite, hiding potential funding shortfalls.

---

### 5. ❌ MEDIUM: Missing KPI Validation Logic
**File:** `src/modules/tokenomics.ts:111-127`
**Severity:** MEDIUM - Logic incomplete

**Current Code:**
```typescript
function calculateKPIUnlocks(completedKPIs: KPIMilestone[]): number {
    let totalUnlockedPercent = 0;
    for (const kpi of completedKPIs) {
        if (kpi.achievedMonth !== undefined) {
             totalUnlockedPercent += kpi.tier;
        }
    }
    // Limit? "Combined unlocks cannot exceed 21% of circulating supply" - this is a check, not the amount calc.

    return totalUnlockedPercent * 1_000_000; // 1% = 1M tokens (since 100M total)
}
```

**Issue:**
The plan specifies:
- Maximum 7 active KPIs
- Combined unlocks cannot exceed 21% of circulating supply

Neither constraint is enforced in this function.

**Required Addition:**
```typescript
function calculateKPIUnlocks(
  completedKPIs: KPIMilestone[],
  circulatingSupply: number
): { amount: number; valid: boolean; error?: string } {
    // Validate max 7 KPIs
    if (completedKPIs.filter(k => k.achievedMonth !== undefined).length > 7) {
        return { amount: 0, valid: false, error: 'Maximum 7 KPIs exceeded' };
    }

    let totalUnlockedPercent = 0;
    for (const kpi of completedKPIs) {
        if (kpi.achievedMonth !== undefined) {
             totalUnlockedPercent += kpi.tier / 100; // tier is 1, 2, or 3 (percent)
        }
    }

    // Validate 21% limit
    if (totalUnlockedPercent > 0.21) {
        return { amount: 0, valid: false, error: '21% unlock limit exceeded' };
    }

    return {
      amount: totalUnlockedPercent * 100_000_000, // Percent of total supply
      valid: true
    };
}
```

**Impact:** Users could create invalid scenarios with >7 KPIs or >21% unlocks, producing unrealistic projections.

---

### 6. ❌ MEDIUM: Incorrect Treasury Initial Holdings
**File:** `saitcalculatorv24.tsx:134-138`
**Severity:** MEDIUM - Calculation mismatch

**Current Code:**
```typescript
let treasurySaitHoldings = TREASURY_TOTAL_ALLOCATION - TGE_TREASURY; // 30M - 6M = 24M
```

**Issue:**
The plan states Treasury holds 30M SAIT total, with 6M unlocked at TGE (20%). The 6M unlocked doesn't mean it's "spent" - it means it's available for use but still in treasury custody. For tracking sales (5% annually = 1.5M/year), the treasury should start with the full 30M allocation.

**Alternative Interpretation:**
If the 6M TGE is immediately distributed (not held by treasury), then the initial holdings should be 24M, but the comment at line 134-138 suggests uncertainty.

**Required Clarification:**
Need to verify from ASIP-Allocation-v5.pdf whether:
- **Option A:** Treasury holds all 30M, sells 1.5M/year (125k/month) from total
- **Option B:** Treasury only holds locked 24M, 6M TGE is already circulating

**Recommendation:** Review ASIP-Allocation-v5.pdf specification. If Treasury controls the TGE portion for gradual sales, initialize with 30M. Otherwise, 24M is correct but add clarifying comment.

---

### 7. ❌ MEDIUM: Missing Treasury SAIT Depletion Check
**File:** `src/modules/treasury.ts:33-34,54`
**Severity:** MEDIUM - Unrealistic projections

**Current Code:**
```typescript
const monthlySaitSalesVolume = 125_000;
const saitSalesRevenue = monthlySaitSalesVolume * input.saitPrice;

// Later...
const newSaitHoldings = input.prevSaitHoldings - monthlySaitSalesVolume;

return {
    ...
    saitHoldings: Math.max(0, newSaitHoldings),
    ...
};
```

**Issue:**
The function always attempts to sell 125k SAIT regardless of remaining holdings. If `prevSaitHoldings < 125_000`, it should reduce sales accordingly.

**Correct Logic:**
```typescript
const monthlySaitSalesVolume = Math.min(125_000, input.prevSaitHoldings);
const saitSalesRevenue = monthlySaitSalesVolume * input.saitPrice;

// Later...
const newSaitHoldings = input.prevSaitHoldings - monthlySaitSalesVolume;
```

**Impact:** After 24 months (24M holdings / 125k per month = 192 months if 30M, or 192 months), the treasury would show 0 holdings but continue reporting sales revenue, creating impossible projections.

---

## Minor Issues (Should Fix)

### 8. ⚠️ MINOR: Unclear Treasury Milestone Bonus Logic
**File:** `src/modules/tokenomics.ts:64-77`
**Severity:** LOW - Incomplete implementation

**Current Code:**
```typescript
// Treasury: Hybrid (18-month drip + milestones)
if (schedule.type === 'hybrid') {
  const dripMonths = Math.min(currentMonth, 18);
  const dripAmount = dripMonths * 1_333_333;
  const cappedDrip = Math.min(dripAmount, 24_000_000);

  const milestoneBonus = calculateKPIUnlocks(completedKPIs); // This might need adjustment

  return cappedDrip; // TODO: Clarify Treasury Milestone Bonuses logic
}
```

**Issue:**
The plan mentions "Treasury: 24M locked, 18-month drip (1.33M/month) + milestone bonuses" but the implementation ignores `milestoneBonus`. There's a TODO comment acknowledging this.

**Recommendation:**
Clarify with stakeholders whether:
- Treasury gets separate milestone bonuses (different KPIs from AI Fund)
- Treasury shares the same KPI pool as AI Fund
- Treasury only has drip, no bonuses

Then update implementation accordingly.

---

### 9. ⚠️ MINOR: Magic Number in ABC Burn Calculation
**File:** `saitcalculatorv24.tsx:356`
**Severity:** LOW - Code maintainability

**Current Code:**
```typescript
const monthlyBurn = (abcBountiesMonthly * stakePerBounty * failureRate) +
  (abcMonthlyPapers * 10 * failureRate); // 10 ABC fee per paper?
```

**Issue:**
The `10` is a magic number with unclear meaning. Should be a named constant.

**Recommended Fix:**
```typescript
const ABC_PAPER_SUBMISSION_FEE = 10; // ABC tokens

// Later in calculation:
const monthlyBurn =
  (abcBountiesMonthly * stakePerBounty * failureRate) +
  (abcMonthlyPapers * ABC_PAPER_SUBMISSION_FEE * failureRate);
```

---

### 10. ⚠️ MINOR: Inconsistent Month Indexing
**File:** `src/modules/abcTokenomics.ts:46-60,64-70,74-80`
**Severity:** LOW - Potential off-by-one errors

**Current Code:**
```typescript
// getTreasuryUnlock assumes month starts at 1
const yearIndex = Math.floor((month - 1) / 12);

// getInstituteUnlock assumes month starts at 1
if (month <= 6) return 0;

// getLiquidityUnlock assumes month starts at 1
return tge + (remaining * (month / 48));
```

**Issue:**
All ABC functions assume `month` parameter starts at 1, but the main calculator loop also starts at 1 (line 140: `for (let month = 1; month <= timeHorizon; month++)`). This is **consistent** but differs from typical 0-indexed arrays.

**Recommendation:**
Add JSDoc comments to clarify:
```typescript
/**
 * Calculate Treasury Unlock for a given month
 * @param month - Month number starting from 1 (not 0-indexed)
 * @returns Total unlocked SAIT tokens up to this month
 */
export function getTreasuryUnlock(month: number): number {
  // ... implementation
}
```

---

### 11. ⚠️ MINOR: ABC Circulating Supply Doesn't Subtract Staked Tokens
**File:** `saitcalculatorv24.tsx:360-364`
**Severity:** LOW - Misleading metric

**Current Code:**
```typescript
// 3. Burns (Deflation)
// ...
const stakedMatches = activePapersCurationStake + activeBountyStake;
const circulating = Math.max(0, totalSupplyPossible - totalBurned);
// const freeFloat = Math.max(0, circulating - stakedMatches); // COMMENTED OUT
```

**Issue:**
The comment on lines 360-361 states "Staked tokens are technically circulating but locked in contracts," but then the `circulating` variable includes staked tokens. The `freeFloat` calculation is commented out.

**Recommendation:**
Either:
- **Option A:** Rename `circulating` to `totalSupply` and uncomment `freeFloat` to use as actual circulating
- **Option B:** Subtract staked from circulating: `const circulating = Math.max(0, totalSupplyPossible - totalBurned - stakedMatches);`

Clarify which metric should be displayed as "Circulating Supply" in the UI.

---

## Positive Findings ✅

### What Was Done Well:

1. **✅ Modular Architecture:** Clean separation into `tokenomics.ts`, `treasury.ts`, `governance.ts`, and `abcTokenomics.ts` makes the code maintainable and testable.

2. **✅ Dual-Mode UI:** Tab-based switching between SAIT and ABC modes is intuitive and well-implemented.

3. **✅ Buyback Implementation:** Lines 169-177 correctly implement the 3-tier buyback rate schedule (0.3% → 1.5% → 2.0%).

4. **✅ Vesting Logic:** The vesting calculations for Team (cliff + linear) and Partners (linear) match the project plan specifications.

5. **✅ Price Floor Concept:** Using `satReserves / circulatingSupply` as a backing floor (line 231) is a reasonable interpretation of the confusing plan specification.

6. **✅ Treasury Flow Model:** The `calculateMonthlyTreasuryFlow` function correctly models inflows (SAIT sales, grant recoveries, LP fees) and outflows (buybacks, operations).

7. **✅ Responsive Charts:** Recharts integration for price and supply visualization is clean and functional.

8. **✅ Constants Extraction:** All magic numbers (100M supply, vault allocations, TGE unlocks) are properly defined as constants.

---

## Recommendations for Immediate Action

### Priority 1: Fix Before Any Testing
1. Fix double-counting burn error (Error #1) - **CRITICAL**
2. Fix CSS class syntax (Error #2) - **CRITICAL**
3. Fix type casting issue (Error #3) - **CRITICAL**

### Priority 2: Fix Before Deployment
4. Fix treasury runway calculation (Error #4)
5. Add KPI validation logic (Error #5)
6. Fix treasury SAIT depletion check (Error #7)
7. Clarify treasury initial holdings (Error #6) - requires spec review

### Priority 3: Quality Improvements
8. Resolve treasury milestone bonus TODO (Issue #8)
9. Replace magic number with constant (Issue #9)
10. Add JSDoc comments for month indexing (Issue #10)
11. Clarify ABC circulating supply metric (Issue #11)

---

## Testing Recommendations

Once critical errors are fixed, test the following scenarios:

### SAIT Mode Tests:
1. **36-month projection** - Verify:
   - Circulating supply increases monotonically (no sudden drops from double-counting)
   - Treasury SAT reserves grow toward Year 3 target ($979M)
   - Price stays above floor at all times
   - Runway decreases when outflows > inflows

2. **KPI Scenarios** - Verify:
   - Cannot add more than 7 KPIs
   - Combined unlocks cannot exceed 21%
   - AI Fund vesting only increases when KPIs are achieved

3. **Treasury Depletion** - Verify:
   - After 24 months (if starting with 30M), SAIT holdings approach zero
   - Sales revenue goes to zero when holdings depleted
   - No negative holdings displayed

### ABC Mode Tests:
1. **60-month projection** - Verify:
   - Treasury emission follows schedule (15M Y1, 12M Y2, etc.)
   - Staked tokens reduce free float correctly
   - Burns from failures accumulate
   - Price increases with scarcity ratio

2. **Extreme Usage** - Verify:
   - High paper volume (500/month) creates realistic staking levels
   - Zero papers/bounties doesn't crash calculator
   - Burns never exceed total supply

---

## Alignment with Project Plan

### ✅ Requirements Met:
- [x] Fixed 100M supply for SAIT and ABC
- [x] Buyback mechanism replaces burns
- [x] 4-vault allocation (AI Fund, Treasury, Team, Partners)
- [x] SAT treasury reserve tracking
- [x] Price floor calculations
- [x] Dual-mode UI (SAIT/ABC)
- [x] Vesting schedules implemented

### ⚠️ Partially Met:
- [~] KPI system (missing validation constraints)
- [~] Treasury milestone bonuses (TODO not resolved)
- [~] Governance metrics (voting power not displayed in UI)

### ❌ Not Implemented:
- [ ] Quarterly transfer limits (25%/50% Q1-Q3/Q4)
- [ ] 1% voting threshold indicator
- [ ] Institutional multiplier UI controls
- [ ] Vesting timeline Gantt chart visualization
- [ ] Premium target bands on price chart

**Note:** The "Not Implemented" items were in Phase 6 (UI/UX Overhaul) of the plan but may not be required for MVP deployment.

---

## Code Quality Assessment

| Category | Rating | Notes |
|----------|--------|-------|
| Architecture | ⭐⭐⭐⭐☆ | Excellent modular design, minor issues |
| Calculation Logic | ⭐⭐⭐☆☆ | Core logic sound but critical errors present |
| Type Safety | ⭐⭐⭐☆☆ | TypeScript used but type casting issues |
| Error Handling | ⭐⭐☆☆☆ | Minimal validation, missing edge case handling |
| Code Clarity | ⭐⭐⭐⭐☆ | Well-structured, some TODO comments remain |
| UI/UX | ⭐⭐⭐⭐☆ | Clean interface, CSS syntax error breaks styling |
| Documentation | ⭐⭐☆☆☆ | Minimal comments, JSDoc missing |
| **Overall** | **⭐⭐⭐☆☆** | **Good foundation with fixable issues** |

---

## Deployment Readiness Checklist

- [ ] Fix Error #1: Double-counting burns
- [ ] Fix Error #2: CSS class syntax
- [ ] Fix Error #3: Type casting
- [ ] Fix Error #4: Treasury runway calculation
- [ ] Fix Error #5: KPI validation
- [ ] Fix Error #6: Treasury initial holdings (after spec clarification)
- [ ] Fix Error #7: SAIT depletion check
- [ ] Resolve Issue #8: Treasury milestone bonuses TODO
- [ ] Add JSDoc comments for public functions
- [ ] Write unit tests for calculation modules
- [ ] Cross-validate against ASIP equilibrium targets
- [ ] Test edge cases (zero inputs, max time horizon)
- [ ] Browser compatibility test (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness test
- [ ] Stakeholder review and sign-off

**Current Status:** 0/15 items complete

---

## Conclusion

The ASI Calculator upgrade demonstrates **strong architectural design** and successfully implements the Trinity Token System concept. However, **7 critical errors must be fixed** before deployment to ensure calculation accuracy and UI functionality.

**Estimated fix time:** 2-4 hours for Priority 1 & 2 items.

**Recommended Next Steps:**
1. Fix all Priority 1 errors immediately (30 min)
2. Clarify treasury specification with stakeholders (15 min)
3. Fix all Priority 2 errors (90 min)
4. Run comprehensive test suite (60 min)
5. Address Priority 3 quality improvements (90 min)
6. Final stakeholder review

Once these issues are resolved, the calculator will be **ready for production deployment**.

---

**Report Prepared By:** Claude Code
**Review Date:** December 10, 2025
**Next Review:** After Priority 1 & 2 fixes implemented
