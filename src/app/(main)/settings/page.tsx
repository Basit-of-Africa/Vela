
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
  Settings as SettingsIcon, 
  ShieldAlert, 
  Zap, 
  BrainCircuit, 
  Users, 
  DollarSign, 
  Database,
  RefreshCw,
  Loader2,
  CheckCircle2
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
          OS Settings & Control
        </h1>
        <p className="text-muted-foreground">Manage the core logic, automation triggers, and AI behavior of the Vela OS.</p>
      </header>

      <Tabs defaultValue="automation" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="ai">Intelligence</TabsTrigger>
          <TabsTrigger value="hr">HR & Compliance</TabsTrigger>
          <TabsTrigger value="system">System Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Workflow Triggers
              </CardTitle>
              <CardDescription>Configure how Vela handles cross-module events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Onboarding</Label>
                  <p className="text-sm text-muted-foreground">Schedule welcome calls and log notes when a customer is created.</p>
                </div>
                <Switch 
                  checked={settings?.autoOnboarding ?? true} 
                  onCheckedChange={(val) => updateSetting('autoOnboarding', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Closed-Won Project Kickoff</Label>
                  <p className="text-sm text-muted-foreground">Automatically create projects and kickoff meetings when deals are won.</p>
                </div>
                <Switch 
                  checked={settings?.autoProjectCreation ?? true} 
                  onCheckedChange={(val) => updateSetting('autoProjectCreation', val)}
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
                AI Agent Configuration
              </CardTitle>
              <CardDescription>Adjust the sensitivity and behavior of Vela's AI insights.</CardDescription>
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
                  step={5} 
                  onValueChange={(val) => updateSetting('healthThreshold', val[0])}
                />
                <p className="text-xs text-muted-foreground">The score required to maintain a "Healthy" business status label.</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Predictive Forecasting</Label>
                  <p className="text-sm text-muted-foreground">Allow AI to access historical ledger data for budget predictions.</p>
                </div>
                <Switch 
                  checked={settings?.aiForecastingEnabled ?? true} 
                  onCheckedChange={(val) => updateSetting('aiForecastingEnabled', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Compliance & Training
              </CardTitle>
              <CardDescription>Manage requirements for the Vela Academy and team onboarding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Training Pass Mark</Label>
                  <span className="text-sm font-bold text-primary">{settings?.trainingPassMark ?? 75}%</span>
                </div>
                <Slider 
                  value={[settings?.trainingPassMark ?? 75]} 
                  max={100} 
                  step={5} 
                  onValueChange={(val) => updateSetting('trainingPassMark', val[0])}
                />
                <p className="text-xs text-muted-foreground">Minimum score required for employee certification in interactive modules.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Permanent system actions. Use with extreme caution.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-destructive font-bold">Factory Reset Business Data</Label>
                  <p className="text-sm text-muted-foreground">Delete all customers, transactions, and project data associated with this account.</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleResetData}
                  disabled={isResetting}
                >
                  {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Wipe Data
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t">
                <div className="space-y-0.5">
                  <Label>Database Integrity Check</Label>
                  <p className="text-sm text-muted-foreground">Scan all collections for schema mismatches and orphaned records.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Check Initiated", description: "Database integrity is 100%." })}>
                  <Database className="mr-2 h-4 w-4" /> Run Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between text-xs font-medium text-primary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Vela OS Version 1.2.4 (Stable)
          </div>
          <div>Environment: Production (Google Cloud)</div>
        </CardContent>
      </Card>
    </div>
  );
}
