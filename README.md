SUMMARY<BR>

The SAIT Calculator is a comprehensive tool for simulating SAIT tokenomics, offering flexible parameter adjustments, phase-based unlocks, burn floor mechanics, treasury modeling, overhang warnings, scenario presets, and multi-supply comparisons. Its interactive UI, with detailed charts and tables, provides clear insights into price, supply, burn, and treasury dynamics, addressing key risks like overhang and ensuring robust treasury health. The application is optimized for performance and usability, making it a valuable tool for tokenomics analysis.
This app is a React-based tool for modeling the tokenomics of the Sovereign AI Token (SAIT). Below is a summary of its key features, based on the scenarios in the original SAIT simulation repo: https://github.com/Mbastidas001/SAIT/tree/main/sims

KEY FEATURES<BR>

1. Tokenomics Simulation:
   - Purpose: Models SAIT’s economic behavior over a user-defined time horizon (default 36 months).
   - Parameters:
     - Total supply options: 500M, 1B, 5B or 10B tokens (default 1B).
     - Initial circulating supply: 15% from crowdfunding, with 70% in escrow.
     - Adjustable market parameters: base price ($0.05), price growth rate (15% monthly), FOMO multiplier (5%), market sentiment (1.0x), regulatory risk (0.95x), and competition factor (1.0x).
     - Buyer behavior: speculators (40%), utility buyers (35%), and hodlers (25%) with configurable sell rates (10%, 3%, 1% monthly, respectively).
   - Calculations:
     - Tracks price, market cap, circulating supply, escrow remaining, total burned tokens, burn rate, sell pressure, compliance checks, treasury balance, and treasury runway.
     - Incorporates supply and demand dynamics, adjusting price based on net pressure from unlocks and burns.

2. Phase-Based Unlock System:
   - Feature: Supports a phase-based unlock schedule (Pilot: Q1-Q2, R&D Scaling: Q2-Q5, Expansion: Q6-Q13) with a total of 28% escrow unlocks.
   - Details:
     - Defined via a Phase interface with buckets for research, ecosystem, and team allocations.
     - Users can toggle between phase-based unlocks and a legacy monthly unlock system (base rate 0.5%, milestone rate 1%).
     - Ensures unlocks don’t exceed remaining escrow.

3. Burn Floor Mechanism:
   - Feature: Enforces a minimum burn of 2M SAIT per quarter to create deflationary pressure.
   - Details:
     - Compares usage-based burns (from compliance checks) with the burn floor, using the higher value.
     - Treasury finances additional burns if usage-based burns fall below the floor, with costs deducted from treasury inflow.
     - Supports different check types: simple (0.5x cost), complex (1x cost), and enterprise (3x cost), with default ratios of 60%, 30%, and 10%.

4. Advanced Treasury Modeling:
   - Feature: Tracks treasury health with starting cash ($1.5M), quarterly operational spend ($600K), and fee share (30%).
   - Details:
     - Calculates monthly treasury inflow from compliance check fees ($0.25 per check) and deducts operational expenses and burn floor costs.
     - Computes treasury runway (months until depletion), displaying “∞” for sustainable scenarios.
     - Provides a health check with warnings for negative balances or runways below 12 months.

5. Overhang Risk Warnings:
   - Feature: Alerts users when token overhang (unlocks in the next two quarters relative to circulating supply) exceeds 40%.
   - Details:
     - Calculates overhang ratio monthly and displays warnings in the UI.
     - Includes overhang percentage in the summary table for key months.

6. Scenario Presets:
   - Feature: Offers four predefined scenarios: Base Mid, Lean Supply, High Adoption, and Runway Guard.
   - Details:
     - Each preset adjusts parameters like base price, price growth rate, unlock rates, and compliance checks.
     - Users select presets via a dropdown, automatically updating relevant parameters for quick scenario comparison.

7. Multi-Supply Comparison:
   - Feature: Simulates tokenomics across multiple total supplies (500M, 1B, 5B).
   - **Details:
     - Generates separate data sets for each supply level.
     - Includes a dedicated chart comparing burn rates across supplies, helping users analyze supply impact.

8. Interactive UI with Visualizations:
   - Components:
     - Key Metrics Summary**: Displays final price, market cap, total burned, and circulating supply in a grid.
     - Controls Panel: Allows users to adjust market, tokenomics, treasury, and buyer behavior parameters via inputs and sliders.
     - Charts:
       - Price & Market Cap Evolution (line chart).
       - Treasury Health & Runway (line chart).
       - Supply Dynamics (area chart for escrow, circulating supply, and burned tokens).
       - Multi-Supply Burn Rate Comparison (line chart).
     - Summary Table: Shows metrics (price, market cap, supply, burn rate, treasury, runway, checks, overhang) for every 6th month and the final month.
   - Formatting: Uses helper functions to format currency ($K, $M, $B) and token amounts (K, M).

9. Error-Free and Modular Design:
   - Feature: Syntactically valid TypeScript/React code with proper `useMemo` optimization.
   - Details:
     - Fixed previous syntax issues (e.g., imports, `React.FC`, `useMemo` dependencies).
     - Uses Tailwind CSS for styling, ensuring a responsive and modern UI.
     - Modular structure with separate sections for market, tokenomics, treasury, and buyer behavior controls.
