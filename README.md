# Piwo
**Piwo** is a Flutter web app I built in my free time for a hobby group I'm part of. It helps everyone easily keep track of their availability for group activities.

## ✨ Features
- 🗓️ Track member availability for upcoming events
- 🔐 Firebase Authentication (Email/Password)
- ☁️ Cloud Firestore for real-time data storage
- 💻 Built with Flutter for the web

## 🚀 Tech Stack
- **Flutter** (Web)
- **Firebase Authentication**
- **Cloud Firestore**

## 🔧 Getting Started
To run this project locally:

```bash
git clone https://github.com/j-vseg/piwo.git
cd piwo
flutter pub get
flutter run -d chrome
```

Make sure to:

- Set up Firebase for Web in your Firebase Console
- Add your `firebase_options.dart` using the [FlutterFire CLI](https://firebase.flutter.dev/docs/cli/)

## 📁 Project Structure
```bash
assets/             # Contains images, icons, and other static resources
lib/                # Contains all the Dart code for the app
  ├── config/       # Configuration files, including Firebase setup and other global settings
  ├── managers/     # Contains logic that manages state, such as event occurance
  ├── models/       # Defines data models (e.g., User, Event) that are used across the app
  ├── services/     # Contains classes for interacting with APIs, Firebase, etc.
  ├── views/        # UI-related components, such as pages/screens for the app
  ├── widgets/      # Reusable UI components (e.g., buttons, cards, forms)
README.md           # This file
```

## 🤝 Contributions
This project was built for personal use, but feel free to fork it or suggest improvements!

## 📃 License
MIT – use it freely.
