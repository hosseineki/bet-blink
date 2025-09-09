import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { User, SignUpData, LoginCredentials, AuthTokens, JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthService {
  // Generate JWT tokens
  static generateTokens(userId: string, email: string): AuthTokens {
    const accessToken = sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = sign(
      { userId, email },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: Date.now() + (15 * 60 * 1000), // 15 minutes in milliseconds
    };
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  static async register(userData: SignUpData): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userData.email));
      const existingUsers = await getDocs(q);

      if (!existingUsers.empty) {
        throw new Error('User with this email already exists');
      }

      // Create Firebase Auth user
      const firebaseUserCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const firebaseUser = firebaseUserCredential.user;

      // Hash password for storage
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user document
      const userDoc = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        paymentMethod: userData.paymentMethod,
        password: hashedPassword,
        isEmailVerified: firebaseUser.emailVerified,
        isPhoneVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        termsAccepted: userData.termsAccepted,
        marketingConsent: userData.marketingConsent || false,
        firebaseUid: firebaseUser.uid,
      };

      // Save to Firestore
      const userRef = await addDoc(usersRef, userDoc);

      // Create user object (without password)
      const user: User = {
        id: userRef.id,
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        phoneNumber: userDoc.phoneNumber,
        dateOfBirth: userDoc.dateOfBirth,
        address: userDoc.address,
        isEmailVerified: userDoc.isEmailVerified,
        isPhoneVerified: userDoc.isPhoneVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.email);

      return { user, tokens };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Authenticate with Firebase Auth
      const firebaseUserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseUser = firebaseUserCredential.user;

      // Find user in Firestore by Firebase UID
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('firebaseUid', '==', firebaseUser.uid));
      const userQuery = await getDocs(q);

      if (userQuery.empty) {
        throw new Error('User not found in database');
      }

      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      // Create user object (without password)
      const user: User = {
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        isEmailVerified: userData.isEmailVerified,
        isPhoneVerified: userData.isPhoneVerified,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.email);

      return { user, tokens };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    try {
      // Verify refresh token
      const decoded = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

      // Check if user still exists
      const userDoc = await db.collection('users').doc(decoded.userId).get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(decoded.userId, decoded.email);

      return { tokens };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();

      return {
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        isEmailVerified: userData.isEmailVerified,
        isPhoneVerified: userData.isPhoneVerified,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);

      const updatePayload = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updatePayload);

      // Get updated user
      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }
}
