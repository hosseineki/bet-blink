import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

const { width, height } = Dimensions.get('window');

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
    navigation: GameScreenNavigationProp;
}

export default function GameScreen({ navigation }: GameScreenProps): React.JSX.Element {
    const [isFlipping, setIsFlipping] = useState<boolean>(false);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [score, setScore] = useState<number>(0);
    const [gameHistory, setGameHistory] = useState<Array<'heads' | 'tails'>>([]);

    const flipAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    const flipCoin = (): void => {
        if (isFlipping) return;

        setIsFlipping(true);
        setResult(null);

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Scale animation
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Flip animation
        Animated.timing(flipAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // Determine result
            const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
            setResult(coinResult);
            setGameHistory(prev => [...prev, coinResult]);

            // Update score (simple scoring system)
            if (coinResult === 'heads') {
                setScore(prev => prev + 1);
            }

            // Reset animation
            flipAnimation.setValue(0);
            setIsFlipping(false);

            // Success haptic
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        });
    };

    const resetGame = (): void => {
        Alert.alert(
            'Reset Game',
            'Are you sure you want to reset your score and history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setScore(0);
                        setGameHistory([]);
                        setResult(null);
                        flipAnimation.setValue(0);
                        scaleAnimation.setValue(1);
                    },
                },
            ]
        );
    };

    const goBack = (): void => {
        navigation.goBack();
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Coin Flip Game</Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                    <Ionicons name="refresh" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.historyText}>Games Played: {gameHistory.length}</Text>
            </View>

            {/* Coin */}
            <View style={styles.coinContainer}>
                <Animated.View style={[styles.coin, { transform: [{ scale: scaleAnimation }] }]}>
                    <Animated.View style={[styles.coinFace, frontAnimatedStyle]}>
                        <LinearGradient
                            colors={['#ffd700', '#ffed4e']}
                            style={styles.coinGradient}
                        >
                            <Ionicons name="logo-bitcoin" size={60} color="#1a1a2e" />
                        </LinearGradient>
                    </Animated.View>
                    <Animated.View style={[styles.coinFace, backAnimatedStyle]}>
                        <LinearGradient
                            colors={['#ffd700', '#ffed4e']}
                            style={styles.coinGradient}
                        >
                            <Text style={styles.coinText}>T</Text>
                        </LinearGradient>
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Result */}
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>
                        {result === 'heads' ? 'Heads!' : 'Tails!'}
                    </Text>
                </View>
            )}

            {/* Flip Button */}
            <TouchableOpacity
                style={[styles.flipButton, isFlipping && styles.flipButtonDisabled]}
                onPress={flipCoin}
                disabled={isFlipping}
            >
                <LinearGradient
                    colors={isFlipping ? ['#666', '#555'] : ['#ffd700', '#ffed4e']}
                    style={styles.buttonGradient}
                >
                    <Ionicons
                        name={isFlipping ? "hourglass" : "refresh"}
                        size={24}
                        color={isFlipping ? "#999" : "#1a1a2e"}
                    />
                    <Text style={[styles.buttonText, isFlipping && styles.buttonTextDisabled]}>
                        {isFlipping ? 'Flipping...' : 'Flip Coin'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Game History */}
            {gameHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Recent Results:</Text>
                    <View style={styles.historyList}>
                        {gameHistory.slice(-5).reverse().map((item, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Text style={styles.historyItemText}>
                                    {item === 'heads' ? 'H' : 'T'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    resetButton: {
        padding: 10,
    },
    scoreContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 5,
    },
    historyText: {
        fontSize: 16,
        color: '#b0b0b0',
    },
    coinContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    coin: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    coinFace: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backfaceVisibility: 'hidden',
    },
    coinGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },
    resultContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    resultText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    flipButton: {
        width: width * 0.8,
        height: 60,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        alignSelf: 'center',
        marginVertical: 20,
    },
    flipButtonDisabled: {
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    buttonText: {
        color: '#1a1a2e',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonTextDisabled: {
        color: '#999',
    },
    historyContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 16,
        color: '#b0b0b0',
        marginBottom: 10,
    },
    historyList: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    historyItem: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ffd700',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    historyItemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },
});
