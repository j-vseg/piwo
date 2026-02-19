# Piwo
**Piwo** is a Next.js web app I built in my free time for a hobby group I'm part of. It helps everyone easily keep track of their availability for group activities.

## ✨ Features
- 🗓️ Track member availability for upcoming events
- 🔐 Firebase Authentication (Email/Password)
- ☁️ Cloud Firestore for real-time data storage
- 💻 Built with Next.js and React

## 🚀 Tech Stack
- **Next.js**
- **Firebase Authentication**
- **Cloud Firestore**

## 🔧 Getting Started
To run this project locally:

```bash
git clone https://github.com/j-vseg/piwo.git
cd piwo
pnpm dev
```

Make sure to:

- Set up Firebase for Web in your Firebase Console
- Configure your Firebase credentials (e.g. environment variables or Firebase config)

## 📁 Project Structure
```bash
src/
  ├── app/           # Next.js App Router pages and layouts
  ├── components/    # Reusable UI components
  ├── contexts/      # React contexts (auth, query provider, etc.)
  ├── domians/       # Feature modules (activity, home, login, onboarding, settings, sign-up)
  ├── services/      # Firebase and other API integrations
  ├── types/         # TypeScript types and models
  └── utils/         # Helper functions
README.md            # This file
```

## 🤝 Contributions
This project was built for personal use, but feel free to fork it or suggest improvements!

## 📃 License
MIT – use it freely.
