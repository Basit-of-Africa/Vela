"use server";

import { predictiveBudgetingInsights, type PredictiveBudgetingInput, type PredictiveBudgetingOutput } from '@/ai/flows/predictive-budgeting-insights';
import { analyzeFinancialHealth, type FinancialHealthInput, type FinancialHealthOutput } from '@/ai/flows/financial-health-flow';

export async function getPredictiveInsights(input: PredictiveBudgetingInput): Promise<{ success: boolean; data?: PredictiveBudgetingOutput; error?: string; }> {
  try {
    const output = await predictiveBudgetingInsights(input);
    return { success: true, data: output };
  } catch (error) {
    console.error("Error in getPredictiveInsights:", error);
    return { success: false, error: 'Failed to generate predictive insights.' };
  }
}

export async function getFinancialHealthAnalysis(input: FinancialHealthInput): Promise<{ success: boolean; data?: FinancialHealthOutput; error?: string; }> {
  try {
    const output = await analyzeFinancialHealth(input);
    return { success: true, data: output };
  } catch (error) {
    console.error("Error in getFinancialHealthAnalysis:", error);
    return { success: false, error: 'Failed to analyze financial health.' };
  }
}
