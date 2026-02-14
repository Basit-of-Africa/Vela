"use client"

import { useState } from "react"
import { getPredictiveInsights } from "@/lib/actions"
import { transactions } from "@/lib/data"
import type { PredictiveBudgetingOutput } from "@/ai/flows/predictive-budgeting-insights"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lightbulb, BarChart, TrendingUp, TrendingDown, Wallet } from "lucide-react"

export default function PredictiveInsightsPage() {
  const [predictionPeriod, setPredictionPeriod] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PredictiveBudgetingOutput | null>(null)
  const { toast } = useToast()

  const handleGenerateInsights = async () => {
    setIsLoading(true)
    setResults(null)
    const res = await getPredictiveInsights({
      historicalData: transactions,
      predictionPeriodMonths: predictionPeriod,
    })
    if (res.success && res.data) {
      setResults(res.data)
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "An unknown error occurred.",
      })
    }
    setIsLoading(false)
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Predictive Insights
        </h1>
        <p className="text-muted-foreground">
          Use AI to analyze your financial data and forecast your budget.
        </p>
      </header>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <label htmlFor="prediction-period" className="font-medium">
            Prediction Period (Months):
          </label>
          <Input
            id="prediction-period"
            type="number"
            value={predictionPeriod}
            onChange={(e) => setPredictionPeriod(Number(e.target.value))}
            className="w-24"
            min="1"
            max="12"
          />
          <Button onClick={handleGenerateInsights} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BarChart className="mr-2 h-4 w-4" />
            )}
            Generate Insights
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary"/>
            <p className="font-medium">Analyzing your data...</p>
            <p className="text-sm text-muted-foreground">The AI is forecasting your financial future. Please wait a moment.</p>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet />
                        Predicted Budget Summary
                    </CardTitle>
                    <CardDescription>
                        For the next {predictionPeriod} months.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-background p-4">
                        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground"><p>Predicted Revenue</p><TrendingUp/></div>
                        <p className="mt-2 text-2xl font-bold">{formatCurrency(results.predictedBudgetSummary.predictedIncome)}</p>
                    </div>
                     <div className="rounded-lg border bg-background p-4">
                        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground"><p>Predicted Expenses</p><TrendingDown/></div>
                        <p className="mt-2 text-2xl font-bold">{formatCurrency(results.predictedBudgetSummary.predictedExpenses)}</p>
                    </div>
                    <div className="rounded-lg border bg-primary/10 p-4">
                        <div className="flex items-center justify-between text-sm font-medium text-primary"><p>Predicted Profit</p><Wallet/></div>
                        <p className="mt-2 text-2xl font-bold text-primary">{formatCurrency(results.predictedBudgetSummary.predictedProfit)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Predicted Income</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {Object.entries(results.predictedBudgetSummary.topIncomeCategories).map(([category, amount]) => (
                            <li key={category} className="flex justify-between border-b pb-2">
                                <span>{category}</span>
                                <span className="font-medium">{formatCurrency(amount)}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Predicted Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {Object.entries(results.predictedBudgetSummary.topExpenseCategories).map(([category, amount]) => (
                            <li key={category} className="flex justify-between border-b pb-2">
                                <span>{category}</span>
                                <span className="font-medium">{formatCurrency(amount)}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb />
                        Actionable Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5">
                    {results.actionableInsights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                    ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  )
}
