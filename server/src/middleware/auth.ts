import { Context, Next } from 'hono';
import { verify } from 'jsonwebtoken';
import { db } from '../config/firebase';
import { JwtPayload, User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthContext extends Context {
  user?: User;
}

export async function authMiddleware(c: AuthContext, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: 'Access token required',
      }, 401);
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    
    // Get user from Firestore
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    const userData = userDoc.data();
    const user: User = {
      id: userDoc.id,
      ...userData,
    } as User;

    // Attach user to context
    c.user = user;
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return c.json({
        success: false,
        message: 'Invalid token',
      }, 401);
    }
    
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return c.json({
        success: false,
        message: 'Token expired',
      }, 401);
    }

    return c.json({
      success: false,
      message: 'Authentication failed',
    }, 401);
  }
}
