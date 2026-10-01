# Installation & Release Guide

## Prerequisites

- Node.js and npm
- For local native runs: Xcode (iOS Simulator) and/or Android Studio (emulator or USB device)
- Expo account and EAS CLI for cloud builds (`npm i -g eas-cli` or use `npx eas`)
- Apple Developer account and App Store Connect access (iOS submit)
- Google Play Console access (Android manual upload)

---

## 1. Clone

```bash
git clone https://github.com/aju-alen/StudentMobileRN.git
cd StudentMobileRN
```

---

## 2. API (`api/`)

```bash
cd api
npm install
```

Copy the sample env and fill in your values:

```bash
cp sample.env .env
```

This API uses Prisma with MySQL. Ensure `DATABASE_URL` and `SHADOW_DATABASE_URL` are set in `.env`, then generate the Prisma client:

```bash
npx prisma generate
```

If you need a fresh database schema, run migrations as appropriate for your environment (`npx prisma migrate deploy` or `npx prisma migrate dev`).

Start the server (defaults to port `3000` unless `PORT` is set):

```bash
npm run start
```

---

## 3. Client (`client/`) — install & local native run

```bash
cd client
npm install
```

Copy the sample env and fill in your values:

```bash
cp sample.env .env
```

### Local API URL

Edit `client/app/utils/utils.js` and set `ipURL`:

- Physical device on the same network: `http://<YOUR-LAN-IP>:3000`
- Simulator/emulator talking to API on the same machine: `http://localhost:3000` (Android emulator may need `http://10.0.2.2:3000`)
- Production API (already present in code): `https://api.coachacadem.ae`

On macOS, get your LAN IP with:

```bash
ipconfig getifaddr en0
```

### Run on iOS Simulator

Requires Xcode and an available simulator:

```bash
npm run ios
# or
npx expo run:ios
```

This builds the native app, installs it, and launches the iOS Simulator.

### Run on Android Emulator / device

Requires Android SDK and a running emulator or connected device:

```bash
npm run android
# or
npx expo run:android
```

This builds the native app, installs it, and launches on the emulator/device.

### Metro only (after a native binary exists)

```bash
npm start
# or
npx expo start
```

This project uses `expo-dev-client`. Prefer `expo run:ios` / `expo run:android` over Expo Go when you need full native modules.

---

## 4. EAS Build (`client/`, profile `production`)

```bash
cd client
eas login
```

The EAS project is already linked via `app.json` / `eas.json`.

Build for iOS:

```bash
eas build --platform ios --profile production
```

Build for Android:

```bash
eas build --platform android --profile production
```

Build both:

```bash
eas build --platform all --profile production
```

When complete, download artifacts from the Expo / EAS dashboard.

---

## 5. EAS Submit — iOS

After a successful iOS production build:

```bash
cd client
eas submit --platform ios --profile production
```

This uses the iOS fields in `eas.json` under `submit.production` (`appleId`, `ascAppId`, `appleTeamId`).

Then finish the App Store Connect listing and submit for review (screenshots, privacy, version metadata, etc.) in Apple’s console if anything remains incomplete.

---

## 6. Google Play — manual submit

Android Play submission is **manual** (not via `eas submit` in this workflow).

1. Download the production Android artifact (AAB preferred) from the EAS build page.
2. Open [Google Play Console](https://play.google.com/console) for the app (`com.rise.coachacadem`).
3. Create or select a release track (internal, closed, open, or production).
4. Upload the AAB manually.
5. Complete store listing, content rating, privacy policy, and any required declarations.
6. Roll out / submit the release for review.

---

## 7. App Store — post-submit

After EAS submit (or after uploading a build in App Store Connect):

1. Open App Store Connect for Coach Academ (`com.rise.coachacadem`).
2. Attach the build to a version (TestFlight and/or App Store).
3. Complete required metadata and submit for App Review when ready.

---

## 8. Landing site (`nextjs-web-landing/`)

```bash
cd nextjs-web-landing
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional production-like local serve:

```bash
npm run build
npm start
```
