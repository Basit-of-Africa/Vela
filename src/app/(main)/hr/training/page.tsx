
"use client"

import { useState } from 'react';
import { trainingModules } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Play
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TrainingPage() {
  const [activeModule, setActiveModule] = useState<typeof trainingModules[0] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const handleStartModule = (module: typeof trainingModules[0]) => {
    setActiveModule(module);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleNext = () => {
    if (activeModule && currentQuestion < activeModule.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    if (!activeModule) return 0;
    let correct = 0;
    activeModule.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / activeModule.questions.length) * 100);
  };

  const handleFinish = () => {
    const score = calculateScore();
    if (score >= 70) {
      toast({
        title: "Module Completed!",
        description: `Congratulations! You passed with ${score}%. Certification generated.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: `You scored ${score}%. You need 70% to pass this module.`,
      });
    }
    setActiveModule(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Interactive Training</h1>
        <p className="text-muted-foreground">Upskill your team with automated learning modules and certification quizzes.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {trainingModules.map(module => (
          <Card key={module.id} className="flex flex-col h-full hover:shadow-lg transition-all border-l-4 border-l-primary/40">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {module.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" /> {module.duration}
                </div>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {module.questions.length} Units
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Compliance Certification
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full group" onClick={() => handleStartModule(module)}>
                <Play className="mr-2 h-4 w-4 group-hover:fill-current" /> Start Training
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!activeModule} onOpenChange={() => !showResult && setActiveModule(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {activeModule && !showResult && (
            <>
              <DialogHeader>
                <DialogTitle>{activeModule.title}</DialogTitle>
                <DialogDescription>Assessment Unit {currentQuestion + 1} of {activeModule.questions.length}</DialogDescription>
                <Progress value={((currentQuestion + 1) / activeModule.questions.length) * 100} className="mt-4 h-2" />
              </DialogHeader>
              <div className="py-6 space-y-6">
                <p className="font-semibold text-lg leading-tight">{activeModule.questions[currentQuestion].question}</p>
                <RadioGroup 
                  value={answers[currentQuestion]?.toString()} 
                  onValueChange={(val) => {
                    const newAnswers = [...answers];
                    newAnswers[currentQuestion] = parseInt(val);
                    setAnswers(newAnswers);
                  }}
                  className="grid gap-3"
                >
                  {activeModule.questions[currentQuestion].options.map((option, idx) => (
                    <div key={idx} className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-muted/50 ${answers[currentQuestion] === idx ? 'border-primary bg-primary/5' : ''}`}>
                      <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="sr-only" />
                      <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActiveModule(null)}>Exit</Button>
                <Button 
                  onClick={handleNext} 
                  disabled={answers[currentQuestion] === undefined}
                  className="min-w-[100px]"
                >
                  {currentQuestion === activeModule.questions.length - 1 ? 'Complete Assessment' : 'Next Unit'} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}

          {activeModule && showResult && (
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold">Module Evaluation</DialogTitle>
                <DialogDescription>You've completed the {activeModule.title} training.</DialogDescription>
              </DialogHeader>
              <div className="py-8 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <p className={`text-6xl font-extrabold ${calculateScore() >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculateScore()}%
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Final Assessment Score</p>
                <div className={`p-4 rounded-lg border text-sm font-medium ${calculateScore() >= 70 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {calculateScore() >= 70 
                    ? '🎉 Certified! You have demonstrated proficiency in this module.' 
                    : '❌ Did not meet compliance threshold (70%). Please review materials and retry.'}
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full py-6 text-lg" onClick={handleFinish}>
                  {calculateScore() >= 70 ? 'Add to Profile' : 'Retake Later'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
