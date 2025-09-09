import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
    navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps): React.JSX.Element {
    const { user, signOut } = useAuth();

    const handleSignOut = (): void => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Welcome' }],
                        });
                    },
                },
            ]
        );
    };

    const handlePlayGame = (): void => {
        navigation.navigate('Game');
    };

    const menuItems = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: 'person-outline',
            color: '#4CAF50',
            onPress: () => Alert.alert('Profile', 'Profile settings would open here'),
        },
        {
            id: 'wallet',
            title: 'Wallet',
            icon: 'wallet-outline',
            color: '#ffd700',
            onPress: () => Alert.alert('Wallet', 'Wallet would open here'),
        },
        {
            id: 'history',
            title: 'Game History',
            icon: 'time-outline',
            color: '#2196F3',
            onPress: () => Alert.alert('History', 'Game history would open here'),
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
            color: '#9C27B0',
            onPress: () => Alert.alert('Settings', 'Settings would open here'),
        },
        {
            id: 'support',
            title: 'Support',
            icon: 'help-circle-outline',
            color: '#FF9800',
            onPress: () => Alert.alert('Support', 'Support would open here'),
        },
        {
            id: 'about',
            title: 'About',
            icon: 'information-circle-outline',
            color: '#607D8B',
            onPress: () => Alert.alert('About', 'About information would open here'),
        },
    ];

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color="#1a1a2e" />
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>
                                {user?.firstName} {user?.lastName}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Ionicons name="log-out-outline" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Quick Stats</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Ionicons name="trophy" size={24} color="#ffd700" />
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Games Won</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="cash" size={24} color="#4CAF50" />
                            <Text style={styles.statValue}>$0.00</Text>
                            <Text style={styles.statLabel}>Total Winnings</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="time" size={24} color="#2196F3" />
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Games Played</Text>
                        </View>
                    </View>
                </View>

                {/* Play Game Button */}
                <View style={styles.playGameContainer}>
                    <TouchableOpacity style={styles.playGameButton} onPress={handlePlayGame}>
                        <LinearGradient
                            colors={['#ffd700', '#ffed4e']}
                            style={styles.playGameButtonGradient}
                        >
                            <Ionicons name="play" size={32} color="#1a1a2e" />
                            <Text style={styles.playGameButtonText}>Play Game</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.menuGrid}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={item.onPress}
                            >
                                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.activityContainer}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <Ionicons name="information-circle" size={20} color="#ffd700" />
                        <Text style={styles.activityText}>
                            Welcome to your dashboard! Start playing games to see your activity here.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffd700',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: '#b0b0b0',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    signOutButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    statsContainer: {
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#b0b0b0',
        marginTop: 4,
        textAlign: 'center',
    },
    playGameContainer: {
        marginBottom: 30,
    },
    playGameButton: {
        width: '100%',
        height: 80,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    playGameButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    playGameButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginLeft: 12,
    },
    menuContainer: {
        marginBottom: 30,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: (width - 60) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    menuIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
    },
    activityContainer: {
        marginBottom: 30,
    },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
    },
    activityText: {
        flex: 1,
        fontSize: 14,
        color: '#b0b0b0',
        marginLeft: 12,
        lineHeight: 20,
    },
});
