import { customers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Plus, 
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

export default function CustomersPage() {
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
          <h1 className="font-headline text-3xl font-bold tracking-tight">Customer Directory</h1>
          <p className="text-muted-foreground">Manage your client relationships and contact data.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by name, company, or email..." />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map(customer => (
          <Card key={customer.id} className="group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-none group-hover:text-primary transition-colors">
                    {customer.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{customer.company}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between border-t border-dashed">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Lifetime Value</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(customer.totalValue)}</p>
                </div>
                <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                  {customer.status}
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="mr-2 h-3 w-3" />
                View Customer Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}