import { KPIMilestone } from './tokenomics';

export const STANDARD_KPIS: KPIMilestone[] = [
    { id: 'kpi_1', name: 'Beta Launch', tier: 1 },
    { id: 'kpi_2', name: '10k Active Users', tier: 1 },
    { id: 'kpi_3', name: 'Mainnet Release', tier: 2 },
    { id: 'kpi_4', name: 'Enterprise Partnership A', tier: 2 },
    { id: 'kpi_5', name: '100k Active Users', tier: 2 },
    { id: 'kpi_6', name: 'Global Expansion', tier: 3 },
    { id: 'kpi_7', name: '1M Active Users', tier: 3 },
    { id: 'kpi_8', name: 'DAO Governance Transition', tier: 3 },
];

export function calculateVotingPower(
    stakedAmount: number,
    isInstitutional: boolean
): number {
    const base = Math.sqrt(stakedAmount);
    return isInstitutional ? base * 1.5 : base;
}
