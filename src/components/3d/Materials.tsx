import * as THREE from 'three';

// High-quality stylized materials for smooth Chibi 3D characters and environment

export const kingdomColors = {
  white: {
    // BLUE KINGDOM (Player) - Pure Royal Blue, Gold, and Gleaming Steel. ZERO Red.
    primary: '#1d4ed8',       // Brilliant Royal Blue
    primaryDark: '#1e3a8a',   // Deep Royal Navy Blue
    primaryLight: '#3b82f6',  // Highlight Blue
    armor: '#3b82f6',         // Blue enameled armor
    metal: '#e2e8f0',         // Gleaming Polished Steel
    trim: '#f59e0b',          // Royal Gold
    leather: '#5c3818',       // Warm Brown Leather
    cloth: '#eff6ff',         // Off-white linen / ermine fur
    horse: '#ffffff',         // Snow White Steed
    shield: '#1d4ed8',        // Royal Blue Shield
    cape: '#1e40af',          // Royal Blue Cape
    eyeIris: '#2563eb',       // Royal Blue Eyes
  },
  black: {
    // RED KINGDOM (NPC) - Pure Crimson, Dark Burgundy, Black Metal, and Bronze. ZERO Blue.
    primary: '#b91c1c',       // Brilliant Crimson Red
    primaryDark: '#7f1d1d',   // Deep Dark Crimson
    primaryLight: '#ef4444',  // Highlight Crimson
    armor: '#991b1b',         // Crimson enameled armor
    metal: '#18181b',         // Dark Obsidian / Blackened Steel
    trim: '#d97706',          // Burnished Bronze Gold
    leather: '#261710',       // Dark Charcoal Leather
    cloth: '#1c1917',         // Dark Charcoal Velvet
    horse: '#0f172a',         // Midnight Obsidian Steed
    shield: '#991b1b',        // Crimson Shield
    cape: '#7f1d1d',          // Deep Crimson Cape
    eyeIris: '#dc2626',       // Crimson Red Eyes
  },
  board: {
    light: '#F0D9B5',         // Warm Ivory / Off-White (Standard Chess)
    dark: '#B58863',          // Deep Rich Brown (Standard Chess)
    seam: '#2a1810',          // Razor sharp grid lines
    border: '#382214',        // Carved Dark Walnut Platform
    goldTrim: '#d4af37',      // Royal Gold Inset Line
  },
  neutral: {
    skin: '#fed7aa',          // Vibrant, smooth Chibi skin tone
    skinShadow: '#fbd38d',
    skinBlush: '#fca5a5',     // Cute Chibi cheek blush
    eyeWhite: '#ffffff',
    eyePupil: '#090d16',
    eyeHighlight: '#ffffff',
    beardBrown: '#382214',    // Dark walnut beard/hair
    hairBlonde: '#d97706',
    hairBrown: '#452615',
    wood: '#6b3d1b',          // Spear / staff wood
    gold: '#fbbf24',          // Shining gold
    ruby: '#e11d48',          // Glowing ruby gem
    sapphire: '#2563eb',      // Glowing sapphire gem
  }
};

// Material cache for high rendering performance, smooth normal shading, and mobile optimization
class MaterialRegistry {
  private cache = new Map<string, THREE.MeshStandardMaterial>();

  get(
    color: string,
    roughness = 0.4,
    metalness = 0.1,
    flatShading = false // Smooth shading by default for high-quality rounded 3D models!
  ): THREE.MeshStandardMaterial {
    const key = `${color}_${roughness}_${metalness}_${flatShading}`;
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        new THREE.MeshStandardMaterial({
          color,
          roughness,
          metalness,
          flatShading
        })
      );
    }
    return this.cache.get(key)!;
  }
}

export const matRegistry = new MaterialRegistry();
