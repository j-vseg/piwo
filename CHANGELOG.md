# Changelog

All notable changes to Piwo are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-04-30

### Added

- Web app foundation: PWA, Firestore-backed data, theming, Next.js config, env example, web app manifest, Firebase Hosting, and documentation (@j-vseg).
- Events and calendar: availability and recurrence, “this week” and event details, dates and colours, filtering and calendar behaviour (including week start and random event colour), silent handling of past events, and cleanup of past availability (@j-vseg).
- Onboarding and accounts: onboarding flow, sign-up, login, verification, and editing personal details (#8) (@j-vseg).
- Navigation and layout: bottom navigation, padding and navigation fixes, empty states, title, back button and header tweaks, and home screen redesign (@j-vseg).
- In-app “What’s new” sheet with manual release notes (@j-vseg).

### Changed

- Performance and polish: query caching and `staleTime`, loading states, UI iteration, animation and spacing passes (@j-vseg).

### Fixed

- Account deletion (@j-vseg).
- Hydration, rendering, and typing issues; several bug-fix rounds including deletion-related problems (@j-vseg).
- More consistent, user-facing error handling (#7) (@j-vseg).
