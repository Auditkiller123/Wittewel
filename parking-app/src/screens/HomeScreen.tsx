import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useParkingSpots } from '../hooks/useParkingSpots';
import { findSpotByUser, releaseSpot } from '../services/firestore';
import GarageSection from '../components/GarageSection';
import { AppUser } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  user: AppUser;
};

export default function HomeScreen({ navigation, user }: Props) {
  const { spots, spotsForGarage, totalFree, loading } = useParkingSpots();
  const mySpot = findSpotByUser(spots, user.uid);

  const handleLeave = useCallback(() => {
    if (!mySpot) return;
    Alert.alert(
      'Ga je weg?',
      `Plek ${mySpot.spotNumber} in ${mySpot.garage === 'boven' ? 'Garage Boven' : 'Garage Binnen'} wordt vrijgegeven.`,
      [
        { text: 'Nee', style: 'cancel' },
        {
          text: 'Ja, ik ga weg',
          style: 'destructive',
          onPress: async () => {
            try {
              await releaseSpot(mySpot.spotId);
            } catch {
              Alert.alert('Fout', 'Kon plek niet vrijgeven. Probeer opnieuw.');
            }
          },
        },
      ]
    );
  }, [mySpot]);

  const handlePark = useCallback((garageId: 'boven' | 'binnen') => {
    navigation.navigate('ParkingConfirm', { garageId });
  }, [navigation]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} />}
    >
      {/* Totaal overzicht */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalNumber}>{totalFree}</Text>
        <Text style={styles.totalLabel}>van 10 plekken vrij</Text>
      </View>

      {/* Mijn plek */}
      {mySpot && (
        <View style={styles.mySpotCard}>
          <View>
            <Text style={styles.mySpotTitle}>Jouw plek</Text>
            <Text style={styles.mySpotInfo}>
              Plek {mySpot.spotNumber} · {mySpot.garage === 'boven' ? 'Garage Boven' : 'Garage Binnen'}
            </Text>
            {mySpot.expectedUntil && (
              <Text style={styles.mySpotTime}>
                Verwacht weg om {mySpot.expectedUntil.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
            <Text style={styles.leaveButtonText}>Ik ga weg</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Garage Boven */}
      <GarageSection
        label="Garage Boven"
        spots={spotsForGarage('boven')}
        currentUid={user.uid}
      />

      {/* Garage Binnen */}
      <GarageSection
        label="Garage Binnen"
        spots={spotsForGarage('binnen')}
        currentUid={user.uid}
      />

      {/* Handmatig parkeren (als geofence mist) */}
      {!mySpot && (
        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Handmatig parkeren</Text>
          <View style={styles.manualButtons}>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => handlePark('boven')}
            >
              <Text style={styles.manualButtonText}>Garage Boven</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => handlePark('binnen')}
            >
              <Text style={styles.manualButtonText}>Garage Binnen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  totalBanner: {
    backgroundColor: '#1a73e8',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  mySpotCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#1a73e8',
  },
  mySpotTitle: {
    fontSize: 13,
    color: '#1a73e8',
    fontWeight: '600',
    marginBottom: 2,
  },
  mySpotInfo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  mySpotTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  leaveButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  leaveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  manualSection: {
    marginTop: 8,
  },
  manualTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  manualButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  manualButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
