
'use client';

import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Automates cross-module actions when a new customer is created.
 */
export async function triggerCustomerOnboarding(db: Firestore, userId: string, customer: { name: string; company?: string }) {
  // 1. Automatically schedule a Welcome Call for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointmentData = {
    userId,
    title: `Welcome Call: ${customer.name}`,
    description: `Introductory onboarding session for ${customer.name} (${customer.company || 'Private Client'}).`,
    date: tomorrow.toISOString(),
    createdAt: serverTimestamp(),
  };

  addDoc(collection(db, 'appointments'), appointmentData).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'appointments',
      operation: 'create',
      requestResourceData: appointmentData,
    }));
  });

  // 2. Log an automated interaction note
  const interactionData = {
    userId,
    customerName: customer.name,
    type: 'Note',
    content: `System: Automation triggered onboarding workflow. Scheduled welcome call for ${tomorrow.toLocaleDateString()}.`,
    date: new Date().toISOString(),
  };

  addDoc(collection(db, 'interactions'), interactionData).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'interactions',
      operation: 'create',
      requestResourceData: interactionData,
    }));
  });
}

/**
 * Automates actions when a lead is moved to "Closed Won".
 * BRIDGING CRM -> PROJECTS -> CALENDAR
 */
export async function triggerDealWonAutomation(db: Firestore, userId: string, lead: { title: string; customerName: string; value: number }) {
  // 1. Create a Project Record automatically
  const projectData = {
    userId,
    customerName: lead.customerName,
    title: lead.title,
    status: 'Active',
    progress: 0,
    budget: lead.value,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Default 30 days
  };

  addDoc(collection(db, 'projects'), projectData).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'projects',
      operation: 'create',
      requestResourceData: projectData,
    }));
  });

  // 2. Create a Project Kickoff Meeting
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const kickoffData = {
    userId,
    title: `PROJECT KICKOFF: ${lead.title}`,
    description: `Initial delivery meeting for won deal with ${lead.customerName}. Value: $${lead.value}.`,
    date: nextWeek.toISOString(),
    createdAt: serverTimestamp(),
  };

  addDoc(collection(db, 'appointments'), kickoffData).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'appointments',
      operation: 'create',
      requestResourceData: kickoffData,
    }));
  });

  // 3. Log a "Victory" interaction
  const interactionData = {
    userId,
    customerName: lead.customerName,
    type: 'Meeting',
    content: `Victory! Deal "${lead.title}" won. System automatically initialized the Project and scheduled the kickoff for ${nextWeek.toLocaleDateString()}.`,
    date: new Date().toISOString(),
  };

  addDoc(collection(db, 'interactions'), interactionData).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'interactions',
      operation: 'create',
      requestResourceData: interactionData,
    }));
  });
}
