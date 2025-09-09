# Coin Flip Game 🪙

A beautiful and engaging React Native coin flip betting game with smooth animations and modern UI design.

## Features

- 🎮 **Simple Gameplay**: Easy-to-understand coin flip mechanics
- 💰 **Betting System**: Place bets and double your winnings
- 📊 **Scoreboard**: Track your balance, win streak, and statistics
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 📱 **Cross-Platform**: Works on both iOS and Android
- 💾 **Persistent Storage**: Your progress is saved between sessions
- 🎯 **Haptic Feedback**: Enhanced user experience with vibrations

## Screenshots

The game features:
- Welcome screen with game introduction
- Main game screen with coin flip animation
- Betting interface with multiple bet amounts
- Real-time scoreboard with statistics
- Win/lose feedback with animations

## Installation

1. **Prerequisites**
   - Node.js (v18 or higher)
   - Expo CLI (`npm install -g @expo/cli`)
   - iOS Simulator (for iOS development) or Android Studio (for Android development)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## SDK Version

This project uses **Expo SDK 53** with:
- React 19.0.0
- React Native 0.79.0
- New Architecture enabled by default

## Game Rules

1. **Start with 1000 coins** as your initial balance
2. **Select a bet amount** from the available options (10, 25, 50, 100, 250, 500)
3. **Choose your side**: Heads (👑) or Tails (⚡)
4. **Flip the coin** and watch the animation
5. **Win double your bet** if you guess correctly, or lose your bet if you're wrong
6. **Track your progress** with the built-in scoreboard

## Technical Details

### Architecture
- **React Native 0.79** with Expo SDK 53 for cross-platform development
- **React 19** with latest features and performance improvements
- **React Navigation v7** for screen navigation
- **Expo Linear Gradient** for beautiful gradient backgrounds
- **React Native Reanimated 3.16** for smooth animations
- **AsyncStorage** for persistent data storage
- **Expo Haptics** for tactile feedback
- **New Architecture** (Fabric + TurboModules) enabled by default

### Components
- `WelcomeScreen`: Introduction and game start
- `GameScreen`: Main game logic and state management
- `Coin`: Animated coin component with flip effects
- `BettingInterface`: Bet amount and side selection
- `Scoreboard`: Balance and statistics display

### Key Features
- **Smooth Animations**: Coin flip with 3D rotation effects
- **State Management**: React hooks for game state
- **Data Persistence**: AsyncStorage for saving progress
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper touch targets and visual feedback

## Customization

### Changing Bet Amounts
Edit the `BET_AMOUNTS` array in `src/components/BettingInterface.js`:
```javascript
const BET_AMOUNTS = [10, 25, 50, 100, 250, 500]; // Modify these values
```

### Adjusting Initial Balance
Change the initial balance in `src/screens/GameScreen.js`:
```javascript
const [balance, setBalance] = useState(1000); // Change this value
```

### Modifying Colors
Update the gradient colors in the style sheets throughout the components.

## Future Enhancements

- [ ] Multiple game modes (dice roll, card draw)
- [ ] Achievement system
- [ ] Sound effects
- [ ] Multiplayer support
- [ ] Daily challenges
- [ ] Leaderboards
- [ ] Custom coin designs
- [ ] Betting history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Enjoy the game and may luck be on your side! 🍀**
