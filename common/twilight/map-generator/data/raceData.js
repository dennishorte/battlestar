'use strict'

// Race/faction data derived from existing res modules.
// Uses faction IDs (e.g. 'federation-of-sol') and systemTile keys (e.g. 'sol-home')
// instead of display names and tile numbers.

const { systemTiles } = require('../../res/systemTiles')

// Base game faction IDs
const races = [
  'arborec', 'barony-of-letnev', 'clan-of-saar', 'embers-of-muaat',
  'emirates-of-hacan', 'federation-of-sol', 'ghosts-of-creuss', 'l1z1x-mindnet',
  'mentak-coalition', 'naalu-collective', 'nekro-virus', 'sardakk-norr',
  'universities-of-jol-nar', 'winnu', 'xxcha-kingdom', 'yin-brotherhood',
  'yssaril-tribes',
]

// Prophecy of Kings faction IDs
const pokRaces = [
  'argent-flight', 'empyrean', 'mahact-gene-sorcerers', 'naaz-rokha-alliance',
  'nomad', 'titans-of-ul', 'vuil-raith-cabal',
]

// Build home system mappings from systemTiles
const raceToHomeSystemMap = {}
const homeSystems = []
const pokHomeSystems = []

for (const [id, tile] of Object.entries(systemTiles)) {
  if (tile.type !== 'home' || !tile.faction) {
    continue
  }
  // Skip creuss-home (off-map); creuss-gate is the on-board tile
  if (id === 'creuss-home') {
    continue
  }

  raceToHomeSystemMap[tile.faction] = id

  if (pokRaces.includes(tile.faction)) {
    pokHomeSystems.push(id)
  }
  else {
    homeSystems.push(id)
  }
}

const homeSystemToRaceMap = {}
for (const [race, system] of Object.entries(raceToHomeSystemMap)) {
  homeSystemToRaceMap[system] = race
}

// Races that require specific anomaly types to be present on the map
const racialAnomalyRequirements = {
  'clan-of-saar': 'asteroid-field',
  'embers-of-muaat': 'supernova',
  'empyrean': 'nebula',
  'vuil-raith-cabal': 'gravity-rift',
}

module.exports = {
  races,
  pokRaces,
  homeSystems,
  pokHomeSystems,
  raceToHomeSystemMap,
  homeSystemToRaceMap,
  racialAnomalyRequirements,
}
