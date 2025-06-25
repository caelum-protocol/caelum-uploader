# Multi-Platform Builds

This guide explains how to build the app for the web, Windows desktop, and Android.

## Web (Vercel / Netlify)

1. Install dependencies and run the production build:
   ```bash
   npm install
   npm run build
   ```
2. Deploy the `.next` output to Vercel or Netlify. The default Next.js build works out of the box.

## Windows (.exe with Tauri)

1. Ensure Rust and Cargo are installed.
2. Install Tauri CLI:
   ```bash
   cargo install tauri-cli
   ```
3. Build the web assets:
   ```bash
   npm run build
   npx next export
   ```
4. Run the Tauri build from the `platform/tauri` folder:
   ```bash
   cd platform/tauri
   tauri build
   ```
5. The resulting installer or `.exe` can be found in the Tauri `target` directory.

If Tauri is unavailable, you can wrap the exported `out` folder with Electron as a fallback.

## Android (Capacitor)

1. Install Capacitor and initialize:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```
2. Build the web assets and copy them:
   ```bash
   npm run build
   npx next export
   npx cap copy android
   ```
3. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
4. From Android Studio you can build an APK or run on a device.

These steps are high level – adjust them to your environment and tooling.