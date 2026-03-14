# Parkeerapp

Mobiele app (iOS & Android) voor het beheren van 10 gedeelde parkeerplekken verdeeld over 2 garages.

## Vereisten

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- Firebase-project (gratis): [console.firebase.google.com](https://console.firebase.google.com)

## Installatie

```bash
cd parking-app
npm install
cp .env.example .env
# Vul je Firebase-gegevens in .env
```

## Firebase instellen

1. Maak een nieuw project aan op [Firebase Console](https://console.firebase.google.com)
2. Activeer **Firestore Database** (start in productie-modus)
3. Activeer **Authentication** → schakel **Anoniem** in
4. Ga naar Project Settings → Your apps → voeg een Web-app toe → kopieer de config naar `.env`
5. Voer het seed-script eenmalig uit om de 10 plekken aan te maken:
   ```bash
   node scripts/seed-firestore.js
   ```

## GPS-coördinaten instellen

Open `src/config/garage.ts` en vul de echte coördinaten in van beide garages.
Gebruik Google Maps: klik op de ingang van de garage → coördinaten kopiëren.

Aanbevolen radius: start met **80 meter**, test op locatie en pas aan.

## App starten

```bash
npx expo start
```

Scan de QR-code met de **Expo Go** app op je telefoon.

## Bouwen voor distributie (TestFlight / Play Store)

```bash
npx eas build --platform ios
npx eas build --platform android
```

Zie [Expo EAS Build docs](https://docs.expo.dev/build/introduction/) voor details.

## Structuur

| Map | Inhoud |
|-----|--------|
| `src/config/` | Firebase + GPS-configuratie |
| `src/tasks/` | Achtergrond geofencing taak |
| `src/services/` | Auth, Firestore, Notificaties |
| `src/hooks/` | React hooks voor data en geofencing |
| `src/screens/` | Login, Home, Parkeren, Vertrekken |
| `src/components/` | SpotGrid, GarageSection |
| `scripts/` | Eenmalig Firestore seed-script |
