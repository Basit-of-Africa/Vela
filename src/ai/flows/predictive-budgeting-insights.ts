'use server';
/**
 * @fileOverview This file defines a Genkit flow for predictive budgeting.
 *
 * - predictiveBudgetingInsights - A function that analyzes historical financial data to predict future budget needs and provide actionable insights.
 * - PredictiveBudgetingInput - The input type for the predictiveBudgetingInsights function.
 * - PredictiveBudgetingOutput - The return type for the predictiveBudgetingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const FinancialEntrySchema = z.object({
  date: z.string().datetime().describe('The date of the financial entry in ISO format.'),
  type: z.enum(['income', 'expense']).describe('The type of financial entry: "income" or "expense".'),
  category: z.string().describe('The category of the financial entry (e.g., "Sales", "Rent", "Utilities").'),
  description: z.string().optional().describe('An optional description for the financial entry.'),
  amount: z.number().positive().describe('The amount of the financial entry. Must be a positive number.'),
});

const PredictiveBudgetingInputSchema = z.object({
  historicalData: z.array(FinancialEntrySchema).describe('An array of historical financial entries, including date, type (income/expense), category, description, and amount.'),
  predictionPeriodMonths: z.number().int().positive().describe('The number of months for which to predict the budget.'),
});
export type PredictiveBudgetingInput = z.infer<typeof PredictiveBudgetingInputSchema>;

// Output Schema
const PredictedBudgetSummarySchema = z.object({
  predictedIncome: z.number().describe('The predicted total income for the specified period.'),
  predictedExpenses: z.number().describe('The predicted total expenses for the specified period.'),
  predictedProfit: z.number().describe('The predicted total profit for the specified period (predictedIncome - predictedExpenses).'),
  topIncomeCategories: z.record(z.number()).describe('A record of predicted income by category for the period.'),
  topExpenseCategories: z.record(z.number()).describe('A record of predicted expenses by category for the period.'),
});

const PredictiveBudgetingOutputSchema = z.object({
  predictedBudgetSummary: PredictedBudgetSummarySchema.describe('A summary of the predicted budget for the specified period.'),
  actionableInsights: z.array(z.string()).describe('A list of actionable insights and recommendations based on the financial data.'),
});
export type PredictiveBudgetingOutput = z.infer<typeof PredictiveBudgetingOutputSchema>;

// Define the prompt
const predictiveBudgetingPrompt = ai.definePrompt({
  name: 'predictiveBudgetingPrompt',
  input: {schema: PredictiveBudgetingInputSchema},
  output: {schema: PredictiveBudgetingOutputSchema},
  prompt: `You are an expert financial analyst for small businesses. Your goal is to analyze historical financial data, predict future budget needs for a specified period, and provide actionable insights.

Here is the historical financial data provided by the user:
{{{JSON.stringify historicalData}}}

Based on the provided historical financial data, perform the following tasks:
1. Summarize key financial trends from the historical data.
2. Predict the total income, total expenses, and ultimately the total profit for the next {{{predictionPeriodMonths}}} months.
3. Provide a breakdown of predicted income and expenses by category for the entire prediction period.
4. Generate clear, concise, and actionable insights and recommendations to help the business owner proactively manage their finances. This should include suggestions for cost savings, potential revenue growth strategies, and risk management.

Ensure the output is in the following JSON format:

{{jsonSchema output.schema}}`,
});

// Define the flow
const predictiveBudgetingInsightsFlow = ai.defineFlow(
  {
    name: 'predictiveBudgetingInsightsFlow',
    inputSchema: PredictiveBudgetingInputSchema,
    outputSchema: PredictiveBudgetingOutputSchema,
  },
  async (input) => {
    const {output} = await predictiveBudgetingPrompt(input);
    if (!output) {
      throw new Error('Failed to generate predictive budgeting insights.');
    }
    return output;
  },
);

// Wrapper function
export async function predictiveBudgetingInsights(
  input: PredictiveBudgetingInput,
): Promise<PredictiveBudgetingOutput> {
  return predictiveBudgetingInsightsFlow(input);
}
