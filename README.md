# Caelum Memory Vault

**Caelum Memory Vault** is a futuristic memory archiver built with Next.js. Users can upload files that are stored locally and grouped into unique "shards." The interface supports multiple animated themes (Matrix rain, Iris nebula, and Pepe mode), transitions, sound effects, and toast notifications. Data persists via `localStorage`, enabling full offline usage.

## Features

- ⚡ **Client‑side only** – works completely offline
- 🎨 **Dynamic themes** – dark, Matrix, Iris, and Pepe with animated effects
- 🪄 **Smooth transitions** powered by Framer Motion
- 🔊 **Sound effects** and toast‑based UI feedback
- 📂 **Shard system** to group and download memories
- 💾 **LocalStorage persistence** across sessions

## Demo

![App screenshot](docs/demo.png)

*A glimpse of the Matrix theme with active shard view.*

## Installation

```bash
# install dependencies
npm install
# or
yarn
```

## Development

```bash
# start local dev server at http://localhost:3000
npm run dev
# or
yarn dev
```
Run tests with:

```bash
npm test
# or
yarn test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Build & Deploy

```bash
npm run build
npm run start
```

### Package for Windows

You can export a static build and wrap it with a tool such as Tauri or Electron to produce a `.exe` file:

```bash
npm run build
npx next export
# then package the `out` folder with your preferred wrapper
```

### Android (optional)

The app works as a Progressive Web App. Install it from the browser or wrap the exported build in tools like Capacitor to generate an Android package.

## Folder Structure

```
src/
  app/          # Next.js pages and layouts
  components/   # UI components (themes, uploader, archive)
  context/      # React context providers
  hooks/        # Custom hooks
  providers/    # Web3 and other global providers
  utils/        # Helper utilities
public/         # Static assets (images, sounds)
```

## Contributing

Contributions are welcome! Open an issue or submit a pull request for new features, fixes, or improvements.

## License

This project is licensed under the MIT License.


## Credits

Built with **irys/sdk**, **Next.js**, **React**, **Tailwind CSS**, **Framer Motion**, **React Hot Toast**, and **use‑sound**.