"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { appointments as initialAppointments } from "@/lib/data";
import type { Appointment } from "@/lib/types";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newAppointmentTitle, setNewAppointmentTitle] = useState("");
  const [newAppointmentDesc, setNewAppointmentDesc] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedDayAppointments = selectedDate
    ? appointments.filter((apt) => isSameDay(apt.date, selectedDate))
    : [];

  const handleAddAppointment = () => {
    if (newAppointmentTitle && selectedDate) {
      const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        date: selectedDate,
        title: newAppointmentTitle,
        description: newAppointmentDesc,
      };
      setAppointments([newAppointment, ...appointments]);
      setNewAppointmentTitle("");
      setNewAppointmentDesc("");
      setIsDialogOpen(false);
    }
  };
  
  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  }

  const appointmentDays = appointments.map(apt => apt.date);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your appointments and events.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={{ booked: appointmentDays }}
                modifiersStyles={{
                    booked: { 
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: 'var(--radius)'
                    }
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Appointments for {selectedDate ? format(selectedDate, "PPP") : "..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((apt) => (
                  <div key={apt.id} className="group relative rounded-md border p-4">
                    <p className="font-semibold">{apt.title}</p>
                    <p className="text-sm text-muted-foreground">{apt.description}</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteAppointment(apt.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No appointments for this day.</p>
              )}
            </CardContent>
            <CardFooter>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={!selectedDate}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add appointment for {selectedDate ? format(selectedDate, "PPP") : ""}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <Input 
                    placeholder="Appointment title"
                    value={newAppointmentTitle}
                    onChange={(e) => setNewAppointmentTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newAppointmentDesc}
                    onChange={(e) => setNewAppointmentDesc(e.target.value)}
                  />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddAppointment}>Save Appointment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
