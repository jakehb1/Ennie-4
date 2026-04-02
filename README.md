# Ennie — Measured Energy Healing Platform

A complete mobile + backend platform connecting patients with validated energy healers. Built with React Native (Expo) for iOS/Android and Express.js for the API, deployable to Railway.

## Architecture

```
Ennie-4/
├── mobile/              # React Native (Expo) app — iOS & Android
│   ├── src/
│   │   ├── screens/     # 35+ screens across patient, healer, admin flows
│   │   ├── components/  # Shared UI components (BodyMap, Timer, Chat, etc.)
│   │   ├── navigation/  # React Navigation stacks & tabs
│   │   ├── context/     # Auth + App state management
│   │   ├── services/    # API client
│   │   ├── theme/       # Design tokens & fonts
│   │   └── utils/       # Helpers, mock data, constants
│   ├── app.json         # Expo config (iOS + Android)
│   └── eas.json         # EAS Build config
├── backend/             # Express.js API server
│   ├── src/
│   │   ├── routes/      # Auth, Sessions, Queue, Healers, Groups, Payments, Admin
│   │   ├── models/      # In-memory data store
│   │   ├── middleware/   # JWT auth
│   │   └── config/      # Constants
│   ├── Dockerfile       # Railway deployment
│   └── railway.toml     # Railway config
└── railway.json         # Root Railway config
```

## Features

### Patient Flow
- AI-guided symptom intake with interactive body map
- Real-time queue with estimated wait times
- 30-minute live healing sessions with severity tracking
- Before/after comparison with improvement metrics
- 24-hour follow-up assessments
- Video testimonial recording with revenue sharing
- Group healing sessions (up to 30 participants)

### Healer Flow
- Multi-step onboarding with training simulation
- Specialization tracking (verified at 75%+ success rate)
- Smart patient matching with 5-second claim window
- Technique tracking during sessions
- Earnings dashboard with payout management
- Group session hosting

### Platform
- Tiered pricing: Free (test healers), $50-$350 (verified healers)
- Group subscriptions: $19.99/mo for 8 sessions
- Referral program: $25/patient, $500/healer
- Admin dashboard with live queue visualization
- UCI research consent integration

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env    # Configure JWT_SECRET
npm install
npm run dev             # Starts on http://localhost:3000
```

### Mobile App

```bash
cd mobile
npm install
npx expo start          # Scan QR with Expo Go app
```

### Build for iOS/Android

```bash
cd mobile
npx eas build --platform ios --profile preview
npx eas build --platform android --profile preview
```

## Deploy to Railway

### Option 1: Railway CLI
```bash
railway login
railway init
railway up
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Connect repo in Railway dashboard
3. Set root directory to `backend/`
4. Set environment variables:
   - `PORT=3000`
   - `JWT_SECRET=<your-secret>`
   - `NODE_ENV=production`

The backend auto-deploys on push with health checks at `/`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/signup | Create account |
| POST | /auth/login | Sign in |
| GET | /auth/me | Current user |
| POST | /sessions | Create session |
| GET | /sessions/:id | Get session |
| POST | /sessions/:id/end | End session |
| GET | /sessions/history/me | Session history |
| GET | /queue/status | Queue position |
| POST | /queue/join | Join queue |
| POST | /healers/onboard | Healer registration |
| GET | /healers/specializations | Skill data |
| POST | /healers/claim | Claim patient |
| GET | /groups | List group sessions |
| POST | /payments/create-intent | Start payment |
| GET | /admin/dashboard | System stats |

## Tech Stack

- **Mobile**: React Native, Expo, React Navigation, react-native-svg
- **Backend**: Express.js, JWT, in-memory store
- **Deploy**: Railway (Docker), EAS Build (iOS/Android)
- **Design**: Custom design system (Syne + DM Sans, purple accent)
