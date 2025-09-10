# Environment Configuration Setup

## Overview
This app supports switching between emulator and physical device API endpoints using environment variables.

## Setup Instructions

1. Create a `.env` file in the `mobile/` directory with the following content:

```env
# Environment Configuration
# Set to true for physical device, false for emulator
IS_MOBILE=true

# API Base URLs
EMULATOR_API_URL=http://10.0.2.2:3001
PHYSICAL_DEVICE_API_URL=https://webapi3.progressplay.net
```

2. Install dependencies:
```bash
cd mobile
npm install
```

3. For Android emulator, set `IS_MOBILE=false` in your `.env` file
4. For physical device, set `IS_MOBILE=true` in your `.env` file

## How it works

- When `IS_MOBILE=true`: Uses `PHYSICAL_DEVICE_API_URL` (https://webapi3.progressplay.net)
- When `IS_MOBILE=false`: Uses `EMULATOR_API_URL` (http://10.0.2.2:3001)

The API configuration is handled in `src/config/api.ts` and automatically switches URLs based on the environment variable.

## Usage in Components

```typescript
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

// Use in API calls
const response = await axios.post(buildApiUrl(API_ENDPOINTS.REGISTER_STEP_1), data);
```

## Available Endpoints

- `REGISTER_STEP_1`: `/api/auth/RegisterStep1`
- `LOGIN`: `/api/auth/login`
- `REFRESH_TOKEN`: `/api/auth/refresh`

Add more endpoints in `src/config/api.ts` as needed.
