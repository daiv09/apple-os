# MacOS Clone – Desktop Experience in the Browser

## Overview

MacOS Clone is a pixel-polished desktop experience built with Next.js and Tailwind CSS, inspired by classic operating systems and modern UI animation principles. It recreates the feel of using a Mac on the web: draggable windows, a dynamic dock, desktop icons, and smooth transitions that make the UI feel alive.

The motivation came from a YouTube short showcasing a portfolio site that perfectly cloned an old Windows interface, which sparked the idea to do the same for macOS but with a modern, interactive twist. Instead of just mimicking the look, this project focuses on interaction design, subtle motion, and the satisfaction of “using” a desktop inside your browser.

## Features

- Dock with interactive app icons, hover states, and smooth open/close animations.
- Draggable, resizable windows with focus states and layered z-index behavior.
- Desktop wallpaper, menu bar, and system-level UI details tailored for a Mac-like feel.
- Responsive layout so the experience still works on smaller screens.
- Built with the Next.js App Router, React Server Components, and Tailwind for rapid styling.

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript by default via `create-next-app`).
- **Styling:** Tailwind CSS for utility-first, responsive design.
- **Fonts:** Optimized with `next/font` for fast, high-quality typography.
- **Deployment:** Designed to be deployed easily on Vercel with zero-config builds for Next.js apps.

## Getting Started

1. **Clone the repository:**

```
git clone https://github.com/your-username/macos-clone.git
```
```
cd macos-clone
```


2. **Install dependencies:**

```console
npm install
```
OR
```console
yarn install
```
OR
```console
pnpm install
```
OR
```console
bun install
```

3. **Run the development server:**

```
npm run dev
```
or
```
yarn dev
```
or
```
pnpm dev
```
or
```
bun dev
```


4. **Open the app:**

Visit `http://localhost:3000` in your browser to explore the Mac-style desktop.

## Project Goals

- Explore how far a web app can go in recreating a full desktop environment while staying performant and accessible.
- Practice micro-interactions, motion design, and state management in a complex, windowed UI.
- Build a portfolio piece that stands out visually and demonstrates strong frontend architecture, UX thinking, and attention to detail.

## Roadmap

- Add more “system apps” (Finder-style file browser, Notes, simple Browser, faux Terminal).
- Implement multi-window layout presets and improved window snapping.
- Enhance keyboard interactions and basic accessibility support (focus states, ARIA where appropriate).
- Optional “themes” for wallpapers, dock sizes, and light/dark modes.

## Contributing

Contributions, ideas, and feedback are welcome. A good starting point is to:

- Open an issue describing a bug, UX improvement, or feature idea.
- Fork the repository and create a feature branch.
- Submit a pull request with a clear description of the change and any relevant screenshots.

## License

This project is licensed under the **MIT License**. In practical terms, that means you are generally free to use, modify, and share the code, including in commercial projects, as long as you include the original copyright notice and a copy of the MIT license.

See the [`LICENSE`](LICENSE) file in the repository for the full license text.
