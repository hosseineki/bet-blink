# BetBlink API Server

A high-performance REST API server built with Bun, TypeScript, and Firebase for the BetBlink gaming application.

## Features

- 🚀 **Bun Runtime** - Ultra-fast JavaScript runtime
- 🔒 **Authentication & Authorization** - JWT-based auth with refresh tokens
- 🔥 **Firebase Integration** - Firestore database and Firebase Auth
- ✅ **Request Validation** - Zod schema validation
- 🛡️ **Type Safety** - Full TypeScript support
- 🎯 **RESTful API** - Clean and consistent API design
- 🔐 **Protected Routes** - Middleware-based route protection

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono (lightweight web framework)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth + JWT
- **Validation**: Zod
- **Language**: TypeScript

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── validation.ts        # Request validation middleware
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── protected.ts         # Protected routes
│   │   └── public.ts            # Public routes
│   ├── services/
│   │   └── auth.ts              # Authentication service
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── validation/
│   │   └── schemas.ts           # Zod validation schemas
│   └── index.ts                 # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install dependencies**:
   ```bash
   cd server
   bun install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

4. **Configure Firebase**:
   - Create a Firebase project
   - Generate a service account key
   - Add the credentials to your `.env` file

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

## Running the Server

### Development
```bash
bun run dev
```

### Production
```bash
bun run start
```

### Build
```bash
bun run build
```

## API Endpoints

### Public Routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

#### Public Information
- `GET /api/health` - Health check
- `GET /api/info` - Server information
- `GET /api/games` - Available games
- `GET /api/games/:id/rules` - Game rules
- `GET /api/terms` - Terms and conditions
- `GET /api/privacy` - Privacy policy

### Protected Routes (Require Authentication)

#### User Profile
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile
- `POST /api/protected/logout` - Logout user

#### Dashboard & Games
- `GET /api/protected/dashboard` - Get dashboard data
- `GET /api/protected/games` - Get user games
- `GET /api/protected/games/history` - Get game history
- `POST /api/protected/games/:id/bet` - Place a bet
- `GET /api/protected/wallet` - Get wallet/balance

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login/Register** - Returns access token and refresh token
2. **Access Token** - Short-lived (15 minutes) for API requests
3. **Refresh Token** - Long-lived (7 days) for getting new access tokens
4. **Authorization Header** - Include `Bearer <access_token>` in requests

### Example Request
```bash
curl -H "Authorization: Bearer your-access-token" \
     http://localhost:3001/api/protected/profile
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

## Validation

All requests are validated using Zod schemas:

- **Request Body** - Validated against defined schemas
- **Query Parameters** - Validated for type safety
- **Error Messages** - Detailed validation error responses

## Database Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank_transfer';
    // ... payment-specific fields
  };
  password: string; // hashed
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Development

### Adding New Routes

1. **Create route file** in `src/routes/`
2. **Add validation schemas** in `src/validation/schemas.ts`
3. **Import and use** in `src/index.ts`

### Adding Middleware

1. **Create middleware** in `src/middleware/`
2. **Apply to routes** as needed
3. **Update types** if necessary

### Testing

```bash
bun test
```

## Deployment

### Using Bun
```bash
bun run build
bun run start
```

### Using Docker
```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3001
CMD ["bun", "run", "start"]
```

## Security Considerations

- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Firebase security rules (configure separately)

## Performance

- 🚀 Bun's ultra-fast runtime
- ⚡ Hono's lightweight framework
- 🔥 Firebase's scalable database
- 📦 Minimal dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
