import { transactions } from '@/lib/data';
import FinancialSummaryCards from '@/components/dashboard/financial-summary-cards';
import OverviewChart from '@/components/dashboard/overview-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import FinancialHealthCard from '@/components/dashboard/financial-health-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome back, Jane!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your business performance.
        </p>
      </header>
      
      <FinancialSummaryCards transactions={transactions} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <FinancialHealthCard transactions={transactions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Quick Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your "Client Projects" revenue is up 15% this month. Consider allocating more budget to marketing this specific service to sustain growth.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
