
"use client"

import { useState, useMemo } from "react"
import { getPredictiveInsights } from "@/lib/actions"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, where, orderBy } from "firebase/firestore"
import type { PredictiveBudgetingOutput } from "@/ai/flows/predictive-budgeting-insights"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lightbulb, BarChart, TrendingUp, TrendingDown, Wallet, Sparkles } from "lucide-react"

export default function PredictiveInsightsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [predictionPeriod, setPredictionPeriod] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<PredictiveBudgetingOutput | null>(null)
  const { toast } = useToast()

  // Fetch real historical data for AI analysis
  const transactionsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('date', 'desc'));
  }, [db, user]);

  const { data: transactions = [], loading: loadingData } = useCollection(transactionsQuery);

  const handleGenerateInsights = async () => {
    if (transactions.length < 3) {
      toast({
        variant: "destructive",
        title: "Insufficient Data",
        description: "Please log at least 3 transactions to generate reliable forecasts."
      });
      return;
    }

    setIsGenerating(true);
    setResults(null);
    
    // Pass real Firestore data to the AI agent
    const res = await getPredictiveInsights({
      historicalData: transactions as any,
      predictionPeriodMonths: predictionPeriod,
    });

    if (res.success && res.data) {
      setResults(res.data);
      toast({ title: "Forecast Complete", description: "AI has synthesized your financial future." });
    } else {
      toast({
        variant: "destructive",
        title: "Agent Error",
        description: res.error || "The AI agent encountered an issue analyzing your data.",
      });
    }
    setIsGenerating(false);
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
          Predictive Intelligence
          <Sparkles className="h-6 w-6 text-primary fill-primary/10" />
        </h1>
        <p className="text-muted-foreground">
          Advanced AI forecasting based on your live financial ledger.
        </p>
      </header>

      <Card className="border-primary/20 bg-primary/[0.02]">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="space-y-1 flex-1">
             <Label htmlFor="prediction-period" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Forecast Horizon</Label>
             <p className="text-xs text-muted-foreground">How many months forward should the agent look?</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              id="prediction-period"
              type="number"
              value={predictionPeriod}
              onChange={(e) => setPredictionPeriod(Number(e.target.value))}
              className="w-20 font-bold"
              min="1"
              max="12"
            />
            <Button onClick={handleGenerateInsights} disabled={isGenerating || loadingData}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Synthesizing..." : "Generate Forecast"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isGenerating && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-20 text-center bg-muted/20">
            <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20"/>
                <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-1">
                <p className="font-bold text-lg">AI Agent is Reasoning...</p>
                <p className="text-sm text-muted-foreground max-w-sm">We're analyzing {transactions.length} historical entries to build a predictive model for your business.</p>
            </div>
        </div>
      )}

      {results && !isGenerating && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="lg:col-span-2 shadow-lg border-l-4 border-l-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Wallet className="h-5 w-5 text-primary" />
                        Executive Budget Forecast
                    </CardTitle>
                    <CardDescription>
                        Consolidated projections for the next {predictionPeriod} months.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-muted-foreground mb-3">
                            <span>Est. Revenue</span>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-3xl font-extrabold text-foreground">{formatCurrency(results.predictedBudgetSummary.predictedIncome)}</p>
                    </div>
                     <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-muted-foreground mb-3">
                            <span>Est. Burn Rate</span>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="text-3xl font-extrabold text-foreground">{formatCurrency(results.predictedBudgetSummary.predictedExpenses)}</p>
                    </div>
                    <div className="rounded-xl border bg-primary/5 p-5 shadow-sm border-primary/20">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-primary mb-3">
                            <span>Est. Net Profit</span>
                            <Wallet className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-3xl font-extrabold text-primary">{formatCurrency(results.predictedBudgetSummary.predictedProfit)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-bold">Projected Revenue Mix</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(results.predictedBudgetSummary.topIncomeCategories).map(([category, amount]) => (
                            <div key={category} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{category}</span>
                                    <span className="font-bold">{formatCurrency(amount)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${(amount / results.predictedBudgetSummary.predictedIncome) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-bold">Projected Expense Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(results.predictedBudgetSummary.topExpenseCategories).map(([category, amount]) => (
                            <div key={category} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{category}</span>
                                    <span className="font-bold">{formatCurrency(amount)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${(amount / results.predictedBudgetSummary.predictedExpenses) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-primary/5 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-primary fill-primary/10" />
                        Strategic Observations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.actionableInsights.map((insight, index) => (
                        <div key={index} className="flex gap-3 p-4 rounded-lg bg-background border shadow-sm">
                            <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">{insight}</p>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

      {transactions.length === 0 && !loadingData && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl gap-4">
              <BarChart className="h-10 w-10 text-muted-foreground opacity-20" />
              <div className="text-center space-y-1">
                  <p className="font-bold">No Data for Analysis</p>
                  <p className="text-sm text-muted-foreground">Start logging transactions to unlock AI-powered forecasting.</p>
              </div>
          </div>
      )}
    </div>
  )
}

import { Label } from "@/components/ui/label"
