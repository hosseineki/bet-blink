# WebView Installation Instructions

To use the ASG Framework integration in the WelcomeScreen component, you need to install the `react-native-webview` package.

## Installation

Run the following command in your project root:

```bash
npm install react-native-webview
```

Or if you're using yarn:

```bash
yarn add react-native-webview
```

## For Expo Projects

If you're using Expo, you may need to use the Expo-compatible version:

```bash
npx expo install react-native-webview
```

## After Installation

1. Restart your development server
2. The WebView component should now work properly
3. You can test the ASG Framework integration by tapping the "ASG Framework" button on the welcome screen

## Features Included

- ✅ WebView integration with ASG Framework
- ✅ HTML content with proper viewport settings
- ✅ ASG Framework script loading from CDN
- ✅ Essential callbacks implementation:
  - `setOnSessionStatusUpdate`
  - `setOnGamesListUpdated`
  - `setLoadGameStart`
  - `setLoadGameClosed`
- ✅ Interactive buttons for framework operations
- ✅ Real-time logging and status updates
- ✅ Responsive design matching your app theme

## Usage

1. Open the app
2. On the welcome screen, tap "ASG Framework" button
3. The WebView will load with the ASG Framework integration
4. Use the buttons to initialize and interact with the framework
5. Monitor the log for real-time feedback
6. Tap the close button to return to the main screen
