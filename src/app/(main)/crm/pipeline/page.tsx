"use client"

import { useState } from 'react';
import { leads as initialLeads } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  MoreVertical,
  Target,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PipelinePage() {
  const [leads] = useState(initialLeads);
  const { toast } = useToast();

  const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track deals and revenue growth through stages.</p>
        </div>
        <Button onClick={() => toast({ title: "Coming Soon", description: "Drag and drop pipeline management is in development." })}>
          <Plus className="mr-2 h-4 w-4" /> Create Deal
        </Button>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const totalValue = stageLeads.reduce((sum, l) => sum + l.value, 0);

          return (
            <div key={stage} className="flex-shrink-0 w-80 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{stage}</h3>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {stageLeads.length}
                  </Badge>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {formatCurrency(totalValue)}
                </span>
              </div>

              <div className="space-y-3 min-h-[500px] rounded-lg bg-muted/30 p-2">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <p className="text-xs">No deals here</p>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <Card key={lead.id} className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 border-l-primary/40">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold leading-tight">{lead.title}</h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{lead.customerName}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-primary" />
                            <span className="text-sm font-bold">{formatCurrency(lead.value)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs font-medium">{lead.probability}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          <Clock className="h-3 w-3" />
                          Created {lead.createdAt}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}