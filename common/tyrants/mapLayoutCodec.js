// Encode assembled map hexes into a compact string.
// Format: {mapName}:{tileId}r{rotation},...
function encodeMapLayout(mapName, hexes) {
  const entries = hexes.map(h => `${h.tileId}r${h.rotation}`)
  return `${mapName}:${entries.join(',')}`
}

// Decode a layout string into map name + entries.
// Returns { mapName, entries: [{ tileId, rotation }] }
function decodeMapLayout(str) {
  if (!str || typeof str !== 'string') {
    throw new Error('Invalid layout string')
  }

  const colonIndex = str.indexOf(':')
  if (colonIndex === -1) {
    throw new Error('Invalid layout string: missing colon separator')
  }

  const mapName = str.slice(0, colonIndex)
  const rest = str.slice(colonIndex + 1)

  if (!rest) {
    throw new Error('Invalid layout string: no tile entries')
  }

  const entries = rest.split(',').map(entry => {
    const match = entry.match(/^([A-Z]\d+)r(\d)$/)
    if (!match) {
      throw new Error(`Invalid tile entry: "${entry}"`)
    }
    return {
      tileId: match[1],
      rotation: parseInt(match[2], 10),
    }
  })

  return { mapName, entries }
}

// Validate decoded entries against a map config.
// Returns { valid: true } or { valid: false, error: string }
function validateMapLayout(mapName, entries) {
  // Lazy require to avoid circular dependency (res/index.js requires this file)
  const { hexTiles, mapConfigs } = require('./res/index.js')
  const config = mapConfigs.mapConfigs[mapName]

  if (!config) {
    return { valid: false, error: `Unknown map: ${mapName}` }
  }

  if (entries.length !== config.layout.length) {
    return {
      valid: false,
      error: `Expected ${config.layout.length} tiles, got ${entries.length}`,
    }
  }

  const seenTiles = new Set()
  for (let i = 0; i < entries.length; i++) {
    const { tileId, rotation } = entries[i]

    if (!hexTiles.allTiles[tileId]) {
      return { valid: false, error: `Unknown tile: ${tileId}` }
    }

    if (rotation < 0 || rotation > 5) {
      return { valid: false, error: `Invalid rotation ${rotation} for tile ${tileId}` }
    }

    if (seenTiles.has(tileId)) {
      return { valid: false, error: `Duplicate tile: ${tileId}` }
    }
    seenTiles.add(tileId)
  }

  return { valid: true }
}

module.exports = {
  encodeMapLayout,
  decodeMapLayout,
  validateMapLayout,
}
