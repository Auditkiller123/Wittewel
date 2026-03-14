import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { releaseSpot, findSpotByUser } from '../services/firestore';
import { useParkingSpots } from '../hooks/useParkingSpots';
import { AppUser } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LeavingConfirm'> & {
  user: AppUser;
};

export default function LeavingConfirmScreen({ navigation, user }: Props) {
  const { spots } = useParkingSpots();
  const mySpot = findSpotByUser(spots, user.uid);
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (!mySpot) {
      navigation.goBack();
      return;
    }
    setLoading(true);
    try {
      await releaseSpot(mySpot.spotId);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Fout', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Ga je weg?</Text>

        {mySpot ? (
          <Text style={styles.info}>
            Plek {mySpot.spotNumber} in{' '}
            {mySpot.garage === 'boven' ? 'Garage Boven' : 'Garage Binnen'}{' '}
            wordt vrijgegeven.
          </Text>
        ) : (
          <Text style={styles.info}>
            Je hebt geen geregistreerde parkeerplek.
          </Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Nee, ik blijf</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, loading && styles.buttonDisabled]}
            onPress={handleLeave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Ja, ik ga weg</Text>
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
    marginBottom: 12,
  },
  info: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
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
    backgroundColor: '#e53935',
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
