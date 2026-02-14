import { transactions } from '@/lib/data';
import FinancialSummaryCards from '@/components/dashboard/financial-summary-cards';
import OverviewChart from '@/components/dashboard/overview-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart transactions={transactions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
