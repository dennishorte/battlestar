const agendaCards = require('./agendaCards.js')
const explorationCards = require('./explorationCards.js')
const factions = require('./factions/index.js')
const mapLayouts = require('./mapLayouts.js')
const objectives = require('./objectives.js')
const planets = require('./planets.js')
const strategyCards = require('./strategyCards.js')
const systemTiles = require('./systemTiles.js')
const technologies = require('./technologies.js')
const units = require('./units.js')

module.exports = {
  ...agendaCards,
  ...explorationCards,
  ...factions,
  ...mapLayouts,
  ...objectives,
  ...planets,
  ...strategyCards,
  ...systemTiles,
  ...technologies,
  ...units,
}
