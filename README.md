# BetBlink - Online Gaming Platform

## Overview
BetBlink is a comprehensive online gaming and betting platform built with React Native and TypeScript. The app provides a secure, user-friendly experience for gaming enthusiasts with features including user authentication, multi-stage registration, and seamless integration with backend services.

## Features

### 🎮 Gaming Platform
- Modern, responsive mobile interface
- Secure user authentication and authorization
- Multi-stage registration process with validation
- Biometric login support for enhanced security
- Real-time gaming experience

### 🔐 Authentication System
- **Sign Up**: Multi-step registration process
  - Personal credentials (email, phone, password)
  - Profile information (date of birth, gender, preferences)
  - Address verification (search or manual entry)
  - Payment method setup
  - Email/SMS verification
- **Sign In**: Secure login with optional biometric authentication
- **Protected Routes**: Dashboard and gaming areas accessible only after authentication

### 🏗️ Technical Architecture
- **Frontend**: React Native with TypeScript
- **Backend**: Bun runtime with Hono framework
- **Database**: Firebase Firestore
- **Authentication**: JWT tokens with refresh mechanism
- **State Management**: React Context API
- **Navigation**: React Navigation with protected routes

### 📱 Mobile Features
- Cross-platform compatibility (iOS/Android)
- Animated SVG logo with custom animations
- Responsive design with gradient backgrounds
- Modal-based date pickers and country selection
- Form validation with real-time error feedback
- Environment-based API configuration (emulator/physical device)

### 🚀 Backend API
- RESTful API with public and protected routes
- User registration and authentication endpoints
- Data validation using Zod schemas
- CORS support for cross-origin requests
- Firebase integration for user data management

## Project Structure

```
BetBlink/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript definitions
│   │   └── config/        # API configuration
│   └── assets/            # Images and icons
├── server/                # Bun backend server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth & validation
│   │   └── config/        # Firebase configuration
│   └── scripts/           # Utility scripts
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- Bun runtime
- Expo CLI
- Firebase project setup

### Mobile App Setup
```bash
cd mobile
npm install
# Create .env file (see ENVIRONMENT_SETUP.md)
expo start
```

### Backend Setup
```bash
cd server
bun install
# Configure Firebase (see server/FIREBASE_SETUP.md)
bun run dev
```

## Environment Configuration

The app supports switching between development (emulator) and production (physical device) environments:

- **Emulator**: `http://10.0.2.2:3001` (for Android emulator)
- **Physical Device**: `https://webapi3.progressplay.net` (production API)

Configure in `mobile/.env`:
```env
IS_MOBILE=true  # true for physical device, false for emulator
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Secure API endpoints with middleware validation
- Firebase security rules
- Input validation and sanitization
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ using React Native, TypeScript, and Bun**