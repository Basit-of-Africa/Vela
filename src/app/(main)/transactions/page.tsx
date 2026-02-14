"use client";

import { useState } from 'react';
import { transactions as initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import TransactionsTable from '@/components/transactions/transactions-table';
import AddTransactionSheet from '@/components/transactions/add-transaction-sheet';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [
        { ...newTransaction, id: `txn_${Date.now()}` },
        ...prev
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <p className="text-muted-foreground">
            Log and manage your income and expenses.
          </p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </header>
      
      <TransactionsTable transactions={transactions} />

      <AddTransactionSheet 
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
