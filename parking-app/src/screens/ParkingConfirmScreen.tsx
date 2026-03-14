import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { claimSpot, findFirstFreeSpot } from '../services/firestore';
import { useParkingSpots } from '../hooks/useParkingSpots';
import { AppUser } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGarageById } from '../config/garage';

type Props = NativeStackScreenProps<RootStackParamList, 'ParkingConfirm'> & {
  user: AppUser;
};

export default function ParkingConfirmScreen({ navigation, route, user }: Props) {
  const { garageId } = route.params;
  const garage = getGarageById(garageId);
  const { spots } = useParkingSpots();

  const defaultTime = new Date();
  defaultTime.setHours(defaultTime.getHours() + 8);
  defaultTime.setMinutes(0);

  const [expectedUntil, setExpectedUntil] = useState(defaultTime);
  const [saving, setSaving] = useState(false);

  const freeSpot = findFirstFreeSpot(spots, garageId);

  const handleConfirm = async () => {
    if (!freeSpot) {
      Alert.alert('Geen vrije plekken', `${garage.label} is helaas vol.`);
      navigation.goBack();
      return;
    }
    setSaving(true);
    try {
      await claimSpot(freeSpot.spotId, user.uid, user.name, expectedUntil);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Fout', e.message);
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🚗</Text>
        <Text style={styles.title}>Parkeren in {garage.label}</Text>

        {freeSpot ? (
          <Text style={styles.spotInfo}>
            Toegewezen plek: <Text style={styles.bold}>Plek {freeSpot.spotNumber}</Text>
          </Text>
        ) : (
          <Text style={styles.noSpot}>Geen vrije plekken beschikbaar</Text>
        )}

        <Text style={styles.label}>Tot hoe laat verwacht je te blijven?</Text>

        <DateTimePicker
          value={expectedUntil}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => date && setExpectedUntil(date)}
          minuteInterval={15}
          locale="nl-NL"
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Annuleren</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, (!freeSpot || saving) && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={!freeSpot || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Bevestigen</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  spotInfo: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#1a73e8',
  },
  noSpot: {
    fontSize: 15,
    color: '#c62828',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    fontSize: 15,
    color: '#555',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
