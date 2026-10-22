# Piwo

**Piwo** is an Expo (React Native) app I built in my free time for a hobby group I'm part of. It helps everyone easily keep track of their availability for group activities. It runs on Android and web.

## ✨ Features

- 🗓️ Track member availability for upcoming events
- 🔐 Firebase Authentication (Email/Password)
- ☁️ Cloud Firestore for real-time data storage
- 📱 Android APK + web (Firebase Hosting)

## 🚀 Tech Stack

- **Expo / React Native** — cross-platform UI
- **Expo Router** — file-based routing
- **React Native Firebase** — auth & Firestore
- **Zustand** — state management
- **React Query** — server-state caching
- **Unistyles** — styling
- **Firebase Hosting** — web deployment

## 🔧 Getting Started

To run this project locally:

```bash
git clone https://github.com/j-vseg/piwo.git
cd piwo
pnpm install
pnpm run prebuild
pnpm run android   # run on Android
pnpm run web       # run on web
```

Make sure to:

- Set up Firebase for Web and Android in your Firebase Console
- Configure your Firebase credentials (e.g. environment variables or Firebase config)
- Place `google-services.json` in the `google-services/` directory

## 🚢 Release process

Follow these steps when you are ready to ship a new version to production.

1. **Generate release notes** — Run the `release-notes-and-features` skill to generate the GitHub release notes, update the in-app "What's New" list, and update the About App features if applicable.

2. **Run the release script** — Run `pnpm run release:prod`. The script lets you choose the release type:
   - **Android release** — prompts for version and version code, runs prebuild, builds a signed APK
   - **Web release** — generates the service worker, builds the web export, and deploys to Firebase Hosting
   - **Both** — runs both Android and web releases in sequence

   For production releases, the script also commits the version bump and creates a draft GitHub release (with the APK attached if Android was built).

3. **Publish the GitHub release** — Add the generated release notes to the draft release on GitHub and publish it.

## 📁 Project Structure

```
src/
  ├── app/            # Expo Router pages and layouts
  ├── components/     # Reusable UI components
  ├── constants/      # App-wide constants
  ├── domains/        # Feature modules (home, login, manage, settings, sign-up, verify)
  ├── hooks/          # Custom React hooks
  ├── services/       # Firebase and other API integrations
  ├── store/          # Zustand stores
  ├── themes/         # Unistyles theme definitions
  ├── translations/   # i18n translation files
  └── utils/          # Helper functions
scripts/
  └── release.sh            # Release script (Android, web, or both)
```

## 🤝 Contributions

This project was built for personal use, but feel free to fork it or suggest improvements!

## 📃 License

MIT – use it freely.
