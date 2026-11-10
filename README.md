# 👑 AxeonSoft Kingdom Chess
### 3D Portrait Browser Chess Game

A fully functional, stylized 3D portrait chess game built with **React**, **TypeScript**, **Three.js**, **React Three Fiber (R3F)**, and **chess.js**. Play against an intelligent NPC opponent powered by **Stockfish 10** across three difficulty tiers.

---

## 📸 Visual Reference & Style
Designed from the ground up for a **9:16 mobile-first portrait aspect ratio**:
- **Blue Player Kingdom (White):** Royal Blue armor, gleaming steel, gold filigree, white steed, and blue heraldic lion shields.
- **Red NPC Kingdom (Black):** Crimson enameled armor, blackened steel, bronze trims, midnight obsidian steed, and crimson heraldic lion shields.
- **Stylized Chibi 3D Cast:** Custom procedural smooth geometry with expressive Chibi facial features, character-specific weapons, flowing capes, and crowns.
- **High-Contrast Board:** Standard Warm Ivory (`#F0D9B5`) and Deep Brown (`#B58863`) stone tiles with gold decorative borders.
- **Medieval Fantasy Atmosphere:** Mountain castle background with arched fortress gate, watchtowers, waterfall, guardian lion statue, pine trees, and dynamic flickering torches.

---

## 🎮 Features

- **Single Player vs NPC (Stockfish 10):**
  - **Easy (Squire Malakar):** Depth 2 novice commander.
  - **Medium (General Malakar):** Depth 6 seasoned tactician.
  - **Hard (Emperor Malakar):** Depth 12 grandmaster warlord.
  - Interactive difficulty selection screen before battle and mid-game selector.
- **Full Chess Engine (`chess.js`):**
  - Standard moves, Check, Checkmate, Stalemate, Draw detection.
  - Castling, En Passant, and Pawn Promotion modal (Queen, Rook, Bishop, Knight).
  - Move undo and full move chronicles (SAN notation drawer).
- **Smooth 3D Choreographed Animations:**
  - Non-linear `easeInOutCubic` translation (zero teleportation).
  - High curved parabolic jumping trajectory for Knights.
  - Capture sequences with attack strike, defeat tilt & shrink before unmounting.
  - Facing direction synchronization (both armies face each other across the board at all times).
- **Responsive 3D Camera:**
  - Dynamic aspect-ratio-aware vertical FOV scaling (fits 100% of the 8x8 board on all portrait phone screens with zero cropping).
- **Web Audio Sound Effects:**
  - Procedural sound synthesizer for piece moves, sword clash on capture, royal trumpet on check, and victory chimes.

---

## 🛠️ Tech Stack

- **Framework:** React 18 & TypeScript
- **Bundler:** Vite
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Game Engine:** `chess.js`
- **Chess AI:** Stockfish 10 (Web Worker) + Tactical Minimax Fallback
- **Icons:** `lucide-react`
- **Celebration Effects:** `canvas-confetti`

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📜 License
MIT License.
