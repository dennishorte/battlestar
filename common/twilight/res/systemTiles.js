// System tile definitions for Twilight Imperium 4th Edition + PoK
//
// System tile attributes:
//   id        - Tile number (matches physical tile) or string for home systems
//   planets   - Array of planet IDs on this tile
//   anomaly   - 'asteroid-field' | 'nebula' | 'supernova' | 'gravity-rift' | null
//   wormholes - Array of wormhole types: 'alpha' | 'beta' | 'gamma' | 'delta'
//   type      - 'home' | 'mecatol' | 'blue' | 'red' | 'hyperlane'

const systemTiles = {
  // ============================================================
  // Mecatol Rex
  // ============================================================
  18: {
    id: 18,
    planets: ['mecatol-rex'],
    anomaly: null,
    wormholes: [],
    type: 'mecatol',
  },

  // ============================================================
  // Home Systems — Base Game
  // ============================================================
  'sol-home': {
    id: 'sol-home', tileNumber: 1,
    planets: ['jord'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'federation-of-sol',
  },
  'mentak-home': {
    id: 'mentak-home', tileNumber: 2,
    planets: ['moll-primus'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'mentak-coalition',
  },
  'yin-home': {
    id: 'yin-home', tileNumber: 3,
    planets: ['darien'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'yin-brotherhood',
  },
  'muaat-home': {
    id: 'muaat-home', tileNumber: 4,
    planets: ['muaat'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'embers-of-muaat',
  },
  'arborec-home': {
    id: 'arborec-home', tileNumber: 5,
    planets: ['nestphar'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'arborec',
  },
  'l1z1x-home': {
    id: 'l1z1x-home', tileNumber: 6,
    planets: ['0-0-0'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'l1z1x-mindnet',
  },
  'winnu-home': {
    id: 'winnu-home', tileNumber: 7,
    planets: ['winnu'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'winnu',
  },
  'nekro-home': {
    id: 'nekro-home', tileNumber: 8,
    planets: ['mordai-ii'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'nekro-virus',
  },
  'naalu-home': {
    id: 'naalu-home', tileNumber: 9,
    planets: ['maaluuk', 'druaa'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'naalu-collective',
  },
  'letnev-home': {
    id: 'letnev-home', tileNumber: 10,
    planets: ['arc-prime', 'wren-terra'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'barony-of-letnev',
  },
  'saar-home': {
    id: 'saar-home', tileNumber: 11,
    planets: ['lisis-ii', 'ragh'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'clan-of-saar',
  },
  'jolnar-home': {
    id: 'jolnar-home', tileNumber: 12,
    planets: ['nar', 'jol'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'universities-of-jol-nar',
  },
  'norr-home': {
    id: 'norr-home', tileNumber: 13,
    planets: ['trenlak', 'quinarra'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'sardakk-norr',
  },
  'xxcha-home': {
    id: 'xxcha-home', tileNumber: 14,
    planets: ['archon-ren', 'archon-tau'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'xxcha-kingdom',
  },
  'yssaril-home': {
    id: 'yssaril-home', tileNumber: 15,
    planets: ['retillion', 'shalloq'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'yssaril-tribes',
  },
  'hacan-home': {
    id: 'hacan-home', tileNumber: 16,
    planets: ['arretze', 'hercant', 'kamdorn'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'emirates-of-hacan',
  },
  'creuss-gate': {
    id: 'creuss-gate', tileNumber: 17,
    planets: [],
    anomaly: null, wormholes: ['delta'], type: 'home',
    faction: 'ghosts-of-creuss',
  },
  'creuss-home': {
    id: 'creuss-home', tileNumber: 51,
    planets: ['creuss'],
    anomaly: null, wormholes: ['delta'], type: 'home',
    faction: 'ghosts-of-creuss',
  },

  // ============================================================
  // Home Systems — Prophecy of Kings
  // ============================================================
  'mahact-home': {
    id: 'mahact-home', tileNumber: 52,
    planets: ['ixth'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'mahact-gene-sorcerers',
  },
  'nomad-home': {
    id: 'nomad-home', tileNumber: 53,
    planets: ['arcturus'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'nomad',
  },
  'cabal-home': {
    id: 'cabal-home', tileNumber: 54,
    planets: ['acheron'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'vuil-raith-cabal',
  },
  'titans-home': {
    id: 'titans-home', tileNumber: 55,
    planets: ['elysium'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'titans-of-ul',
  },
  'empyrean-home': {
    id: 'empyrean-home', tileNumber: 56,
    planets: ['the-dark'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'empyrean',
  },
  'naazrokha-home': {
    id: 'naazrokha-home', tileNumber: 57,
    planets: ['naazir', 'rokha'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'naaz-rokha-alliance',
  },
  'argent-home': {
    id: 'argent-home', tileNumber: 58,
    planets: ['valk', 'avar', 'ylir'],
    anomaly: null, wormholes: [], type: 'home',
    faction: 'argent-flight',
  },

  // ============================================================
  // Blue Tiles — Base Game Single Planet
  // ============================================================
  19: { id: 19, planets: ['wellon'], anomaly: null, wormholes: [], type: 'blue' },
  20: { id: 20, planets: ['vefut-ii'], anomaly: null, wormholes: [], type: 'blue' },
  21: { id: 21, planets: ['thibah'], anomaly: null, wormholes: [], type: 'blue' },
  22: { id: 22, planets: ['tarmann'], anomaly: null, wormholes: [], type: 'blue' },
  23: { id: 23, planets: ['saudor'], anomaly: null, wormholes: [], type: 'blue' },
  24: { id: 24, planets: ['mehar-xull'], anomaly: null, wormholes: [], type: 'blue' },
  25: { id: 25, planets: ['quann'], anomaly: null, wormholes: ['beta'], type: 'blue' },
  26: { id: 26, planets: ['lodor'], anomaly: null, wormholes: ['alpha'], type: 'blue' },

  // ============================================================
  // Blue Tiles — Base Game Two Planets
  // ============================================================
  27: { id: 27, planets: ['new-albion', 'starpoint'], anomaly: null, wormholes: [], type: 'blue' },
  28: { id: 28, planets: ['tequ-ran', 'torkan'], anomaly: null, wormholes: [], type: 'blue' },
  29: { id: 29, planets: ['qucenn', 'rarron'], anomaly: null, wormholes: [], type: 'blue' },
  30: { id: 30, planets: ['mellon', 'zohbat'], anomaly: null, wormholes: [], type: 'blue' },
  31: { id: 31, planets: ['lazar', 'sakulag'], anomaly: null, wormholes: [], type: 'blue' },
  32: { id: 32, planets: ['dal-bootha', 'xxehan'], anomaly: null, wormholes: [], type: 'blue' },
  33: { id: 33, planets: ['corneeq', 'resculon'], anomaly: null, wormholes: [], type: 'blue' },
  34: { id: 34, planets: ['centauri', 'gral'], anomaly: null, wormholes: [], type: 'blue' },
  35: { id: 35, planets: ['bereg', 'lirta-iv'], anomaly: null, wormholes: [], type: 'blue' },
  36: { id: 36, planets: ['arnor', 'lor'], anomaly: null, wormholes: [], type: 'blue' },
  37: { id: 37, planets: ['arinam', 'meer'], anomaly: null, wormholes: [], type: 'blue' },
  38: { id: 38, planets: ['abyz', 'fria'], anomaly: null, wormholes: [], type: 'blue' },

  // ============================================================
  // Red Tiles — Base Game
  // ============================================================
  39: { id: 39, planets: [], anomaly: null, wormholes: ['alpha'], type: 'red' },
  40: { id: 40, planets: [], anomaly: null, wormholes: ['beta'], type: 'red' },
  41: { id: 41, planets: [], anomaly: 'gravity-rift', wormholes: [], type: 'red' },
  42: { id: 42, planets: [], anomaly: 'nebula', wormholes: [], type: 'red' },
  43: { id: 43, planets: [], anomaly: 'supernova', wormholes: [], type: 'red' },
  44: { id: 44, planets: [], anomaly: 'asteroid-field', wormholes: [], type: 'red' },
  45: { id: 45, planets: [], anomaly: 'asteroid-field', wormholes: [], type: 'red' },
  46: { id: 46, planets: [], anomaly: null, wormholes: [], type: 'red' },
  47: { id: 47, planets: [], anomaly: null, wormholes: [], type: 'red' },
  48: { id: 48, planets: [], anomaly: null, wormholes: [], type: 'red' },
  49: { id: 49, planets: [], anomaly: null, wormholes: [], type: 'red' },
  50: { id: 50, planets: [], anomaly: null, wormholes: [], type: 'red' },

  // ============================================================
  // Blue Tiles — PoK Single Planet
  // ============================================================
  59: { id: 59, planets: ['archon-vail'], anomaly: null, wormholes: [], type: 'blue' },
  60: { id: 60, planets: ['perimeter'], anomaly: null, wormholes: [], type: 'blue' },
  61: { id: 61, planets: ['ang'], anomaly: null, wormholes: [], type: 'blue' },
  62: { id: 62, planets: ['sem-lore'], anomaly: null, wormholes: [], type: 'blue' },
  63: { id: 63, planets: ['vorhal'], anomaly: null, wormholes: [], type: 'blue' },
  64: { id: 64, planets: ['atlas'], anomaly: null, wormholes: ['beta'], type: 'blue' },
  65: { id: 65, planets: ['primor'], anomaly: null, wormholes: [], type: 'blue' },
  66: { id: 66, planets: ['hopes-end'], anomaly: null, wormholes: [], type: 'blue' },

  // ============================================================
  // Red Tiles with Planets — PoK
  // ============================================================
  67: { id: 67, planets: ['cormund'], anomaly: 'gravity-rift', wormholes: [], type: 'red' },
  68: { id: 68, planets: ['everra'], anomaly: 'nebula', wormholes: [], type: 'red' },

  // ============================================================
  // Blue Tiles — PoK Two Planets
  // ============================================================
  69: { id: 69, planets: ['accoen', 'jeol-ir'], anomaly: null, wormholes: [], type: 'blue' },
  70: { id: 70, planets: ['kraag', 'siig'], anomaly: null, wormholes: [], type: 'blue' },
  71: { id: 71, planets: ['bakal', 'alio-prima'], anomaly: null, wormholes: [], type: 'blue' },
  72: { id: 72, planets: ['lisis', 'velnor'], anomaly: null, wormholes: [], type: 'blue' },
  73: { id: 73, planets: ['cealdri', 'xanhact'], anomaly: null, wormholes: [], type: 'blue' },
  74: { id: 74, planets: ['vega-major', 'vega-minor'], anomaly: null, wormholes: [], type: 'blue' },

  // ============================================================
  // Blue Tiles — PoK Three Planets
  // ============================================================
  75: { id: 75, planets: ['loki', 'abaddon', 'ashtroth'], anomaly: null, wormholes: [], type: 'blue' },
  76: { id: 76, planets: ['rigel-i', 'rigel-ii', 'rigel-iii'], anomaly: null, wormholes: [], type: 'blue' },

  // ============================================================
  // Red Tiles — PoK (empty)
  // ============================================================
  77: { id: 77, planets: [], anomaly: null, wormholes: [], type: 'red' },
  78: { id: 78, planets: [], anomaly: null, wormholes: [], type: 'red' },
  79: { id: 79, planets: [], anomaly: 'asteroid-field', wormholes: ['alpha'], type: 'red' },
  80: { id: 80, planets: [], anomaly: 'supernova', wormholes: [], type: 'red' },
  81: { id: 81, planets: [], anomaly: 'supernova', wormholes: [], type: 'red' },  // Muaat supernova

  // ============================================================
  // Wormhole Nexus — PoK
  // ============================================================
  82: { id: 82, planets: ['mallice'], anomaly: null, wormholes: ['alpha', 'beta', 'gamma'], type: 'blue' },

  // ============================================================
  // Hyperlane Tile
  // ============================================================
  'hyperlane': { id: 'hyperlane', planets: [], anomaly: null, wormholes: [], type: 'hyperlane' },
}

function getSystemTile(id) {
  return systemTiles[id]
}

function getAllSystemTiles() {
  return Object.values(systemTiles)
}

function getHomeSystems() {
  return Object.values(systemTiles).filter(s => s.type === 'home')
}

function getHomeSystemForFaction(factionId) {
  return Object.values(systemTiles).find(s => s.faction === factionId)
}

function getBlueTiles() {
  return Object.values(systemTiles).filter(s => s.type === 'blue')
}

function getRedTiles() {
  return Object.values(systemTiles).filter(s => s.type === 'red')
}

module.exports = {
  systemTiles,
  getSystemTile,
  getAllSystemTiles,
  getHomeSystems,
  getHomeSystemForFaction,
  getBlueTiles,
  getRedTiles,
}
