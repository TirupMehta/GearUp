import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type LogAction =
  | 'STOCK_UPDATE'
  | 'CSV_UPLOADED'
  | 'PRICE_SIMULATED'
  | 'CAMPAIGN_GENERATED'
  | 'AI_SNAPSHOT'
  | 'AI_STRATEGY'
  | 'LOGIN'
  | 'LOGOUT';

export interface ActivityLogEntry {
  action: LogAction;
  detail: string;
  userEmail: string;
  uid: string;
  timestamp: any;
}

/**
 * Write one activity log entry under users/{uid}/activityLog
 */
export async function logActivity(
  uid: string,
  userEmail: string,
  action: LogAction,
  detail: string
): Promise<void> {
  try {
    await addDoc(collection(db, `users/${uid}/activityLog`), {
      action,
      detail,
      userEmail,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.warn('ActivityLogger: failed to write log', e);
  }
}
