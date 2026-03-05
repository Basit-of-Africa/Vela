import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type FinancialSummaryCardsProps = {
  transactions: Transaction[];
};

export default function FinancialSummaryCards({ transactions }: FinancialSummaryCardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</CardTitle>
          <div className="p-2 bg-green-50 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-green-600 font-medium">+20.1%</span> from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</CardTitle>
          <div className="p-2 bg-red-50 rounded-full">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
             <span className="text-red-600 font-medium">+12.4%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-primary bg-primary/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Net Profit</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{formatCurrency(profit)}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-primary font-medium">+15.2%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}