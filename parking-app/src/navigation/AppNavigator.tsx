import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ParkingConfirmScreen from '../screens/ParkingConfirmScreen';
import LeavingConfirmScreen from '../screens/LeavingConfirmScreen';
import { AppUser, GarageId } from '../types';

export type RootStackParamList = {
  Home: undefined;
  ParkingConfirm: { garageId: GarageId };
  LeavingConfirm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

interface Props {
  user: AppUser;
}

export default function AppNavigator({ user }: Props) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a73e8' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Home"
          options={{ title: 'Parkeergarage' }}
        >
          {props => <HomeScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="ParkingConfirm"
          options={{ title: 'Parkeren', presentation: 'modal' }}
        >
          {props => <ParkingConfirmScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="LeavingConfirm"
          options={{ title: 'Vertrekken', presentation: 'modal' }}
        >
          {props => <LeavingConfirmScreen {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
