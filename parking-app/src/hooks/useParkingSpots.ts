import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ParkingSpot, GarageId } from '../types';

export function useParkingSpots() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'spots'), orderBy('garage'), orderBy('spotNumber'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updated: ParkingSpot[] = snapshot.docs.map(d => {
          const data = d.data();
          return {
            spotId: data.spotId,
            garage: data.garage as GarageId,
            spotNumber: data.spotNumber,
            status: data.status,
            occupiedBy: data.occupiedBy ?? null,
            occupiedByName: data.occupiedByName ?? null,
            occupiedSince: data.occupiedSince?.toDate() ?? null,
            expectedUntil: data.expectedUntil?.toDate() ?? null,
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
          };
        });
        setSpots(updated);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const spotsForGarage = (garageId: GarageId) =>
    spots.filter(s => s.garage === garageId);

  const freeCountForGarage = (garageId: GarageId) =>
    spots.filter(s => s.garage === garageId && s.status === 'free').length;

  const totalFree = spots.filter(s => s.status === 'free').length;

  return { spots, spotsForGarage, freeCountForGarage, totalFree, loading, error };
}
