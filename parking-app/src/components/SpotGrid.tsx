import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ParkingSpot } from '../types';

interface Props {
  spots: ParkingSpot[];
  currentUid: string;
}

export default function SpotGrid({ spots, currentUid }: Props) {
  return (
    <View style={styles.grid}>
      {spots.map(spot => {
        const isOccupied = spot.status === 'occupied';
        const isMe = spot.occupiedBy === currentUid;
        return (
          <View
            key={spot.spotId}
            style={[
              styles.spot,
              isOccupied && styles.spotOccupied,
              isMe && styles.spotMe,
            ]}
          >
            <Text style={[styles.spotNumber, isOccupied && styles.spotTextOccupied]}>
              {spot.spotNumber}
            </Text>
            {isOccupied && spot.occupiedByName ? (
              <Text style={styles.name} numberOfLines={1}>
                {isMe ? 'Jij' : spot.occupiedByName.split(' ')[0]}
              </Text>
            ) : (
              <Text style={styles.free}>Vrij</Text>
            )}
            {isOccupied && spot.expectedUntil && (
              <Text style={styles.time}>
                t/m {formatTime(spot.expectedUntil)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  spot: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#81c784',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  spotOccupied: {
    backgroundColor: '#fce4ec',
    borderColor: '#e57373',
  },
  spotMe: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1a73e8',
    borderWidth: 2.5,
  },
  spotNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  spotTextOccupied: {
    color: '#c62828',
  },
  name: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
  },
  free: {
    fontSize: 11,
    color: '#388e3c',
    fontWeight: '500',
    marginTop: 2,
  },
  time: {
    fontSize: 9,
    color: '#888',
    marginTop: 1,
  },
});
