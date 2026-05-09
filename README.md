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

## 🚢 Preparing a release

Follow these steps when you are ready to ship a new version to production.

1. **Bump the “What’s new” version** — In `src/components/WhatsNewOverlay/WhatsNewOverlay.tsx`, update the `WHATS_NEW_VERSION` semver string (for example `"2.1.0"`). This controls when users see the post-update sheet again after they last tapped “Begrepen”.

2. **Update the in-app release notes** — Edit the copy in `src/components/WhatsNewOverlay/WhatsNewCard.tsx` so it matches what you want users to read in the popup and on the settings “what is new” screen.

3. **Update the changelog** — Add a `## [x.y.z] - YYYY-MM-DD` section to `CHANGELOG.md` (Keep a Changelog style), with `### Added`, `### Changed`, and/or `### Fixed` bullets as appropriate.

4. **Align `package.json` with the release** — Set the top-level `"version"` field in `package.json` to the same semver as the release (for example `2.1.0`, without a `v` prefix), so it matches `WHATS_NEW_VERSION`, the changelog heading, and the Git tag.

5. **Push to `main`** — Commit your changes, push the branch to GitHub (for example `git push origin main`).

6. **Tag the release on GitHub** — Create an annotated or lightweight Git tag for the same version (for example `v2.1.0`), push it with `git push origin v2.1.0`, and optionally publish a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) from that tag.

7. **Deploy to Firebase** — From the project root, run `firebase deploy` (or your usual Hosting / rules deploy command) so production serves the new build.

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
