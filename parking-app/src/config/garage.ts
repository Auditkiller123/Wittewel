// GPS-coördinaten van beide garages.
// Pas de latitude/longitude aan na meting op locatie.
// Gebruik Google Maps: klik op de ingang van de garage → coördinaten kopiëren.

export interface GarageConfig {
  id: 'boven' | 'binnen';
  label: string;
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number; // meters — begin met 80, pas aan na test op locatie
  totalSpots: number;
}

export const GARAGES: GarageConfig[] = [
  {
    id: 'boven',
    label: 'Garage Boven',
    identifier: 'GARAGE_BOVEN',
    latitude: 52.370216,   // TODO: vervang met echte coördinaten
    longitude: 4.895168,   // TODO: vervang met echte coördinaten
    radius: 80,
    totalSpots: 4,
  },
  {
    id: 'binnen',
    label: 'Garage Binnen',
    identifier: 'GARAGE_BINNEN',
    latitude: 52.370300,   // TODO: vervang met echte coördinaten
    longitude: 4.895250,   // TODO: vervang met echte coördinaten
    radius: 80,
    totalSpots: 6,
  },
];

export function getGarageByIdentifier(identifier: string): GarageConfig | undefined {
  return GARAGES.find(g => g.identifier === identifier);
}

export function getGarageById(id: 'boven' | 'binnen'): GarageConfig {
  return GARAGES.find(g => g.id === id)!;
}
