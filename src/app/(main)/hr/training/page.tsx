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
        description: `Congratulations! You passed with ${score}%.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: `You scored ${score}%. You need 70% to pass.`,
      });
    }
    setActiveModule(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Interactive Training</h1>
        <p className="text-muted-foreground">Upskill your team with interactive learning modules and quizzes.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {trainingModules.map(module => (
          <Card key={module.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{module.category}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {module.duration}
                </div>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {module.questions.length} Units
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Certification
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" onClick={() => handleStartModule(module)}>
                <Play className="mr-2 h-4 w-4" /> Start Learning
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
                <DialogDescription>Question {currentQuestion + 1} of {activeModule.questions.length}</DialogDescription>
                <Progress value={((currentQuestion + 1) / activeModule.questions.length) * 100} className="mt-4 h-2" />
              </DialogHeader>
              <div className="py-6 space-y-6">
                <p className="font-medium leading-relaxed">{activeModule.questions[currentQuestion].question}</p>
                <RadioGroup 
                  value={answers[currentQuestion]?.toString()} 
                  onValueChange={(val) => {
                    const newAnswers = [...answers];
                    newAnswers[currentQuestion] = parseInt(val);
                    setAnswers(newAnswers);
                  }}
                >
                  {activeModule.questions[currentQuestion].options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                      <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActiveModule(null)}>Cancel</Button>
                <Button 
                  onClick={handleNext} 
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === activeModule.questions.length - 1 ? 'See Results' : 'Next'} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}

          {activeModule && showResult && (
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <DialogTitle className="text-2xl">Module Complete!</DialogTitle>
                <DialogDescription>You've finished the {activeModule.title} training.</DialogDescription>
              </DialogHeader>
              <div className="py-8 text-center space-y-2">
                <p className="text-4xl font-bold text-primary">{calculateScore()}%</p>
                <p className="text-sm text-muted-foreground">Final Score</p>
                <p className="pt-4 text-sm font-medium">
                  {calculateScore() >= 70 ? '🎉 You passed the assessment!' : '❌ You didn\'t reach the passing score (70%).'}
                </p>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={handleFinish}>
                  {calculateScore() >= 70 ? 'Claim Certificate' : 'Finish & Close'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}