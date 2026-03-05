"use client"

import { useState } from 'react';
import { hrQueries as initialQueries } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QueriesPage() {
  const [queries, setQueries] = useState(initialQueries);
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-500/10 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-600/10 border-yellow-200';
      case 'Low': return 'text-blue-600 bg-blue-600/10 border-blue-200';
      default: return '';
    }
  };

  const updateStatus = (id: string, newStatus: 'In Progress' | 'Resolved') => {
    setQueries(prev => prev.map(q => 
      q.id === id ? { ...q, status: newStatus } : q
    ));
    toast({
      title: `Query ${newStatus}`,
      description: `Ticket status has been updated to ${newStatus}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Employee Helpdesk</h1>
          <p className="text-muted-foreground">Internal query system for HR-related assistance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button onClick={() => toast({ title: "Note", description: "Query submission is simulated. Use existing tickets to test updates." })}>
            <MessageSquare className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {queries.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="font-medium">All clear!</p>
            <p className="text-sm text-muted-foreground">There are no active HR queries at the moment.</p>
          </div>
        ) : (
          queries.map(query => (
            <Card key={query.id} className="relative overflow-hidden">
               {query.priority === 'High' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              )}
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {query.subject}
                      {query.priority === 'High' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">From {query.employeeName} • {query.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getPriorityColor(query.priority)}>
                      {query.priority} Priority
                    </Badge>
                    <Badge variant={query.status === 'Resolved' ? 'default' : 'secondary'}>{query.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{query.message}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" onClick={() => toast({ title: "Response Sent", description: "Your message has been logged in the ticket history." })}>Respond</Button>
                  
                  {query.status !== 'Resolved' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => updateStatus(query.id, 'Resolved')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve
                      </Button>
                      {query.status === 'Open' && (
                        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground" onClick={() => updateStatus(query.id, 'In Progress')}>
                          <Clock className="mr-1 h-3 w-3" /> Mark as In Progress
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
