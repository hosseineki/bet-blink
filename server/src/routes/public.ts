import { Hono } from 'hono';
import { validateQuery } from '../middleware/validation';
import { addressSearchSchema } from '../validation/schemas';
import { AddressSearchResult } from '../types';

const publicRoutes = new Hono();

// Health check endpoint
publicRoutes.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Get server info
publicRoutes.get('/info', (c) => {
  return c.json({
    success: true,
    data: {
      name: 'BetBlink API Server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
    message: 'Server information retrieved successfully',
  });
});

// Get available games (public info)
publicRoutes.get('/games', (c) => {
  const games = [
    {
      id: '1',
      name: 'Coin Flip',
      description: 'Simple Bet Blink with 50/50 odds',
      type: 'chance',
      minBet: 1,
      maxBet: 100,
      odds: 2.0,
      status: 'available',
    },
    {
      id: '2',
      name: 'Dice Roll',
      description: 'Roll a dice and win based on your prediction',
      type: 'chance',
      minBet: 5,
      maxBet: 500,
      odds: 6.0,
      status: 'available',
    },
  ];

  return c.json({
    success: true,
    data: { games },
    message: 'Available games retrieved successfully',
  });
});

// Get game rules
publicRoutes.get('/games/:gameId/rules', (c) => {
  const gameId = c.req.param('gameId');

  const gameRules = {
    '1': {
      name: 'Coin Flip',
      rules: [
        'Place a bet on either heads or tails',
        'Coin is flipped with 50/50 probability',
        'Win amount is 2x your bet if you guess correctly',
        'Lose your bet if you guess incorrectly',
      ],
      odds: '2.0x',
    },
    '2': {
      name: 'Dice Roll',
      rules: [
        'Predict which number (1-6) the dice will land on',
        'Each number has equal probability (1/6)',
        'Win amount is 6x your bet if you guess correctly',
        'Lose your bet if you guess incorrectly',
      ],
      odds: '6.0x',
    },
  };

  const rules = gameRules[gameId as keyof typeof gameRules];

  if (!rules) {
    return c.json({
      success: false,
      message: 'Game not found',
    }, 404);
  }

  return c.json({
    success: true,
    data: { rules },
    message: 'Game rules retrieved successfully',
  });
});

// Get terms and conditions
publicRoutes.get('/terms', (c) => {
  const terms = {
    title: 'Terms and Conditions',
    lastUpdated: '2024-01-01',
    sections: [
      {
        title: 'Acceptance of Terms',
        content: 'By using our service, you agree to be bound by these terms and conditions.',
      },
      {
        title: 'Age Requirement',
        content: 'You must be at least 18 years old to use our service.',
      },
      {
        title: 'Responsible Gaming',
        content: 'We promote responsible gaming. Please gamble responsibly and within your means.',
      },
      {
        title: 'Privacy Policy',
        content: 'Your privacy is important to us. Please review our privacy policy for information on how we collect and use your data.',
      },
    ],
  };

  return c.json({
    success: true,
    data: { terms },
    message: 'Terms and conditions retrieved successfully',
  });
});

// Get privacy policy
publicRoutes.get('/privacy', (c) => {
  const privacy = {
    title: 'Privacy Policy',
    lastUpdated: '2024-01-01',
    sections: [
      {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
      },
      {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services.',
      },
      {
        title: 'Information Sharing',
        content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.',
      },
    ],
  };

  return c.json({
    success: true,
    data: { privacy },
    message: 'Privacy policy retrieved successfully',
  });
});

// Address search endpoint
publicRoutes.get('/address/search', validateQuery(addressSearchSchema), (c) => {
  const { query, country } = c.get('validatedData');

  // Mock address search results - in a real app, this would call a geocoding service
  const mockAddresses: AddressSearchResult[] = [
    {
      id: '1',
      address: '184 Whitacres Road',
      city: 'Glasgow',
      postCode: 'G53 7ZP',
      country: country || 'United Kingdom',
      formattedAddress: '184 Whitacres Road, Glasgow, G53 7ZP, United Kingdom'
    },
    {
      id: '2',
      address: '184 High Street',
      city: 'Edinburgh',
      postCode: 'EH1 1QS',
      country: country || 'United Kingdom',
      formattedAddress: '184 High Street, Edinburgh, EH1 1QS, United Kingdom'
    },
    {
      id: '3',
      address: '184 Oxford Street',
      city: 'London',
      postCode: 'W1C 1JN',
      country: country || 'United Kingdom',
      formattedAddress: '184 Oxford Street, London, W1C 1JN, United Kingdom'
    },
    {
      id: '4',
      address: '184 George Street',
      city: 'Manchester',
      postCode: 'M1 4HE',
      country: country || 'United Kingdom',
      formattedAddress: '184 George Street, Manchester, M1 4HE, United Kingdom'
    },
    {
      id: '5',
      address: '184 Queen Street',
      city: 'Birmingham',
      postCode: 'B1 1AA',
      country: country || 'United Kingdom',
      formattedAddress: '184 Queen Street, Birmingham, B1 1AA, United Kingdom'
    }
  ];

  // Filter results based on query
  const filteredAddresses = mockAddresses.filter(addr =>
    addr.address.toLowerCase().includes(query.toLowerCase()) ||
    addr.city.toLowerCase().includes(query.toLowerCase()) ||
    addr.postCode.toLowerCase().includes(query.toLowerCase()) ||
    addr.formattedAddress.toLowerCase().includes(query.toLowerCase())
  );

  return c.json({
    success: true,
    data: { addresses: filteredAddresses },
    message: 'Address search completed successfully',
  });
});

export default publicRoutes;
