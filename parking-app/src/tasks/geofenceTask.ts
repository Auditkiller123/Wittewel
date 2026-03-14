// BELANGRIJK: Dit bestand moet als EERSTE worden geïmporteerd in App.tsx,
// vóór elke navigator of component. TaskManager.defineTask moet op het
// hoogste niveau worden aangeroepen zodat het beschikbaar is wanneer het OS
// de app op de achtergrond herstart na een geofence-event.

import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { GeofenceTaskData } from '../types';
import { getGarageByIdentifier } from '../config/garage';

export const GEOFENCE_TASK = 'PARKING_GEOFENCE_TASK';

TaskManager.defineTask(GEOFENCE_TASK, ({ data, error }: TaskManager.TaskManagerTaskBody<GeofenceTaskData>) => {
  if (error) {
    console.error('[Geofence] Task error:', error);
    return;
  }

  const { eventType, region } = data;
  const garage = getGarageByIdentifier(region.identifier);

  if (!garage) return;

  if (eventType === 'ENTER') {
    Notifications.scheduleNotificationAsync({
      content: {
        title: garage.label,
        body: `Ben je aan het parkeren in ${garage.label}?`,
        data: { action: 'ENTER_GARAGE', garageId: garage.id },
        sound: true,
      },
      trigger: null,
    });
  }

  if (eventType === 'EXIT') {
    Notifications.scheduleNotificationAsync({
      content: {
        title: garage.label,
        body: 'Ga je weg?',
        data: { action: 'EXIT_GARAGE', garageId: garage.id },
        sound: true,
      },
      trigger: null,
    });
  }
});
