const factions = require('./factions/index.js')
const mapLayouts = require('./mapLayouts.js')
const planets = require('./planets.js')
const strategyCards = require('./strategyCards.js')
const systemTiles = require('./systemTiles.js')
const technologies = require('./technologies.js')
const units = require('./units.js')

module.exports = {
  ...factions,
  ...mapLayouts,
  ...planets,
  ...strategyCards,
  ...systemTiles,
  ...technologies,
  ...units,
}
