'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the financial health of a business.
 *
 * - analyzeFinancialHealth - A function that evaluates transactions to determine a health score and status.
 * - FinancialHealthInput - The input type (array of transactions).
 * - FinancialHealthOutput - The return type (score, status, and insights).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialEntrySchema = z.object({
  date: z.string().describe('ISO date string.'),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  amount: z.number(),
});

const FinancialHealthInputSchema = z.object({
  transactions: z.array(FinancialEntrySchema),
});
export type FinancialHealthInput = z.infer<typeof FinancialHealthInputSchema>;

const FinancialHealthOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing financial health.'),
  status: z.enum(['Healthy', 'Stable', 'Warning', 'Critical']).describe('The general financial status.'),
  summary: z.string().describe('A 1-sentence summary of the financial health.'),
  keyObservations: z.array(z.string()).describe('Top 3 key observations or recommendations.'),
});
export type FinancialHealthOutput = z.infer<typeof FinancialHealthOutputSchema>;

const financialHealthPrompt = ai.definePrompt({
  name: 'financialHealthPrompt',
  input: {schema: FinancialHealthInputSchema},
  output: {schema: FinancialHealthOutputSchema},
  prompt: `You are a senior financial consultant. Analyze the following transaction history for a small business:
  
  {{{JSON.stringify transactions}}}
  
  Evaluate the burn rate, revenue consistency, and expense management. 
  Provide a health score (0-100), a status label, a concise summary, and three key observations.
  
  {{jsonSchema output.schema}}`,
});

const financialHealthFlow = ai.defineFlow(
  {
    name: 'financialHealthFlow',
    inputSchema: FinancialHealthInputSchema,
    outputSchema: FinancialHealthOutputSchema,
  },
  async (input) => {
    const {output} = await financialHealthPrompt(input);
    if (!output) throw new Error('Failed to analyze financial health.');
    return output;
  }
);

export async function analyzeFinancialHealth(input: FinancialHealthInput): Promise<FinancialHealthOutput> {
  return financialHealthFlow(input);
}
