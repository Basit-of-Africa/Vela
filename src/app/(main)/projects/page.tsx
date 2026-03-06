
"use client"

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Kanban, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Plus,
  Loader2,
  Zap,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const projectsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'projects'), where('userId', '==', user.uid));
  }, [db, user]);

  const { data: projects = [], loading } = useCollection<Project>(projectsQuery as any);

  const statuses: Project['status'][] = ['Active', 'On Hold', 'Completed'];

  const handleUpdateStatus = (projectId: string, newStatus: Project['status']) => {
    if (!db) return;
    const docRef = doc(db, 'projects', projectId);
    updateDoc(docRef, { status: newStatus })
      .then(() => toast({ title: "Project Updated", description: `Status changed to ${newStatus}` }))
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus }
        }));
      });
  };

  const handleUpdateProgress = (projectId: string, currentProgress: number) => {
    if (!db) return;
    const newProgress = Math.min(100, currentProgress + 10);
    const docRef = doc(db, 'projects', projectId);
    updateDoc(docRef, { progress: newProgress })
      .then(() => toast({ title: "Progress Tracked", description: `Now at ${newProgress}%` }))
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { progress: newProgress }
        }));
      });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Projects & Delivery
            <Briefcase className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-muted-foreground">Manage ongoing client work. Closed Won deals automatically appear here.</p>
        </div>
        <Button onClick={() => toast({ title: "Info", description: "Projects are automatically created from won sales deals." })}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {statuses.map(status => {
            const statusProjects = projects.filter(p => p.status === status);
            
            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{status}</h3>
                  <Badge variant="secondary">{statusProjects.length}</Badge>
                </div>

                <div className="space-y-4 min-h-[600px] rounded-xl bg-muted/20 p-3 border border-dashed border-muted">
                  {statusProjects.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground">No projects in {status}</div>
                  ) : (
                    statusProjects.map(project => (
                      <Card key={project.id} className="group relative overflow-hidden hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Target className="h-3 w-3" /> {project.customerName}
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {statuses.filter(s => s !== status).map(s => (
                                  <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(project.id, s)}>
                                    Move to {s}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Budget</p>
                              <p className="text-sm font-bold">{formatCurrency(project.budget)}</p>
                            </div>
                            <div className="space-y-1 text-right">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Due Date</p>
                              <p className="text-sm font-medium">{project.dueDate || 'TBD'}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs" 
                            onClick={() => handleUpdateProgress(project.id, project.progress)}
                            disabled={project.progress >= 100 || status === 'Completed'}
                          >
                            <Zap className="mr-2 h-3 w-3 text-primary fill-primary" />
                            Log Progress
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
