# ABC Commons Protocol (Unified)
**Technical Proposal – Merged Architecture**  
**December 2025** · **ASI Institute**

---

## Executive Summary

The ABC Commons Protocol is a unified, on-chain infrastructure for AI alignment research that combines distributed expert curation with micro-grant bounties under a single token economy. This document presents the **merged architecture** of the previously separate ABC Protocol (bounty system) and MERIDIAN Protocol (curation system).

### One-Sentence Value Proposition

ABC Commons enables researchers to earn money and build verifiable professional reputation by curating AI alignment research AND completing bounties, creating convergent quality signals that inform ASIP grant decisions through a transparent, on-chain economy.

### Why Merge?

| Challenge | Separate Protocols (ABC + MRD) | Unified Protocol (ABC Commons) |
|-----------|-------------------------------|--------------------------------|
| **User confusion** | "Do I need ABC or MRD tokens?" | Single token, clear utility |
| **Liquidity fragmentation** | $10M + $5M = thin markets | $15M concentrated liquidity |
| **Narrative complexity** | "We have two tokens that work together..." | "ABC is the public commons for AI alignment" |
| **Development resources** | Split across 2 codebases | Focused on 1 excellent protocol |
| **Network effects** | Two separate communities | Single, stronger community |

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Architecture](#solution-architecture)
3. [Token Economics ($ABC)](#token-economics)
4. [Mechanism 1: Research Curation](#mechanism-1-research-curation)
5. [Mechanism 2: Bounty System](#mechanism-2-bounty-system)
6. [Authority Score System](#authority-score-system)
7. [ASIP Integration](#asip-integration)
8. [Technical Architecture](#technical-architecture)
9. [Launch Roadmap](#launch-roadmap)
10. [Success Metrics](#success-metrics)

---

## Problem Statement

### Current AI Safety Funding Crisis

| Problem | Impact | ABC Commons Solution |
|---------|--------|---------------------|
| **90% of AI safety funding is private, opaque** | Geographic concentration, limited diverse perspectives | 100% on-chain transparency, globally accessible |
| **No economic incentive for research curation** | Quality signals trapped in private channels (Slack, LinkedIn) | Earn $ABC for accurate paper evaluations |
| **Informal reputation is unverifiable** | "I'm good at evaluating research" can't be proven | Authority Score = on-chain, auditable track record |
| **Micro-grants (\$500-\$50k) are inaccessible** | Institutional minimums start at \$250k+ | Direct bounties paid instantly on milestone verification |
| **Grant boards lack objective expertise signals** | Committee selection based on personal networks | Recruit from curators with Authority Score >2000 |

### Market Opportunity

- **Total Addressable Market:** $16.2T AI ecosystem by 2030
- **Serviceable Market:** $500M-$2B in annual AI safety research funding globally
- **Obtainable Market:** $5M+ treasury by Q2 2026 (0.25-1% of safety funding)

---

## Solution Architecture

### The Unified ABC Commons Protocol

ABC Commons combines two complementary mechanisms under one token economy:

```
┌─────────────────────────────────────────────────────────────┐
│                  ABC COMMONS PROTOCOL                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MECHANISM 1: RESEARCH CURATION (MERIDIAN)                 │
│  ┌──────────────────────────────────────────────┐          │
│  │ • Stake 50 $ABC to evaluate papers           │          │
│  │ • Predict quality: Breakthrough/Valuable/    │          │
│  │   Incremental/Noise                          │          │
│  │ • Independent predictions converge           │          │
│  │ • Earn 10-20 $ABC for accurate predictions   │          │
│  │ • Build Authority Score (on-chain reputation)│          │
│  └──────────────────────────────────────────────┘          │
│                        ↓                                    │
│              Authority Score Increases                      │
│                        ↓                                    │
│  MECHANISM 2: BOUNTY SYSTEM (BEACON)                       │
│  ┌──────────────────────────────────────────────┐          │
│  │ • Propose bounties (stake 5,000 $ABC)        │          │
│  │ • Community votes (conviction voting)        │          │
│  │ • Claim approved bounties                    │          │
│  │ • Complete work → instant payout (\$500-\$100k)│        │
│  │ • Verifiers validate (earn 1% of bounty)     │          │
│  └──────────────────────────────────────────────┘          │
│                        ↓                                    │
│              Authority Score 2000+ Unlocked                 │
│                        ↓                                    │
│  ASIP GRANT COMMITTEE ELIGIBILITY                          │
│  ┌──────────────────────────────────────────────┐          │
│  │ • Proven track record (verifiable on-chain)  │          │
│  │ • Evaluate \$250k-\$5M grant applications     │          │
│  │ • Inform strategic research priorities       │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Progression Path

```
New Researcher
    ↓
Curate 20 papers → Authority Score 200 (Bronze)
    ↓
Curate 100 papers (70% accuracy) → Authority Score 800 (Silver)
    ↓
Propose first bounty (stake 5K $ABC)
    ↓
Complete 3 bounties → Authority Score 1,500 (Gold)
    ↓
Curate 300 papers + Complete 10 bounties → Authority Score 2,500 (Platinum)
    ↓
ASIP Grant Committee Eligible
    ↓
Apply for \$500k ASIP grant (with verifiable track record)
```

---

## Token Economics

### $ABC Token Specifications

| Parameter | Value |
|-----------|-------|
| **Name** | Aligned Beacon Commons Token |
| **Ticker** | $ABC |
| **Standard** | ERC-20 |
| **Chain** | Base (Ethereum L2) |
| **Total Supply** | 100,000,000 $ABC (fixed, no inflation post-emission) |
| **Initial Circulating** | 5,000,000 $ABC (5% at genesis) |
| **Launch Price** | $0.10 (FDV: $10M) |

### Supply Allocation

| Allocation | % | Amount | Vesting | Purpose |
|------------|---|--------|---------|---------|
| **Commons Treasury** | 50% | 50M $ABC | 5-year emission (see schedule) | Curation rewards (20M) + Bounty payouts (30M) |
| **Liquidity + Early Contributors** | 20% | 20M $ABC | 50% at TGE, 50% 4-year linear | Initial liquidity (10M), advisors (5M), early supporters (5M) |
| **ASI Institute** | 15% | 15M $ABC | 6-month cliff, 24-month linear | Protocol development, operations, team |
| **Institutional Partners** | 10% | 10M $ABC | No lockup | Strategic partnerships (aligned with ASIP GTM) |
| **Public Sale / Genesis** | 5% | 5M $ABC | No lockup | Fair launch participants, immediate circulation |

### Emission Schedule (Commons Treasury)

| Year | Total Emitted | Curation Rewards | Bounty Pool | Papers Supported* | Bounties Supported** |
|------|---------------|------------------|-------------|-------------------|---------------------|
| **Year 1** | 15,000,000 | 5,000,000 | 10,000,000 | ~8,300/month | ~15 bounties/month |
| **Year 2** | 12,000,000 | 4,000,000 | 8,000,000 | ~6,700/month | ~12 bounties/month |
| **Year 3** | 10,000,000 | 3,500,000 | 6,500,000 | ~5,800/month | ~10 bounties/month |
| **Year 4** | 8,000,000 | 3,000,000 | 5,000,000 | ~5,000/month | ~8 bounties/month |
| **Year 5** | 5,000,000 | 2,000,000 | 3,000,000 | ~3,300/month | ~5 bounties/month |
| **Total** | **50,000,000** | **17,500,000** | **32,500,000** | - | - |

*Assumes 10 curators per paper × 60 $ABC rewards = 600 $ABC/paper  
**Assumes average bounty size of $5,000 (50,000 $ABC at $0.10)

**Post-Year 5 Deflationary Mechanics**:
- Wrong curation predictions: 10 $ABC burned per mistake
- Failed bounty proposals: 5,000 $ABC stake burned
- Inactive curator decay: 5% monthly on dormant accounts
- Transaction fees: 0.5% of stakes burned

### Token Utility (Multi-Dimensional)

| Utility | Description | Minimum Required |
|---------|-------------|------------------|
| **Curation Staking** | Stake to evaluate papers, earn rewards for accuracy | 50 $ABC per paper |
| **Bounty Proposal** | Create bounty proposals for community voting | 5,000 $ABC (refunded if approved) |
| **Governance Voting** | Vote on bounties, protocol parameters, treasury allocation | 1 $ABC = 1 vote (conviction-weighted) |
| **Milestone Verification** | Join verifier pool, earn 1% of bounty payouts | 1,000 $ABC staked |
| **Authority Score** | All activities contribute to on-chain reputation | No minimum (earned through activity) |
| **Grant Committee Access** | Eligibility for ASIP Grant Committee appointment | Authority Score >2,000 |

---

## Mechanism 1: Research Curation

### Overview

The curation mechanism (formerly MERIDIAN) enables researchers to earn $ABC by evaluating AI alignment papers they already read, creating convergent quality signals through independent expert judgment.

### How It Works

```
STEP 1: PAPER PUBLISHED
↓
Researcher uploads to arXiv/Alignment Forum
↓
Auto-imported to ABC Commons Hub within 24 hours
↓
Curation window opens (30 days)

STEP 2: INDEPENDENT EVALUATION
↓
Curator sees paper in specialized domain feed
↓
Curator stakes 50 $ABC
↓
Predicts quality tier:
  • Breakthrough (9-10/10): Novel contribution, new research direction
  • Valuable (7-8/10): Solid work, advances field incrementally
  • Incremental (4-6/10): Minor contribution, limited novelty
  • Noise (1-3/10): Flawed, misleading, or insignificant
↓
Writes 100-300 word justification (mandatory)
↓
Submits prediction on-chain (can't see others' predictions)

STEP 3: CONVERGENCE (after 10+ curators or 30 days)
↓
Algorithm calculates weighted consensus:
  Consensus Score = Σ(prediction_i × authority_i) / Σ(authority_i)
↓
Example: 10 curators evaluate
  • 7 predicted "Valuable" (weighted avg Authority: 1,200)
  • 2 predicted "Breakthrough" (weighted avg Authority: 2,500)
  • 1 predicted "Incremental" (Authority: 800)
↓
Weighted calculation → Consensus: "Valuable" (7.4/10)

STEP 4: REWARDS DISTRIBUTED
↓
Curators who predicted "Valuable":
  • Earn 60 $ABC (50 stake + 10 profit = 20% gain)
  • Authority Score +10 points
↓
Early predictors (first 25%):
  • Earn 70 $ABC (2x bonus)
  • Authority Score +20 points
↓
Curators who predicted wrong (2+ tiers off):
  • Lose 10 $ABC (returned 40 $ABC of 50 staked)
  • Authority Score -5 points

STEP 5: LONG-TERM VALIDATION (6-24 months)
↓
Citations accumulate, researcher ratings collected
↓
Retrospective validation adjusts Authority Scores:
  • Early "Breakthrough" predictors of highly-cited papers: +50 bonus
  • Overrated papers: -20 penalty to curators
```

### Curation Economics (Curator Perspective)

**Example: Active Curator (20 papers/month)**

**Assumptions**:
- $ABC price: $0.50
- Accuracy rate: 70% (good performance)
- Early submission rate: 30%

**Monthly Activity**:

| Action | Count | $ABC Staked | Outcome | $ABC Earned | Net $ABC |
|--------|-------|-------------|---------|-------------|----------|
| Correct predictions | 14 | 50 each | Win | 60 each | +140 |
| Correct + Early | 4 | 50 each | Win + Bonus | 70 each | +80 |
| Wrong predictions | 6 | 50 each | Lose | 40 returned | -60 |
| **Total** | **20** | **1,000** | - | - | **+160** |

**Monthly Earnings**: 160 $ABC × $0.50 = **$80 profit**  
**ROI**: 16% monthly return on staked capital  
**Annualized**: ~$960/year for part-time work (5-10 hours/week)

---

## Mechanism 2: Bounty System

### Overview

The bounty mechanism (formerly ABC Protocol) enables anyone to propose, vote on, and complete micro-grants ($500-$100k) for AI alignment research, with instant on-chain payouts upon verification.

### End-to-End Process

```
STEP 1: CONTRIBUTION (Optional)
↓
Donor sends ETH/USDC → Smart Contract
• 50% → $ABC-ETH LP (perpetual liquidity)
• 50% → Treasury (available for bounties)
• Donor receives receipt NFT (on-chain provenance)

STEP 2: PROPOSAL CREATION
↓
Anyone creates bounty proposal
• Title, description, amount (≤$100k), deliverables, deadline
• Requires 5,000 $ABC stake (refunded if passes)
• Proposal published on-chain + indexed in Commons Hub

STEP 3: CONVICTION VOTING (7-day period)
↓
$ABC holders vote weighted by conviction score
• Conviction = tokens × sqrt(days staked)
• Regional cohorts ensure geographic diversity
• Quadratic voting prevents whale dominance
• Proposals need >50% approval + quorum (10% of circulating)

STEP 4: ACTIVE STATE
↓
Winning proposals enter "Active Bounties" registry
• Researcher claims bounty (on-chain registration)
• Funds escrowed in smart contract
• Deadline countdown visible on dashboard

STEP 5: SUBMISSION & VERIFICATION
↓
Researcher submits deliverables
• Upload to IPFS (PDF, code, datasets)
• Metadata logged on-chain (hash, timestamp)
• Independent verifier pool (3-5 staked $ABC holders)
• 72-hour review period
• Majority approval required

STEP 6: INSTANT PAYOUT
↓
Smart contract releases funds to researcher
• USDC/ETH sent to researcher wallet (instant)
• Verifiers earn 1% of bounty as reward
• PDF + metadata indexed in Commons Hub
• NFT achievement badge minted to researcher
• Authority Score updated based on bounty quality
```

### Bounty Economics

**Example Bounty: "Adversarial Robustness Benchmark"**

| Parameter | Value |
|-----------|-------|
| Bounty Amount | $10,000 (100,000 $ABC at $0.10) |
| Proposer Stake | 5,000 $ABC (refunded after approval) |
| Voting Period | 7 days |
| Votes Cast | 1,200,000 $ABC (12% of circulating) |
| Approval Rate | 73% (passed) |
| Claimed By | Researcher with Authority Score 1,200 |
| Deliverables | GitHub repo + 20-page paper + test suite |
| Verification | 5 verifiers, 4/5 approved (80%) |
| Verifier Rewards | 100 $ABC each (1% of bounty split) |
| Researcher Payout | 100,000 $ABC ($10,000) |
| Authority Score Gain | +150 points (bounty completion + quality rating) |

---

## Authority Score System

### Purpose

Authority Score is an **on-chain, verifiable, objective measure of research contribution expertise**. It serves four functions:

1. **Professional Credential**: "ABC Commons Authority Score: 2,340 (Top 5%)" on CV
2. **Weighted Voting**: Higher Authority = more influence in consensus calculations
3. **Feature Unlocking**: Authority thresholds unlock bounty proposals, claims, verification
4. **Grant Committee Pipeline**: Authority >2,500 = eligible for ASIP Grant Committee

### Calculation Algorithm

**Base Formula**:
```
Authority Score = Σ (Activity Points × Conviction Multiplier × Recency Factor × Quality Bonus)
```

#### Component Breakdown

**1. Activity Points (Base)**

| Activity | Points | Rationale |
|----------|--------|-----------|
| **Correct curation** (matched consensus) | +10 | Accurate judgment |
| **Partial credit** (one tier off) | +5 | Close but not perfect |
| **Wrong curation** (two+ tiers off) | -5 | Penalize poor judgment |
| **Contrarian correct** (minority→majority over time) | +30 | Reward foresight |
| **Bounty completed** (verified) | +100 | Significant contribution |
| **Bounty highly rated** (4+ stars by community) | +50 | Quality bonus |
| **Bounty failed** (rejected by verifiers) | -50 | Penalize poor work |

**2. Conviction Multiplier (Timing Bonus)**

| Timing | Multiplier | Rationale |
|--------|------------|-----------|
| **Early bird** (first 25% of curators/claimers) | 2x | Reward initiative + confidence |
| **Middle** (25-75%) | 1x | Standard |
| **Late** (last 25%) | 0.75x | Slight penalty for bandwagoning |

**3. Recency Factor (Decay)**

```
Recency Factor = 0.95 ^ (months since activity)

Example:
- Activity 1 month ago: 0.95^1 = 0.95
- Activity 6 months ago: 0.95^6 = 0.74
- Activity 12 months ago: 0.95^12 = 0.54
```

**Why decay?** Keeps curators active; dormant accounts lose Authority over time.

**4. Quality Bonus (Domain Specialization)**

```
If curator has 70%+ of activities in one domain:
  Quality Bonus = 1.5x

If curator spread across multiple domains:
  Quality Bonus = 1.0x
```

**Why specialization?** Rewards deep expertise over generalist spam.

### Example Calculation

**Curator Profile: Dr. Sarah Chen**

**Activity over 6 months**:
- 100 correct curations (matched consensus)
- 20 early correct curations (first 25%)
- 5 contrarian correct (minority→majority)
- 30 wrong curations
- 3 bounties completed (all verified, avg 4.2 stars)
- 85% of activities in "Mechanistic Interpretability" domain

**Calculation**:

```
Base Activity Points:
  100 correct × 10 = 1,000
  20 early correct × 10 × 2 = 400
  5 contrarian correct × 30 = 150
  30 wrong × -5 = -150
  3 bounties × 100 = 300
  3 bounties (high quality) × 50 = 150
  Total Base = 1,850

Domain Specialization:
  85% in one domain → 1.5x multiplier
  1,850 × 1.5 = 2,775

Recency Decay (avg 3 months old):
  0.95^3 = 0.857
  2,775 × 0.857 = 2,378

Final Authority Score: 2,378 (Platinum Tier)
```

### Authority Tiers & Benefits

| Tier | Score Range | % of Users | Badge | Benefits |
|------|-------------|------------|-------|----------|
| **Bronze** | 100-500 | 40% | 🥉 | • Basic curation<br>• View bounties<br>• Standard rewards |
| **Silver** | 500-1,000 | 30% | 🥈 | • Propose bounties (with stake)<br>• Listed on leaderboard<br>• Enhanced grant applications |
| **Gold** | 1,000-2,000 | 20% | 🥇 | • Claim bounties<br>• Curator spotlight features<br>• Consulting opportunities |
| **Platinum** | 2,000-3,000 | 8% | 💎 | • **ASIP Grant Committee eligible**<br>• Join verifier pool<br>• Protocol governance voting |
| **Diamond** | 3,000+ | 2% | 💠 | • **Auto Grant Committee consideration**<br>• Thought leader status<br>• Premium protocol features |

### Authority Score Transparency

**All data publicly queryable**:
- Dune Analytics dashboard: "Top 100 Contributors by Authority"
- Individual pages: "View all curations, bounties, accuracy rate, domain focus"
- Historical charts: "Authority Score over time"
- Comparison tools: "Compare contributor A vs B performance"

**No gaming possible**:
- All predictions/submissions on-chain (immutable)
- Consensus calculated algorithmically (no human discretion)
- Decay prevents dormant farming
- Quality bonus requires sustained focus

---

## ASIP Integration

ABC Commons informs ASIP grant decisions through three main mechanisms, providing objective, verifiable data to enhance institutional grant allocation.

### Integration Point 1: Enhanced Grant Applications

Researchers applying for ASIP grants ($250k-$5M) can include their ABC Commons Authority Score as a verifiable credential.

**Traditional Grant Application**:
- Publications and citations
- Letters of recommendation
- Previous grants and awards

**ABC Commons-Enhanced Application**:
- All traditional credentials (above)
- **Authority Score: 2,378 (Platinum Tier, Top 8% globally)**
- Papers Curated: 156 with 71% accuracy rate
- Bounties Completed: 3 (avg 4.2/5 stars)
- Domain Specialization: Mechanistic Interpretability (85% focus)
- Verifiable on-chain: `commons.asi2.org/curator/0x...`

**Not automatic approval**, but signals:
- Active in field (not just publishing, also contributing)
- Good research judgment (71% curation accuracy)
- Proven execution (3 bounties completed)
- Alignment with mission (public good contribution)

### Integration Point 2: Grant Committee Recruitment

ASIP Board uses ABC Commons to identify and appoint qualified experts to the Grant Committee. Per ASIP Governance, committee members must have a "proven track record in research evaluation"—ABC Commons provides objective, on-chain proof.

**Traditional Recruitment** (Opaque):
- Board member knows someone
- Reputation-based selection
- Hard to verify "evaluation expertise"
- Small pool of candidates

**ABC Commons-Enabled Recruitment** (Transparent):
- **Query**: Find curators with Authority >2,000 in "Agent Foundations" domain
- **Results**: 12 qualified candidates with verifiable track records
- **Review**: On-chain data shows 74% accuracy, 312 papers curated, 8 bounties completed, 24 months active
- **Interview**: Focus on fit and availability, not verification

**API Endpoint for Board Access**:

```
GET /api/asip/top-curators

Query Parameters:
  ?domain=agent-foundations
  &minAuthority=2000
  &minAccuracy=70
  &minActivity=100

Response:
[
  {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "authority_score": 2847,
    "accuracy_rate": 0.74,
    "papers_curated": 312,
    "bounties_completed": 8,
    "domain_focus": "agent-foundations",
    "months_active": 24,
    "profile_url": "commons.asi2.org/curator/0x742d..."
  },
  // ... 11 more candidates
]
```

### Integration Point 3: Strategic Research Prioritization

ASIP Board conducts annual strategic planning to define Key Performance Indicators (KPIs) and priorities for grant funding (50M SAIT AI Fund). ABC Commons provides objective field-level quality signals to inform these decisions.

**Example Use Case: Q2 2026 Strategic Planning**

Board Question: *"Where should we focus $10M in grants this quarter?"*

**ABC Commons Data Analysis (6-month window)**:

| Domain | Papers Curated | Avg Quality Score | Bounties Funded | Strategic Insight |
|--------|----------------|-------------------|-----------------|-------------------|
| Mechanistic Interp. | 1,080 | 6.8/10 | 45 | Crowded, declining quality |
| **Agent Foundations** | **72** | **7.9/10** | **3** | **Neglected, high quality ✓** |
| Governance & Policy | 270 | 5.2/10 | 12 | Low quality, moderate interest |
| Scalable Oversight | 402 | 7.1/10 | 28 | Healthy, growing |
| Adversarial Robustness | 156 | 6.5/10 | 18 | Moderate quality, stable |

**Board Decision**: Allocate 30% of grants to Agent Foundations (vs. 10% previous quarter) based on ABC Commons signal showing neglected but high-quality research area.

**Dune Analytics Query** (available to ASIP Board):

```sql
-- Domain Quality Trends (6-month window)

SELECT 
  domain,
  COUNT(DISTINCT paper_id) AS papers_curated,
  AVG(consensus_score) AS avg_quality,
  COUNT(DISTINCT bounty_id) AS bounties_funded,
  SUM(bounty_amount_usd) AS total_bounty_funding
FROM abc_commons.curations
WHERE timestamp >= NOW() - INTERVAL '6 months'
GROUP BY domain
ORDER BY avg_quality DESC;
```

---

## Technical Architecture

### Smart Contract Stack

Three core contracts form the foundation of ABC Commons, designed for Base mainnet (EVM-compatible).

#### Contract 1: ABCToken.sol (ERC-20)

Standard ERC-20 implementation with fixed supply and governance extensions.

| Feature | Implementation |
|---------|----------------|
| Standard | OpenZeppelin ERC-20 + ERC20Votes (governance) |
| Supply | 100,000,000 $ABC (fixed at deployment) |
| Functions | `transfer()`, `approve()`, `transferFrom()`, `delegate()` |
| Security | ReentrancyGuard, Pausable (emergency circuit breaker) |

**Key Functions**:
```solidity
contract ABCToken is ERC20, ERC20Votes, Ownable {
    constructor() ERC20("Aligned Beacon Commons", "ABC") ERC20Permit("ABC") {
        _mint(msg.sender, 100_000_000 * 10**18);
    }
    
    // Governance delegation
    function delegate(address delegatee) public override {
        _delegate(_msgSender(), delegatee);
    }
    
    // Emergency pause (only owner)
    function pause() external onlyOwner {
        _pause();
    }
}
```

#### Contract 2: CommonsCore.sol (Unified Staking + Governance)

Manages both curation and bounty mechanisms under one contract.

| Function | Description | Gas Estimate (Base) |
|----------|-------------|---------------------|
| **curatePaper()** | Stake 50 $ABC + submit quality prediction | ~150k gas (~$0.03) |
| **calculateConsensus()** | Weighted average by Authority Score → Commons Score | ~200k gas (~$0.04) |
| **distributeCurationRewards()** | Winners: +20% profit, Losers: -20% penalty | ~180k gas (~$0.035) |
| **proposeBounty()** | Create bounty proposal (stake 5K $ABC) | ~160k gas (~$0.032) |
| **voteOnBounty()** | Conviction-weighted voting | ~120k gas (~$0.024) |
| **claimBounty()** | Researcher claims active bounty | ~100k gas (~$0.02) |
| **submitWork()** | Upload IPFS hash + request verification | ~130k gas (~$0.026) |
| **verifySubmission()** | Verifier approves/rejects work | ~140k gas (~$0.028) |
| **releaseBounty()** | Instant payout to researcher | ~110k gas (~$0.022) |

**Key Data Structures**:
```solidity
contract CommonsCore {
    // Curation mechanism
    struct Prediction {
        address curator;
        uint8 tier;  // 0=Noise, 1=Incremental, 2=Valuable, 3=Breakthrough
        uint256 stake;
        uint256 timestamp;
        bool claimed;
    }
    
    struct Consensus {
        uint256 score;  // 0-100 (divide by 10 for 0-10 scale)
        uint8 tier;
        uint256 curatorCount;
        uint256 confidence;  // 0-100 (based on std deviation)
    }
    
    mapping(uint256 => Prediction[]) public paperPredictions;
    mapping(uint256 => Consensus) public paperConsensus;
    
    // Bounty mechanism
    struct Bounty {
        uint256 id;
        address proposer;
        string ipfsHash;  // Full proposal on IPFS
        uint256 amount;
        uint256 deadline;
        BountyState state;
        address claimedBy;
    }
    
    struct Vote {
        bool support;
        uint256 weight;  // Conviction-weighted
        uint256 timestamp;
    }
    
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => mapping(address => Vote)) public bountyVotes;
    
    // Core functions
    function curatePaper(uint256 paperID, uint8 tier, string memory justification) external;
    function calculateConsensus(uint256 paperID) external;
    function distributeCurationRewards(uint256 paperID) external;
    
    function proposeBounty(string memory ipfsHash, uint256 amount) external;
    function voteOnBounty(uint256 bountyID, bool support) external;
    function claimBounty(uint256 bountyID) external;
    function submitWork(uint256 bountyID, string memory ipfsHash) external;
    function verifySubmission(uint256 submissionID, bool approve) external;
}
```

#### Contract 3: AuthorityScore.sol (Reputation System)

On-chain reputation tracking based on curation accuracy and bounty completion quality.

| Function | Description | Gas Estimate (Base) |
|----------|-------------|---------------------|
| **updateScore()** | Called by CommonsCore after curation/bounty | ~80k gas (~$0.016) |
| **getScore()** | Query Authority Score for address | ~30k gas (~$0.006) |
| **getCuratorStats()** | Detailed stats (predictions, accuracy, domain) | ~50k gas (~$0.01) |
| **applyDecay()** | Monthly decay (5%) for inactive accounts | ~60k gas (~$0.012) |

**Key Functions**:
```solidity
contract AuthorityScore {
    struct CuratorStats {
        uint256 authorityScore;
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 totalBounties;
        uint256 successfulBounties;
        string primaryDomain;
        uint256 lastActivityTimestamp;
    }
    
    mapping(address => CuratorStats) public curatorStats;
    
    function updateScore(
        address curator,
        bool correct,
        bool early,
        uint8 deviation,
        string memory domain
    ) external onlyCommonsCore {
        // Calculate points based on accuracy
        int256 points = correct ? int256(10) : (deviation == 1 ? int256(5) : int256(-5));
        
        // Apply conviction multiplier
        if (early) points *= 2;
        
        // Apply recency decay to existing score
        uint256 monthsSinceActivity = (block.timestamp - curatorStats[curator].lastActivityTimestamp) / 30 days;
        uint256 decayedScore = curatorStats[curator].authorityScore * (95 ** monthsSinceActivity) / (100 ** monthsSinceActivity);
        
        // Add new points
        curatorStats[curator].authorityScore = uint256(int256(decayedScore) + points);
        curatorStats[curator].lastActivityTimestamp = block.timestamp;
        
        // Update stats
        curatorStats[curator].totalPredictions++;
        if (correct) curatorStats[curator].correctPredictions++;
        
        emit ScoreUpdated(curator, curatorStats[curator].authorityScore);
    }
    
    function getScore(address curator) external view returns (uint256) {
        return curatorStats[curator].authorityScore;
    }
    
    function getCuratorStats(address curator) external view returns (CuratorStats memory) {
        return curatorStats[curator];
    }
}
```

### Infrastructure Stack

```yaml
# ABC Commons Infrastructure

Blockchain:
  Layer: Base (Ethereum L2)
  RPC: Alchemy Base endpoints
  Indexer: The Graph (Base subgraph)
  Block Explorer: Basescan

Storage:
  Proposals: IPFS (via Pinata)
  Research outputs: IPFS + Arweave (permanent)
  Justifications: IPFS (off-chain, referenced on-chain)
  Metadata: On-chain events

Frontend:
  Framework: Next.js 14 (App Router)
  Wallet: RainbowKit + Wagmi v2
  State: Zustand + React Query
  UI: Tailwind + shadcn/ui
  Deployment: Vercel (commons.asi2.org)

Backend:
  API: Flask (Python) - existing ARA backend
  Database: PostgreSQL (off-chain metadata)
  Contract Integration: web3.py
  Caching: Redis

Analytics:
  On-chain: Dune Analytics (6 killer queries)
  Application: Mixpanel
  Error tracking: Sentry
  Monitoring: Tenderly

APIs:
  Price feeds: Coinbase API
  Notifications: Push Protocol
  Paper indexing: arXiv API, Alignment Forum API
  Metadata: OpenGraph for research papers
```

### Data Flow Architecture

| Data Type | Storage Location | Rationale |
|-----------|------------------|-----------|
| **Paper Metadata** | PostgreSQL (off-chain) | Too large/mutable for blockchain |
| **Curator Predictions** | On-Chain (CommonsCore) | Immutable, verifiable |
| **Commons Scores** | On-Chain (CommonsCore) | Consensus must be verifiable |
| **Authority Scores** | On-Chain (AuthorityScore) | Reputation must be provable |
| **Justifications** (100-300 words) | IPFS (hash on-chain) | Too expensive for on-chain storage |
| **Bounty Proposals** | IPFS (hash on-chain) | Detailed specs too large |
| **Research Outputs** | IPFS + Arweave | Permanent, censorship-resistant |
| **Vote Records** | On-Chain (CommonsCore) | Governance transparency |

---

## Launch Roadmap

### Phase 0: Foundation (Dec 8-20, 2025)

**Objective**: Finalize unified smart contracts, audit scope, Genesis $ABC allocation

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Smart contract development | • ABCToken.sol complete<br>• CommonsCore.sol complete<br>• AuthorityScore.sol complete | Contracts pass internal security review |
| Unit testing | • 80%+ test coverage<br>• Edge cases documented | All tests passing on Hardhat |
| Audit engagement | • Audit firm selected<br>• Scope defined<br>• Timeline confirmed | Contract signed with auditor |
| Genesis allocation | • Allocation spreadsheet<br>• Multi-sig setup<br>• Vesting contracts deployed | Treasury multi-sig operational |

### Phase 1: Testnet Deployment (Dec 21 - Jan 10, 2026)

**Objective**: Deploy to Sepolia testnet, integrate with ARA frontend, test end-to-end flows

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Sepolia deployment | • 3 contracts deployed<br>• Verified on Sepolia Etherscan<br>• Test $ABC distributed | Contracts live and queryable |
| ARA integration | • Web3 wallet connection<br>• Curation submission UI<br>• Bounty proposal UI<br>• Dashboard (Authority Score) | Users can curate + propose bounties |
| Test data seeding | • 50 test papers indexed<br>• 10 test bounties created<br>• 5 test curators active | E2E flows functional |
| E2E testing | • 20+ curation cycles<br>• 5+ bounty cycles<br>• Bug fixes documented | 90%+ success rate |

### Phase 2: Audit & Mainnet Prep (Jan 11 - Feb 7, 2026)

**Objective**: Complete security audit, deploy to Base mainnet, prepare Genesis event

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Security audit | • Audit report received<br>• Critical issues fixed<br>• Re-audit if needed | Zero critical vulnerabilities |
| Base mainnet deployment | • 3 contracts deployed to Base<br>• Verified on Basescan<br>• Multi-sig ownership transferred | Contracts operational on Base |
| Liquidity preparation | • $ABC-ETH LP contracts deployed<br>• Initial liquidity ($500k) secured<br>• DEX integration (Aerodrome/Alien Base) | LP live with $500k+ TVL |
| Genesis preparation | • Public sale mechanics finalized<br>• 5M $ABC allocation confirmed<br>• Marketing campaign launched | 500+ waitlist signups |

### Phase 3: Genesis Launch (Feb 15, 2026)

**Objective**: Genesis $ABC distribution, liquidity launch, first curations and bounties

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Genesis event | • 5M $ABC public sale<br>• 10M $ABC LP deployment<br>• Governance portal live | $1M+ raised, 500+ $ABC holders |
| First curations | • 50 papers available for curation<br>• 20+ curators onboarded<br>• First consensus calculated | 10+ papers curated with consensus |
| First bounties | • 10 curated bounties live<br>• Voting tutorials published<br>• Discord support active | 5+ bounties receive votes |
| Dune dashboard | • 6 killer queries live<br>• Real-time metrics<br>• Public transparency | Dashboard live, 100+ views |

### Phase 4: Public Launch (Mar 1, 2026)

**Objective**: Open proposal creation, scale curation, grow treasury

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Open bounty creation | • Anyone with 5K $ABC can propose<br>• First unsolicited proposals<br>• KPI tracking dashboard | 20+ proposals submitted |
| Curation scaling | • 100+ papers curated<br>• 50+ active curators<br>• Authority Score leaderboard | 30+ papers with consensus |
| Treasury growth | • $2M treasury milestone<br>• 50+ unique contributors<br>• 10+ countries represented | $2M TVL achieved |
| ASIP integration | • Grant application template updated<br>• Grant Committee API live<br>• First strategic query run | ASIP Board using ABC data |

### Phase 5: Scale (Mar - Jun 2026)

**Objective**: Grow to $5M+ treasury, 100+ funded researchers, 20+ countries

| Milestone | Deliverables | Success Criteria |
|-----------|--------------|------------------|
| Treasury milestone | • $5M treasury<br>• 1,000+ $ABC holders<br>• $2M+ in bounties paid | Q2 2026 target achieved |
| Geographic diversity | • 20+ countries represented<br>• Regional cohort voting active<br>• Non-US majority | Global distribution verified |
| Researcher payouts | • 100+ unique researchers paid<br>• 500+ papers curated<br>• 50+ bounties completed | Ecosystem thriving |
| ASIP synergy | • 5+ Grant Committee members from ABC<br>• 10+ grant applications with Authority Scores<br>• Strategic planning using ABC data | Integration validated |

---

## Success Metrics

### North Star Metrics (12-Month Targets)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Treasury Size** | $5M+ | On-chain balance (Dune Analytics) |
| **Active Curators** | 250+ | Unique addresses with 5+ curations in last 30 days |
| **Papers Curated** | 2,000+ | Total papers with consensus score |
| **Bounties Completed** | 100+ | Total verified bounty payouts |
| **Researchers Paid** | 150+ | Unique addresses receiving curation or bounty rewards |
| **Geographic Diversity** | 20+ countries | Based on researcher profiles (optional disclosure) |
| **Authority Score Distribution** | 50+ Platinum tier (>2,000) | On-chain query |
| **ASIP Integration** | 10+ Grant Committee from ABC | ASIP Board appointments |

### Operational Metrics (Monthly Tracking)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Papers curated per month | 150+ | New consensus scores |
| Curation accuracy rate | 70%+ | Avg % of curators matching consensus |
| Bounties proposed per month | 20+ | New proposals submitted |
| Bounty approval rate | 40%+ | % of proposals passing vote |
| Bounty completion rate | 75%+ | % of claimed bounties verified |
| New curators onboarded | 30+ | First-time curators |
| $ABC price stability | <20% volatility | 30-day rolling std deviation |
| Treasury growth rate | 15%+ monthly | Month-over-month TVL increase |

### Quality Metrics (Quarterly Review)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Consensus confidence | 70%+ avg | Low std deviation in predictions |
| Bounty quality rating | 4.0+ stars | Community ratings of completed work |
| Citation validation | 60%+ accuracy | Retrospective validation of "Breakthrough" predictions |
| Authority Score Gini coefficient | <0.6 | Measure of reputation concentration (lower = more distributed) |
| Geographic Herfindahl index | <0.3 | Measure of country concentration (lower = more diverse) |

### ASIP Integration Metrics (Annual Review)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Grant applications with Authority Scores | 30%+ | % of ASIP applicants with ABC profile |
| Grant Committee from ABC Commons | 40%+ | % of committee members with Authority >2,000 |
| Strategic decisions informed by ABC data | 5+ per year | Board meeting minutes referencing ABC queries |
| Cross-protocol researcher flow | 20+ per year | Researchers who curated/bounties → ASIP grants |

---

## Appendix A: Comparison to Separate Protocols

### Side-by-Side Analysis

| Dimension | Separate (ABC + MRD) | Unified (ABC Commons) |
|-----------|---------------------|----------------------|
| **Tokens** | 2 tokens (ABC, MRD) | 1 token ($ABC) |
| **Total Supply** | 100M ABC + 50M MRD | 100M $ABC |
| **FDV at Launch** | $10M + $5M = $15M (split) | $10M (concentrated) |
| **Liquidity Pools** | 2 pools (thin liquidity) | 1 pool (deep liquidity) |
| **User Onboarding** | "Which token do I need?" | "Get $ABC to participate" |
| **Governance** | 2 separate governance systems | 1 unified governance |
| **Development** | 6 smart contracts | 3 smart contracts |
| **Audit Cost** | ~$150k (2 protocols) | ~$80k (1 protocol) |
| **Narrative** | "We have two tokens that..." | "ABC is the public commons for AI alignment" |
| **Network Effects** | Split communities | Single, stronger community |
| **Authority Score** | MRD only (curation) | Unified (curation + bounties) |
| **ASIP Integration** | Fragmented signals | Holistic reputation |

### What We Keep from Both Protocols

**From ABC Protocol (Bounty System)**:
- ✅ Micro-grants ($500-$100k)
- ✅ Conviction voting mechanism
- ✅ Instant on-chain payouts
- ✅ Verifier pool (1% rewards)
- ✅ Treasury contribution flow (50% LP, 50% bounties)
- ✅ Regional cohort representation

**From MERIDIAN Protocol (Curation System)**:
- ✅ Research curation staking (50 $ABC)
- ✅ Quality tier predictions (Breakthrough/Valuable/Incremental/Noise)
- ✅ Convergence algorithm (weighted by Authority)
- ✅ Authority Score calculation (accuracy + conviction + recency + domain)
- ✅ Long-term validation (6-24 month retrospective)
- ✅ Curator economics (10-20% ROI)

**What We Merge**:
- ✅ Single token ($ABC) for all activities
- ✅ Unified Authority Score (curation + bounties)
- ✅ Single governance system
- ✅ One frontend (ABC Commons Hub)
- ✅ One Dune dashboard
- ✅ One community

---

## Appendix B: Risk Analysis & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Smart contract exploit** | Low | Critical | • Professional audit (Consensys/Trail of Bits)<br>• Bug bounty program<br>• Emergency pause function<br>• Multi-sig treasury control |
| **Oracle manipulation** (price feeds) | Medium | High | • Use Chainlink oracles<br>• Multiple price sources<br>• Time-weighted average price (TWAP) |
| **Sybil attacks** (fake curators) | Medium | Medium | • Stake requirement (50 $ABC)<br>• Authority Score decay<br>• Conviction voting (time-locked) |
| **Consensus gaming** (coordinated voting) | Low | Medium | • Independent prediction submission<br>• Quadratic voting<br>• Regional cohort weighting |

### Economic Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Token price crash** | Medium | High | • Deflationary mechanics (burns)<br>• Utility-first design (not speculation)<br>• Vesting schedules (prevent dumps) |
| **Liquidity crisis** | Low | High | • $500k initial liquidity<br>• 50% of contributions → LP<br>• Protocol-owned liquidity |
| **Treasury depletion** | Low | Critical | • 5-year emission schedule<br>• Conservative bounty caps<br>• Treasury diversification (ETH/USDC) |
| **Low participation** | Medium | High | • Competitive rewards (10-20% ROI)<br>• Marketing campaign<br>• ASIP partnership (built-in demand) |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Low-quality curations** | Medium | Medium | • Justification requirement (100-300 words)<br>• Penalty for wrong predictions (-20%)<br>• Authority Score decay |
| **Bounty verification disputes** | Medium | Medium | • 3-5 verifier pool (majority vote)<br>• Slashing for bad faith verifiers<br>• Dispute resolution process |
| **Regulatory scrutiny** | Low | High | • Utility token design (not security)<br>• Legal opinion obtained<br>• Geographic restrictions if needed |
| **ASIP integration failure** | Low | High | • Early coordination with ASIP Board<br>• API testing before launch<br>• Fallback: ABC operates independently |

---

## Appendix C: Dune Analytics Queries

### Query 1: Total Treasury Value

**Purpose**: Real-time treasury health and asset composition

```sql
-- Total Treasury Value (USD & $ABC)

WITH treasury_balance AS (
    SELECT 
        SUM(CASE WHEN token = 'ETH' THEN amount * eth_price ELSE 0 END) AS eth_usd,
        SUM(CASE WHEN token = 'USDC' THEN amount ELSE 0 END) AS usdc_usd,
        SUM(CASE WHEN token = 'ABC' THEN amount * abc_price ELSE 0 END) AS abc_usd
    FROM base.erc20_transfers
    WHERE to_address = '0xABCTreasuryAddress'
),
treasury_metrics AS (
    SELECT 
        eth_usd + usdc_usd + abc_usd AS total_usd,
        (abc_usd / (eth_usd + usdc_usd + abc_usd)) * 100 AS abc_percentage,
        COUNT(DISTINCT from_address) AS unique_contributors
    FROM treasury_balance
)
SELECT * FROM treasury_metrics;
```

**Visualization**: Multi-metric card
- Total Treasury: $5.2M (target by Q2 2026)
- Asset breakdown: Pie chart (ETH 40%, USDC 45%, $ABC 15%)
- Growth chart: 7-day/30-day treasury growth rate

### Query 2: Cumulative $ Paid to Researchers (by Country)

**Purpose**: Geographic diversity and researcher reach

```sql
-- Researcher Payouts by Country

WITH researcher_payouts AS (
    SELECT 
        researcher_address,
        SUM(payout_amount_usd) AS total_received,
        COUNT(DISTINCT CASE WHEN payout_type = 'curation' THEN paper_id END) AS papers_curated,
        COUNT(DISTINCT CASE WHEN payout_type = 'bounty' THEN bounty_id END) AS bounties_completed,
        MAX(payout_timestamp) AS last_payout
    FROM abc_commons.payouts
    GROUP BY researcher_address
),
researcher_locations AS (
    SELECT 
        rp.researcher_address,
        rl.country_code,
        rl.country_name,
        rp.total_received,
        rp.papers_curated,
        rp.bounties_completed
    FROM researcher_payouts rp
    LEFT JOIN abc_commons.researcher_profiles rl 
        ON rp.researcher_address = rl.wallet_address
)
SELECT 
    country_name,
    COUNT(DISTINCT researcher_address) AS researcher_count,
    SUM(total_received) AS total_paid_usd,
    AVG(total_received) AS avg_per_researcher,
    SUM(papers_curated) AS total_papers,
    SUM(bounties_completed) AS total_bounties
FROM researcher_locations
WHERE country_name IS NOT NULL
GROUP BY country_name
ORDER BY total_paid_usd DESC;
```

**Visualization**: Interactive world map
- Choropleth by total paid (darker = more funding)
- Hover: Country details (researcher count, avg payout, papers vs bounties)
- Goal: 20+ countries by Q2 2026

### Query 3: Active vs Completed Bounties (Success Rate %)

**Purpose**: Operational health and completion velocity

```sql
-- Bounty Pipeline & Success Metrics

WITH bounty_states AS (
    SELECT 
        bounty_id,
        proposal_title,
        proposal_amount_usd,
        state, -- 'Voting', 'Active', 'Completed', 'Expired', 'Disputed'
        created_at,
        claimed_at,
        completed_at,
        deadline
    FROM abc_commons.bounties
),
state_summary AS (
    SELECT 
        state,
        COUNT(*) AS count,
        SUM(proposal_amount_usd) AS total_value_usd
    FROM bounty_states
    GROUP BY state
),
completion_metrics AS (
    SELECT 
        COUNT(*) FILTER (WHERE state = 'Completed') AS completed,
        COUNT(*) FILTER (WHERE state = 'Active') AS active,
        COUNT(*) FILTER (WHERE state = 'Expired') AS expired,
        (COUNT(*) FILTER (WHERE state = 'Completed')::FLOAT / 
         NULLIF(COUNT(*) FILTER (WHERE state IN ('Completed', 'Expired')), 0)) * 100 AS success_rate,
        AVG(EXTRACT(EPOCH FROM (completed_at - claimed_at)) / 86400) FILTER (WHERE state = 'Completed') AS avg_completion_days
    FROM bounty_states
)
SELECT * FROM completion_metrics;
```

**Visualization**: Funnel chart + KPI cards
- Proposals submitted → Voted approved → Claimed → Completed
- Success rate: 75%+ target
- Avg completion time: 30 days target
- Active bounties: 10-20 healthy range

### Query 4: Top 20 Contributors by Authority Score

**Purpose**: Leaderboard and whale/academic distribution

```sql
-- Top Contributors by Authority Score

WITH contributor_activity AS (
    SELECT 
        address,
        authority_score,
        total_predictions,
        correct_predictions,
        total_bounties,
        successful_bounties,
        primary_domain
    FROM abc_commons.authority_scores
),
contributor_profiles AS (
    SELECT 
        ca.address,
        ca.authority_score,
        ca.total_predictions,
        ca.correct_predictions,
        ca.total_bounties,
        ca.successful_bounties,
        ca.primary_domain,
        cp.profile_type, -- 'Institutional', 'Academic', 'Individual', 'Anonymous'
        cp.institution_name,
        ab.balance AS current_abc_balance
    FROM contributor_activity ca
    LEFT JOIN abc_commons.profiles cp ON ca.address = cp.wallet_address
    LEFT JOIN abc_commons.token_balances ab ON ca.address = ab.address
)
SELECT 
    address,
    authority_score,
    profile_type,
    institution_name,
    total_predictions,
    total_bounties,
    current_abc_balance,
    (current_abc_balance / 100000000.0) * 100 AS pct_of_supply,
    primary_domain
FROM contributor_profiles
ORDER BY authority_score DESC
LIMIT 20;
```

**Visualization**: Ranked table with profile badges
- Rank | Address | Authority | Type | Institution | Predictions | Bounties | $ABC Balance
- Color coding: Blue (institutional), Green (academic), Grey (individual)
- Concentration metric: % of Authority from top 10 (target: <30%)

### Query 5: Curation Accuracy Over Time

**Purpose**: System health and curator calibration

```sql
-- Curation Accuracy Trends

WITH monthly_accuracy AS (
    SELECT 
        DATE_TRUNC('month', timestamp) AS month,
        COUNT(*) AS total_predictions,
        COUNT(*) FILTER (WHERE matched_consensus = TRUE) AS correct_predictions,
        (COUNT(*) FILTER (WHERE matched_consensus = TRUE)::FLOAT / COUNT(*)) * 100 AS accuracy_rate,
        AVG(consensus_confidence) AS avg_confidence
    FROM abc_commons.predictions
    WHERE consensus_calculated = TRUE
    GROUP BY month
)
SELECT 
    month,
    total_predictions,
    accuracy_rate,
    avg_confidence
FROM monthly_accuracy
ORDER BY month DESC;
```

**Visualization**: Line chart
- X-axis: Month
- Y-axis: Accuracy rate (%)
- Secondary Y-axis: Avg confidence
- Target: 70%+ accuracy, 75%+ confidence

### Query 6: Papers Curated This Month (Live Gallery)

**Purpose**: Research output showcase and public accountability

```sql
-- Recent Research Outputs

WITH recent_consensus AS (
    SELECT 
        p.paper_id,
        p.title,
        p.authors,
        p.arxiv_id,
        p.domain,
        c.consensus_score,
        c.consensus_tier,
        c.curator_count,
        c.confidence,
        c.calculated_at
    FROM abc_commons.papers p
    JOIN abc_commons.consensus c ON p.paper_id = c.paper_id
    WHERE c.calculated_at >= DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    paper_id,
    title,
    authors,
    arxiv_id,
    domain,
    consensus_score,
    consensus_tier,
    curator_count,
    confidence
FROM recent_consensus
ORDER BY consensus_score DESC
LIMIT 50;
```

**Visualization**: Card gallery
- Each card: Paper title, authors, MERIDIAN score, tier badge, curator count
- Filter by domain, sort by score/date
- Click to view full paper + justifications

---

## Appendix D: FAQ

### For Researchers

**Q: Do I need to buy $ABC to participate?**  
A: To curate papers or propose bounties, yes (50 $ABC for curation, 5,000 $ABC for proposals). However, you can claim and complete bounties without holding $ABC—you'll be paid in USDC/ETH.

**Q: How much can I earn?**  
A: Curation: $50-$500/month for part-time work (5-10 hours/week). Bounties: $500-$100k depending on bounty size. Authority Score also enhances grant applications.

**Q: Is this a security token?**  
A: No. $ABC is a utility token for governance and staking. It does not represent equity, dividends, or profit-sharing. Consult your own legal advisor.

**Q: What if I disagree with the consensus?**  
A: Contrarian predictions that prove correct over time (via long-term validation) earn bonus Authority Score (+30 points). The system rewards foresight.

### For ASIP Board

**Q: How does ABC Commons inform grant decisions?**  
A: Three ways: (1) Grant applicants can include Authority Scores as credentials, (2) Grant Committee recruitment from top curators (Authority >2,000), (3) Strategic planning using field-level quality signals from Dune Analytics.

**Q: Can we trust on-chain Authority Scores?**  
A: Yes. All predictions are immutable on-chain, consensus is calculated algorithmically, and historical accuracy is verifiable. No human can manipulate scores retroactively.

**Q: What if ABC Commons fails?**  
A: ASIP operates independently. ABC Commons is a complementary data source, not a dependency. If ABC fails, ASIP continues with traditional grant processes.

### For Investors

**Q: What's the investment thesis?**  
A: $ABC accrues value from: (1) Curation demand (need $ABC to participate), (2) Deflationary mechanics (burns from wrong predictions/failed proposals), (3) Authority Score hold incentive (selling = losing ability to curate), (4) Network effects (more papers curated → more valuable to participate).

**Q: What's the exit strategy?**  
A: This is a utility token, not a security. "Exit" means selling $ABC on DEX (Aerodrome/Alien Base). Liquidity provided via 50% of contributions + initial $500k LP.

**Q: How is this different from other research DAOs?**  
A: (1) Dual mechanism (curation + bounties), (2) On-chain reputation (Authority Score), (3) Institutional integration (ASIP), (4) AI alignment focus (not general science).

---

## Conclusion

ABC Commons Protocol represents a **unified, battle-tested architecture** that combines the best of distributed expert curation (MERIDIAN) and transparent micro-grant funding (ABC) under a single token economy. By merging these complementary mechanisms, we achieve:

✅ **Simplicity**: One token, one governance, one community  
✅ **Liquidity**: Concentrated capital, deeper markets  
✅ **Narrative**: Clear value proposition for all stakeholders  
✅ **Network Effects**: Curation → Bounties → Grants progression  
✅ **ASIP Synergy**: Holistic reputation system for institutional integration

This is the infrastructure for humanity's alignment with AI—not through centralized control, but through transparent, incentive-aligned coordination at global scale.

**The beachhead is ready. Let's execute.**

---

**Document Version**: 1.0  
**Last Updated**: December 8, 2025  
**Authors**: Mateo Bastidas (ASI Institute), Antigravity (Technical Architecture)  
**Contact**: [Insert contact information]  
**GitHub**: [Insert repository URL]  
**Website**: commons.asi2.org (planned)

---

## Appendix E: Technical Implementation Reference

The following Solidity smart contracts have been implemented as the technical foundation for this proposal.

### 1. ABCToken.sol
*Unified Governance & Utility Token (ERC-20)*
- File: [`contracts/ABCToken.sol`](./contracts/ABCToken.sol)
- Implements fixed 100M supply, ERC20Votes for governance, and pausable functionality.

### 2. CommonsCore.sol
*Primary Protocol Logic*
- File: [`contracts/CommonsCore.sol`](./contracts/CommonsCore.sol)
- Implements:
  - **Research Curation**: Staking 50 ABC, quality prediction, consensus calculation.
  - **Bounty System**: Proposal creation (5K ABC stake), conviction voting, state management.
  - **Rewards**: Automated distribution based on consensus accuracy.

### 3. AuthorityScore.sol
*Reputation Engine*
- File: [`contracts/AuthorityScore.sol`](./contracts/AuthorityScore.sol)
- Implements on-chain reputation stats, scoring logic with decay, and access control.

