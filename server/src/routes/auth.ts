import { Hono } from 'hono';
import { AuthService } from '../services/auth';
import { loginSchema, signUpSchema, refreshTokenSchema, registerStep1Schema, registerStep2Schema } from '../validation/schemas';
import { validateBody } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono();

// ------------------------------------------ Register Steps Endpoint -----------------------------------------
auth.post('/RegisterStep1', validateBody(registerStep1Schema), async (c) => {
  try {
    const userData = c.get('validatedData');
    //const { user, tokens } = await AuthService.register(userData);

    if (!userData?.Email || !userData?.Password) return c.json({
      success: false,
      message: 'Email and password are required',
    }, 400);

    console.log('User data:', userData);

    const progressPlayResponse = await fetch('https://webapi3.progressplay.net/player/RegisterStep1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: userData?.Email,
        Password: userData?.Password,
        CellphoneNumber: userData?.PhoneNumber,
        ClickId: "",
        CountryId: 221,
        CurrencyId: 3,
        Dynamic: "",
        LanguageId: 254,
        PlatformType: 0,
        RegistrationPlayMode: 707,
        Tracker: "",
        UserAgent: "test",
        WelcomeBonusDesc: "Welcome Bonus 100% up to £200",
        WelcomeBonusDescSport: "Deposit Min. £10 and Get £10 Free Bet",
        WhiteLabelId: 277
      }),
    });

    const data = await progressPlayResponse.json();

    if (progressPlayResponse.status === 200) {
      console.log('Success: RegisterStep1 API call successful', data);
      return c.json({
        success: true,
        data: {
          // user,
          // tokens,
          // requiresVerification: !user.isEmailVerified,
        },
        message: 'User registered successfully',
      }, 200);
    } else {
      console.log('Error: RegisterStep1 API call failed, status was not 200');
    }

  } catch (error) {
    console.error('Registration error:', error);

    return c.json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    }, 400);
  }
});

auth.post('/RegisterStep2', validateBody(registerStep2Schema), async (c) => {

  const userData = c.get('validatedData');
  console.log('User data:', userData);

  try {
    const progressPlayResponse = await fetch('https://webapi3.progressplay.net/player/RegisterStep2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PlayerId: 9737199,
        Address: userData?.address.address,
        City: userData?.address.city,
        ZipCode: userData?.address.postCode,
        ProfessionId: 0,
        ProfessionName: "",
        CurrencyId: 3,
        PromotionCode: userData?.promotionCode | "",
        GenderID: 358,
        UserAgent: "test",
        savedData: {},
        PlayerCommunicationConsent: [{ "Id": 64579684, "PlayerId": 9737199, "PlayMode": 706, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579683, "PlayerId": 9737199, "PlayMode": 706, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }, { "Id": 64579688, "PlayerId": 9737199, "PlayMode": 707, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579687, "PlayerId": 9737199, "PlayMode": 707, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }, { "Id": 64579686, "PlayerId": 9737199, "PlayMode": 911, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579685, "PlayerId": 9737199, "PlayMode": 911, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }],
        Area: userData?.address.address.split(',')[1],
        BuildingNumber: userData?.address.address.split(',')[0],
        Street: userData?.address.address.split(',')[1],
        Company: "",
        FirstName: userData?.firstName,
        LastName: userData?.lastName,
        Gender: userData?.gender,
        Birthday: userData?.dateOfBirth,
        ReceivePartner: false,
        ReceiveEmail: false,
        ReceiveSMS: false,
        ReceivePhone: false,
        ReceivePost: false,
        ShowConsent: false,
        CommunicationConsents: [{ "Id": 64579684, "PlayerId": 9737199, "PlayMode": 706, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579683, "PlayerId": 9737199, "PlayMode": 706, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }, { "Id": 64579688, "PlayerId": 9737199, "PlayMode": 707, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579687, "PlayerId": 9737199, "PlayMode": 707, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }, { "Id": 64579686, "PlayerId": 9737199, "PlayMode": 911, "CommunicationChannel": -101, "Enabled": false, "IsDeleted": false }, { "Id": 64579685, "PlayerId": 9737199, "PlayMode": 911, "CommunicationChannel": -100, "Enabled": false, "IsDeleted": false }],
        HasMarketingConsentGrid: true
      }),
    });

    const data = await progressPlayResponse.json();

    if (progressPlayResponse.status === 200) {
      console.log('Success: RegisterStep2 API call successful', data);
      return c.json({
        success: true,
        data: {
          // user,
          // tokens,
          // requiresVerification: !user.isEmailVerified,
        },
        message: 'User registered successfully',
      }, 200);
    } else {
      console.log('Error: RegisterStep2 API call failed, status was not 200', data);
      // return c.json({
      //   success: false,
      //   message: data,
      // }, 400);
    }
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    }, 400);
  }
})

// Login endpoint
auth.post('/login', validateBody(loginSchema), async (c) => {
  try {
    const credentials: { email: string, password: string } = c.get('validatedData');
    // here I want to call third party api to login https://webapi3.progressplay.net/player/Login
    if (!credentials?.email || !credentials?.password) return c.json({
      success: false,
      message: 'Email and password are required',
    }, 400);

    const response = await fetch('https://webapi3.progressplay.net/player/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: credentials.email,
        Password: credentials.password,
        GameToken: '',
        LanguageID: 254,
        PlatformType: 750,
        PlayMode: 707,
        UserAgent: 'test',
        WhiteLabelId: 0
      }),
    });
    const data = await response.json();
    console.log('Login response:', data);

    // const { user, tokens } = await AuthService.login(credentials);
    return c.json({
      success: true,
      // data: {
      //     user,
      //     tokens,
      // },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);

    return c.json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    }, 401);
  }
});

// Refresh token endpoint
auth.post('/refresh', validateBody(refreshTokenSchema), async (c) => {
  try {
    const { refreshToken } = c.get('validatedData');
    const { tokens } = await AuthService.refreshToken(refreshToken);

    return c.json({
      success: true,
      data: { tokens },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    return c.json({
      success: false,
      message: error instanceof Error ? error.message : 'Token refresh failed',
    }, 401);
  }
});

// Protected routes (require authentication)

// Get current user profile
auth.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');

    return c.json({
      success: true,
      data: { user },
      message: 'Profile retrieved successfully',
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return c.json({
      success: false,
      message: 'Failed to retrieve profile',
    }, 500);
  }
});

// Update user profile
auth.put('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const updateData = await c.req.json();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, email, id, createdAt, ...allowedUpdates } = updateData;

    const updatedUser = await AuthService.updateUser(user!.id, allowedUpdates);

    return c.json({
      success: true,
      data: { user: updatedUser },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return c.json({
      success: false,
      message: error instanceof Error ? error.message : 'Profile update failed',
    }, 400);
  }
});

// Logout endpoint (client-side token removal)
auth.post('/logout', authMiddleware, async (c) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success and let the client handle token removal

    return c.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);

    return c.json({
      success: false,
      message: 'Logout failed',
    }, 500);
  }
});

export default auth;
