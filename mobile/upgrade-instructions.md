# Expo SDK 53 Upgrade Instructions

## Steps to Upgrade from SDK 49 to SDK 53

### 1. Install Dependencies
```bash
# Remove old node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install new dependencies
npm install
```

### 2. Clear Expo Cache
```bash
# Clear Expo cache
npx expo start --clear
```

### 3. Update Native Projects (if applicable)
If you have native iOS/Android projects:
```bash
# For iOS
cd ios && pod install && cd ..

# For Android, clean and rebuild
cd android && ./gradlew clean && cd ..
```

### 4. Test the Application
```bash
# Start the development server
npm start

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android
```

## Key Changes in SDK 53

### Dependencies Updated:
- **Expo**: 49.0.0 → 53.0.0
- **React**: 18.2.0 → 19.0.0
- **React Native**: 0.72.6 → 0.79.0
- **React Navigation**: 6.x → 7.x
- **React Native Reanimated**: 3.3.0 → 3.16.0
- **Expo Linear Gradient**: 12.3.0 → 14.0.0
- **Expo Haptics**: 12.4.0 → 14.0.0

### New Features:
- **New Architecture**: Enabled by default (Fabric + TurboModules)
- **React 19**: Latest React features and improvements
- **Better Performance**: Enhanced rendering and native module performance
- **Improved TypeScript Support**: Better type checking and IntelliSense

### Breaking Changes:
- Some deprecated APIs have been removed
- React 19 introduces new behavior for some hooks
- New Architecture may require code adjustments for custom native modules

## Troubleshooting

### If you encounter issues:

1. **Clear all caches**:
   ```bash
   npx expo start --clear
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Disable New Architecture** (if needed):
   Add to `app.json`:
   ```json
   {
     "expo": {
       "experiments": {
         "newArchEnabled": false
       }
     }
   }
   ```

3. **Check for deprecated APIs**:
   - Review console warnings
   - Update any deprecated imports or methods

4. **Test thoroughly**:
   - Test all game functionality
   - Verify animations work correctly
   - Check haptic feedback
   - Test on both iOS and Android

## Verification Checklist

- [ ] App starts without errors
- [ ] Welcome screen displays correctly
- [ ] Navigation between screens works
- [ ] Coin flip animation works smoothly
- [ ] Betting interface functions properly
- [ ] Scoreboard updates correctly
- [ ] Haptic feedback works
- [ ] Data persistence works (AsyncStorage)
- [ ] App works on both iOS and Android

## Support

If you encounter issues during the upgrade:
1. Check the [Expo SDK 53 changelog](https://expo.dev/changelog/sdk-53)
2. Review [React 19 migration guide](https://react.dev/blog/2024/12/05/react-19)
3. Check [React Native 0.79 changelog](https://github.com/facebook/react-native/releases/tag/v0.79.0)
