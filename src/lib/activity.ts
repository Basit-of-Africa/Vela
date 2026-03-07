
'use client';

import { Firestore, collection, addDoc } from 'firebase/firestore';

/**
 * Utility to log global system activities across the OS.
 * This powers the "Command Center" Pulse Ledger.
 */
export async function logActivity(db: Firestore, userId: string, data: {
  module: 'CRM' | 'HR' | 'Finance' | 'Operations' | 'System',
  action: string,
  severity?: 'info' | 'success' | 'warning'
}) {
  const activityData = {
    userId,
    module: data.module,
    action: data.action,
    severity: data.severity || 'info',
    timestamp: new Date().toISOString(),
  };

  try {
    await addDoc(collection(db, 'activities'), activityData);
  } catch (error) {
    console.warn("Activity logging failed silently:", error);
  }
}
