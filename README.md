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

1. **Generate release notes** — Run the `release-notes` skill to generate the release note for GitHub and the in-app WhatsNewOverview component.

2. **Build the Android APK** — Run `pnpm run build:android:prod`. The script prompts for a version and version code, updates `app.json` and `package.json`, runs prebuild, builds a signed APK, commits the changes, and creates a draft GitHub release with the APK attached.

3. **Build the web export** — Run `pnpm run build:web:prod` to export the web app to the `dist/` directory.

4. **Deploy to Firebase** — Run `firebase deploy` to push the web build to Firebase Hosting.

5. **Publish the GitHub release** — Add the generated release notes to the draft release on GitHub and publish it.

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
  └── build-release-apk.sh  # Android release build + GitHub draft release
```

## 🤝 Contributions

This project was built for personal use, but feel free to fork it or suggest improvements!

## 📃 License

MIT – use it freely.
