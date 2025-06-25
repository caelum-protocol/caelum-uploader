# Android Setup

This folder holds the base setup for creating an Android package using **Capacitor** or a minimal WebView wrapper.

1. Install Capacitor in your project and initialize it:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```
2. Copy your built web assets into the `android` project with:
   ```bash
   npx cap copy android
   ```
3. Open the Android project in Android Studio to build or run on a device:
   ```bash
   npx cap open android
   ```

See `../../README_platforms.md` for the full workflow.