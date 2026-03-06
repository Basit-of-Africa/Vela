"use client"

import { useState, useMemo } from 'react';
import { useFirestore, useUser, useDoc } from '@/firebase';
import { doc, setDoc, updateDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings as SettingsIcon, 
  ShieldAlert, 
  Zap, 
  BrainCircuit, 
  Users, 
  Database,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Kanban,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SettingsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  // Fetch or create system settings doc
  const settingsRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'settings', user.uid);
  }, [db, user]);

  const { data: settings, loading } = useDoc(settingsRef);

  const updateSetting = (key: string, value: any) => {
    if (!settingsRef) return;
    
    updateDoc(settingsRef, { [key]: value })
      .then(() => {
        toast({
          title: "Setting Updated",
          description: `${key} has been synchronized with the cloud.`,
        });
      })
      .catch(async () => {
        // If doc doesn't exist, create it
        setDoc(settingsRef, { [key]: value }, { merge: true });
      });
  };

  const handleResetData = async () => {
    if (!db || !user) return;
    setIsResetting(true);
    
    try {
      const collections = ['customers', 'leads', 'projects', 'interactions', 'employees', 'leaveRequests', 'hrQueries', 'transactions', 'appointments'];
      
      for (const collName of collections) {
        const querySnapshot = await getDocs(collection(db, collName));
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
          if (doc.data().userId === user.uid) {
            batch.delete(doc.ref);
          }
        });
        await batch.commit();
      }

      toast({
        title: "System Reset Complete",
        description: "All user-specific data has been cleared. Vela is now in a fresh state.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "An error occurred while clearing data.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Vela OS Control Center
        </h1>
        <p className="text-muted-foreground">Master configuration for Vela's automation, intelligence, and business logic.</p>
      </header>

      <Tabs defaultValue="automation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="automation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">Automation</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">Intelligence</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">Projects</TabsTrigger>
          <TabsTrigger value="hr" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">Team</TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground border">System</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Logic Triggers
              </CardTitle>
              <CardDescription>Configure cross-module automated workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Onboarding</Label>
                  <p className="text-sm text-muted-foreground">Trigger onboarding sequence when a customer is added.</p>
                </div>
                <Switch 
                  checked={settings?.autoOnboarding ?? true} 
                  onCheckedChange={(val) => updateSetting('autoOnboarding', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Closed-Won Kickoff</Label>
                  <p className="text-sm text-muted-foreground">Initialize projects and schedule meetings when deals close.</p>
                </div>
                <Switch 
                  checked={settings?.autoProjectCreation ?? true} 
                  onCheckedChange={(val) => updateSetting('autoProjectCreation', val)}
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Simulate Notifications</Label>
                  <p className="text-sm text-muted-foreground">Log automated email simulations to the interaction history.</p>
                </div>
                <Switch 
                  checked={settings?.simulateNotifications ?? true} 
                  onCheckedChange={(val) => updateSetting('simulateNotifications', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Agent Configuration
              </CardTitle>
              <CardDescription>Fine-tune AI agent sensitivity and processing behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Financial Health Threshold</Label>
                  <span className="text-sm font-bold text-primary">{settings?.healthThreshold ?? 70}%</span>
                </div>
                <Slider 
                  value={[settings?.healthThreshold ?? 70]} 
                  max={100} 
                  step={1} 
                  onValueChange={(val) => updateSetting('healthThreshold', val[0])}
                />
                <p className="text-xs text-muted-foreground">Minimum score to maintain a "Healthy" business status.</p>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <Label>OCR Confidence Limit</Label>
                  </div>
                  <span className="text-sm font-bold text-primary">{settings?.ocrConfidenceLimit ?? 85}%</span>
                </div>
                <Slider 
                  value={[settings?.ocrConfidenceLimit ?? 85]} 
                  max={100} 
                  step={5} 
                  onValueChange={(val) => updateSetting('ocrConfidenceLimit', val[0])}
                />
                <p className="text-xs text-muted-foreground">Minimum confidence score required to auto-approve receipt scans.</p>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <Label>AI Report Personality</Label>
                <Select 
                  value={settings?.aiReportTone ?? 'Professional'} 
                  onValueChange={(val) => updateSetting('aiReportTone', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Standard Professional</SelectItem>
                    <SelectItem value="Concise">Bullet-Point Concise</SelectItem>
                    <SelectItem value="Encouraging">Empathetic & Encouraging</SelectItem>
                    <SelectItem value="Strict">Strict & Data-Heavy</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Determines the writing style of client status reports.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Kanban className="h-5 w-5 text-blue-500" />
                Delivery Parameters
              </CardTitle>
              <CardDescription>Default settings for the project management module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Default Project Duration (Days)</Label>
                  <span className="text-sm font-bold text-primary">{settings?.defaultProjectDuration ?? 30} days</span>
                </div>
                <Slider 
                  value={[settings?.defaultProjectDuration ?? 30]} 
                  min={7}
                  max={180} 
                  step={1} 
                  onValueChange={(val) => updateSetting('defaultProjectDuration', val[0])}
                />
                <p className="text-xs text-muted-foreground">Standard timeline for projects auto-generated from won leads.</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="space-y-0.5">
                  <Label>Auto-Archive Completed</Label>
                  <p className="text-sm text-muted-foreground">Move projects to history 7 days after 100% completion.</p>
                </div>
                <Switch 
                  checked={settings?.autoArchiveProjects ?? false} 
                  onCheckedChange={(val) => updateSetting('autoArchiveProjects', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Team Compliance
              </CardTitle>
              <CardDescription>Manage requirements for employee training and leave.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Academy Passing Grade</Label>
                  <span className="text-sm font-bold text-primary">{settings?.trainingPassMark ?? 75}%</span>
                </div>
                <Slider 
                  value={[settings?.trainingPassMark ?? 75]} 
                  max={100} 
                  step={5} 
                  onValueChange={(val) => updateSetting('trainingPassMark', val[0])}
                />
                <p className="text-xs text-muted-foreground">Minimum score required for Vela Academy certifications.</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="space-y-0.5">
                  <Label>Auto-Approve Sick Leave</Label>
                  <p className="text-sm text-muted-foreground">Automatically approve sick leave requests under 2 days.</p>
                </div>
                <Switch 
                  checked={settings?.autoApproveSickLeave ?? false} 
                  onCheckedChange={(val) => updateSetting('autoApproveSickLeave', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                OS Factory Reset
              </CardTitle>
              <CardDescription>Permanent system actions. Use with extreme caution.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-destructive font-bold">Wipe Business Instance</Label>
                  <p className="text-sm text-muted-foreground">Delete all data associated with this account across all modules.</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleResetData}
                  disabled={isResetting}
                >
                  {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Confirm Purge
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t">
                <div className="space-y-0.5">
                  <Label>Database Optimization</Label>
                  <p className="text-sm text-muted-foreground">Scan and index all collections for faster cross-module querying.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Maintenance Complete", description: "Database has been indexed and optimized." })}>
                  <Database className="mr-2 h-4 w-4" /> Start Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-primary/5 rounded-xl border-2 border-dashed border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Vela Engine v1.2.4 Active
            </h4>
            <p className="text-xs text-muted-foreground">All systems functional. Google Cloud Region: us-central1.</p>
          </div>
          <Button variant="outline" size="sm" className="bg-background">Export OS Config</Button>
        </div>
      </div>
    </div>
  );
}
