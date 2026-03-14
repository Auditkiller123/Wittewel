import * as Location from 'expo-location';
import { GARAGES } from '../config/garage';
import { GEOFENCE_TASK } from '../tasks/geofenceTask';

export function useGeofence() {
  const startGeofencing = async (): Promise<void> => {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== 'granted') {
      throw new Error('Locatiepermissie geweigerd. Geef de app toegang tot je locatie in de instellingen.');
    }

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== 'granted') {
      throw new Error('Achtergrond-locatiepermissie geweigerd. Geef de app "Altijd" toegang tot locatie in de instellingen.');
    }

    const isActive = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (isActive) return;

    await Location.startGeofencingAsync(
      GEOFENCE_TASK,
      GARAGES.map(g => ({
        identifier: g.identifier,
        latitude: g.latitude,
        longitude: g.longitude,
        radius: g.radius,
        notifyOnEnter: true,
        notifyOnExit: true,
      }))
    );
  };

  const stopGeofencing = async (): Promise<void> => {
    const isActive = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (isActive) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK);
    }
  };

  return { startGeofencing, stopGeofencing };
}
