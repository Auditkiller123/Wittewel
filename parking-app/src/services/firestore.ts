import {
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GarageId, ParkingSpot } from '../types';

export async function claimSpot(
  spotId: string,
  uid: string,
  userName: string,
  expectedUntil: Date
): Promise<void> {
  await updateDoc(doc(db, 'spots', spotId), {
    status: 'occupied',
    occupiedBy: uid,
    occupiedByName: userName,
    occupiedSince: serverTimestamp(),
    expectedUntil: Timestamp.fromDate(expectedUntil),
    updatedAt: serverTimestamp(),
  });
}

export async function releaseSpot(spotId: string): Promise<void> {
  await updateDoc(doc(db, 'spots', spotId), {
    status: 'free',
    occupiedBy: null,
    occupiedByName: null,
    occupiedSince: null,
    expectedUntil: null,
    updatedAt: serverTimestamp(),
  });
}

export function findFirstFreeSpot(
  spots: ParkingSpot[],
  garageId: GarageId
): ParkingSpot | undefined {
  return spots.find(s => s.garage === garageId && s.status === 'free');
}

export function findSpotByUser(
  spots: ParkingSpot[],
  uid: string
): ParkingSpot | undefined {
  return spots.find(s => s.occupiedBy === uid);
}
