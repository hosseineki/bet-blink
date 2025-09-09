import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size="large" color="#ffd700" />
            </LinearGradient>
        );
    }

    if (!isAuthenticated) {
        // In a real app, you would redirect to sign-in screen
        // For now, we'll just return null
        return null;
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
