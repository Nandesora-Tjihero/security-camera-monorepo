import type { DetectionRecord } from '../models/detection.model';
import type { ScUser } from '../models/user.model';
import type { ISubscription } from './billing.contract';

export interface IDatabaseService {
  createUser(user: ScUser): Promise<void>;
  getUserById(uid: string): Promise<ScUser | null>;

  getUserByEmail(email: string): Promise<{ uid: string; email: string } | null>;

  addDataToDocForUser(
    docId: string,
    userId: string,
    data: { [key: string]: any }
  ): Promise<void>;
  getDataFromDocForUser(
    docId: string,
    userId: string,
    key: string
  ): Promise<any> | null;

  saveCustomerId(userId: string, customerId: string): Promise<void>;
  saveUserSubscription(
    userId: string,
    subscription: ISubscription
  ): Promise<void>;
  getSubscription(userId: string): Promise<ISubscription | null>;
  hasUserUsedFreeTrial(userId: string): Promise<boolean>;

  saveDetectionForUser(
    userId: string,
    detection: DetectionRecord
  ): Promise<void>;
  getDetectionsByUser(
    userId: string,
    startTime?: number,
    endTime?: number,
    offset?: number,
    limit?: number
  ): Promise<DetectionRecord[]>;
}
