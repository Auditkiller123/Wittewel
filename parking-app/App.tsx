// BELANGRIJK: geofenceTask MOET als eerste worden geïmporteerd,
// zodat TaskManager.defineTask is geregistreerd vóór de navigator laadt.
import './src/tasks/geofenceTask';

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './src/hooks/useAuth';
import { useGeofence } from './src/hooks/useGeofence';
import { configureNotificationHandler, requestNotificationPermissions } from './src/services/notifications';
import LoginScreen from './src/screens/LoginScreen';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import { AppUser } from './src/types';

configureNotificationHandler();

export default function App() {
  const { firebaseUser, profile, loading, initialize, setProfile } = useAuth();
  const { startGeofencing } = useGeofence();
  const [initializing, setInitializing] = useState(true);

  // Anoniem inloggen bij eerste start
  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        initialize().finally(() => setInitializing(false));
      } else {
        setInitializing(false);
      }
    }
  }, [loading, firebaseUser]);

  // Start geofencing nadat profiel beschikbaar is
  useEffect(() => {
    if (!profile) return;

    (async () => {
      try {
        await requestNotificationPermissions();
        await startGeofencing();
      } catch (e: any) {
        Alert.alert('Locatiepermissie', e.message);
      }
    })();
  }, [profile]);

  // Navigeer naar juist scherm bij tikken op notificatie
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const { action, garageId } = response.notification.request.content.data ?? {};
      if (action === 'ENTER_GARAGE' && garageId) {
        navigationRef.navigate('ParkingConfirm', { garageId });
      }
      if (action === 'EXIT_GARAGE') {
        navigationRef.navigate('LeavingConfirm');
      }
    });
    return () => sub.remove();
  }, []);

  if (loading || initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!firebaseUser) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!profile) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen
          uid={firebaseUser.uid}
          onComplete={(user: AppUser) => setProfile(user)}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator user={profile} />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
});
