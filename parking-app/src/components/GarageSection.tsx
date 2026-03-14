import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SpotGrid from './SpotGrid';
import { ParkingSpot } from '../types';

interface Props {
  label: string;
  spots: ParkingSpot[];
  currentUid: string;
}

export default function GarageSection({ label, spots, currentUid }: Props) {
  const free = spots.filter(s => s.status === 'free').length;
  const total = spots.length;
  const allFull = free === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.badge, allFull && styles.badgeFull]}>
          <Text style={[styles.badgeText, allFull && styles.badgeTextFull]}>
            {free} van {total} vrij
          </Text>
        </View>
      </View>
      <SpotGrid spots={spots} currentUid={currentUid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  badge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeFull: {
    backgroundColor: '#fce4ec',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
  },
  badgeTextFull: {
    color: '#c62828',
  },
});
