import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

const protectedRoutes = new Hono();

// Apply auth middleware to all routes
protectedRoutes.use('*', authMiddleware);

// Example protected route - Get user dashboard data
protectedRoutes.get('/dashboard', async (c) => {
  try {
    const user = c.get('user');

    // Mock dashboard data - replace with actual data from your database
    const dashboardData = {
      user: user,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalWinnings: 0,
        currentBalance: 0,
      },
      recentActivity: [],
      notifications: [],
    };

    return c.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully',
    });
  } catch (error) {
    console.error('Dashboard error:', error);

    return c.json({
      success: false,
      message: 'Failed to retrieve dashboard data',
    }, 500);
  }
});

// Example protected route - Get user games
protectedRoutes.get('/games', async (c) => {
  try {
    const user = c.get('user');

    // Mock games data - replace with actual data from your database
    const games = [
      {
        id: '1',
        name: 'Coin Flip',
        type: 'chance',
        status: 'available',
        minBet: 1,
        maxBet: 100,
      },
      {
        id: '2',
        name: 'Dice Roll',
        type: 'chance',
        status: 'available',
        minBet: 5,
        maxBet: 500,
      },
    ];

    return c.json({
      success: true,
      data: { games },
      message: 'Games retrieved successfully',
    });
  } catch (error) {
    console.error('Games error:', error);

    return c.json({
      success: false,
      message: 'Failed to retrieve games',
    }, 500);
  }
});

// Example protected route - Get user game history
protectedRoutes.get('/games/history', async (c) => {
  try {
    const user = c.get('user');

    // Mock game history - replace with actual data from your database
    const gameHistory = [
      {
        id: '1',
        gameId: '1',
        gameName: 'Coin Flip',
        betAmount: 10,
        result: 'heads',
        winAmount: 20,
        timestamp: new Date().toISOString(),
      },
    ];

    return c.json({
      success: true,
      data: { gameHistory },
      message: 'Game history retrieved successfully',
    });
  } catch (error) {
    console.error('Game history error:', error);

    return c.json({
      success: false,
      message: 'Failed to retrieve game history',
    }, 500);
  }
});

// Example protected route - Place a bet
protectedRoutes.post('/games/:gameId/bet', async (c) => {
  try {
    const user = c.get('user');
    const gameId = c.req.param('gameId');
    const { betAmount, betType } = await c.req.json();

    // Mock bet placement - replace with actual betting logic
    const betResult = {
      id: Math.random().toString(36).substr(2, 9),
      gameId,
      userId: user!.id,
      betAmount,
      betType,
      result: Math.random() > 0.5 ? 'win' : 'lose',
      winAmount: Math.random() > 0.5 ? betAmount * 2 : 0,
      timestamp: new Date().toISOString(),
    };

    return c.json({
      success: true,
      data: { betResult },
      message: 'Bet placed successfully',
    });
  } catch (error) {
    console.error('Bet placement error:', error);

    return c.json({
      success: false,
      message: 'Failed to place bet',
    }, 500);
  }
});

// Example protected route - Get user wallet/balance
protectedRoutes.get('/wallet', async (c) => {
  try {
    const user = c.get('user');

    // Mock wallet data - replace with actual data from your database
    const wallet = {
      balance: 100.00,
      currency: 'USD',
      transactions: [
        {
          id: '1',
          type: 'deposit',
          amount: 50.00,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'bet',
          amount: -10.00,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return c.json({
      success: true,
      data: { wallet },
      message: 'Wallet data retrieved successfully',
    });
  } catch (error) {
    console.error('Wallet error:', error);

    return c.json({
      success: false,
      message: 'Failed to retrieve wallet data',
    }, 500);
  }
});

export default protectedRoutes;
