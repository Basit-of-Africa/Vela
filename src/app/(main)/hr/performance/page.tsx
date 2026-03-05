import { performanceReviews } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, StarHalf, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PerformancePage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Performance Reviews</h1>
          <p className="text-muted-foreground">Track employee growth and historical performance ratings.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Review
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {performanceReviews.map(review => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>{review.employeeName}</CardTitle>
                <CardDescription>Review Date: {review.date}</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 italic text-sm text-foreground/80 leading-relaxed">
                "{review.feedback}"
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  Reviewed by <span className="font-medium text-foreground">{review.reviewer}</span>
                </span>
                <Badge variant="outline">Q1 Review</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}