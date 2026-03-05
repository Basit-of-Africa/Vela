import { hrQueries } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Filter, AlertTriangle } from 'lucide-react';

export default function QueriesPage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-500/10 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-600/10 border-yellow-200';
      case 'Low': return 'text-blue-600 bg-blue-600/10 border-blue-200';
      default: return '';
    }
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
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {hrQueries.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="font-medium">All clear!</p>
            <p className="text-sm text-muted-foreground">There are no active HR queries at the moment.</p>
          </div>
        ) : (
          hrQueries.map(query => (
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
                    <Badge>{query.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{query.message}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm">Respond</Button>
                  <Button variant="ghost" size="sm">Resolve</Button>
                  <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> Mark as In Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}