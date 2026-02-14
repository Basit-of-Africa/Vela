"use server";

import { predictiveBudgetingInsights, type PredictiveBudgetingInput } from '@/ai/flows/predictive-budgeting-insights';
import type { PredictiveBudgetingOutput } from '@/ai/flows/predictive-budgeting-insights';

export async function getPredictiveInsights(input: PredictiveBudgetingInput): Promise<{ success: boolean; data?: PredictiveBudgetingOutput; error?: string; }> {
  try {
    const output = await predictiveBudgetingInsights(input);
    return { success: true, data: output };
  } catch (error) {
    console.error("Error in getPredictiveInsights:", error);
    return { success: false, error: 'Failed to generate predictive insights. Please try again later.' };
  }
}
