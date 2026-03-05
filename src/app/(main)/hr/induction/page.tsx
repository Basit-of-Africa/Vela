import { inductionTasks, employees } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export default function InductionPage() {
  const onboardingEmployees = employees.filter(e => e.status === 'Onboarding');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Induction Management</h1>
        <p className="text-muted-foreground">Monitor and automate the onboarding process for new hires.</p>
      </header>

      {onboardingEmployees.length === 0 ? (
        <Card className="border-dashed flex items-center justify-center p-12 text-center">
          <div className="space-y-2">
            <p className="font-medium">No active inductions</p>
            <p className="text-sm text-muted-foreground">Add a new employee to start their onboarding checklist.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {onboardingEmployees.map(employee => {
            const tasks = inductionTasks.filter(t => t.employeeId === employee.id);
            const completedCount = tasks.filter(t => t.completed).length;
            const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

            return (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>{employee.name}'s Induction</CardTitle>
                      <CardDescription>{employee.role} • Joined {employee.joinDate}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {Math.round(progress)}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Overall Progress</span>
                      <span>{completedCount} / {tasks.length} tasks</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Checklist Items</h3>
                    <div className="grid gap-3">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                          <Checkbox id={task.id} checked={task.completed} />
                          <div className="grid gap-1">
                            <Label htmlFor={task.id} className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {task.task}
                            </Label>
                            <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}