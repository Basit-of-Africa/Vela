import { transactions } from '@/lib/data';
import FinancialSummaryCards from '@/components/dashboard/financial-summary-cards';
import OverviewChart from '@/components/dashboard/overview-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import FinancialHealthCard from '@/components/dashboard/financial-health-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, Jane. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link href="/transactions">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Link>
          </Button>
        </div>
      </header>
      
      <FinancialSummaryCards transactions={transactions} />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Financial Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Monthly revenue vs expenses</p>
              </div>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-primary text-primary-foreground overflow-hidden relative border-none">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PlusCircle size={120} />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Smart Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/90 leading-relaxed">
                Your "Client Projects" revenue is up 15% this month. Consider allocating more budget to marketing this specific service to sustain growth.
              </p>
              <Button variant="secondary" className="mt-6 w-full" asChild>
                <Link href="/predictive-insights">View Forecast</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                Add Invoice
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                Log Expense
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                Scan Receipt
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                Update Tax
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}