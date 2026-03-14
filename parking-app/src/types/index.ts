export type GarageId = 'boven' | 'binnen';
export type SpotStatus = 'free' | 'occupied';

export interface ParkingSpot {
  spotId: string;
  garage: GarageId;
  spotNumber: number;
  status: SpotStatus;
  occupiedBy: string | null;
  occupiedByName: string | null;
  occupiedSince: Date | null;
  expectedUntil: Date | null;
  updatedAt: Date;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
}

export type GeofenceEventType = 'ENTER' | 'EXIT';

export interface GeofenceTaskData {
  eventType: GeofenceEventType;
  region: {
    identifier: string;
  };
}
