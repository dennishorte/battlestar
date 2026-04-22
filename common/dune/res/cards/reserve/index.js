'use strict'

const ArrakisLiason = require('./arrakis-liason.js')
const TheSpiceMustFlowBase = require('./the-spice-must-flow-base.js')
const Foldspace = require('./foldspace.js')
const PrepareTheWay = require('./prepare-the-way.js')
const TheSpiceMustFlow = require('./the-spice-must-flow.js')

const reserveCards = [
  // Base game reserves — NOT used in Uprising
  ArrakisLiason,
  TheSpiceMustFlowBase,
  Foldspace,

  // Uprising reserves
  PrepareTheWay,
  TheSpiceMustFlow,
]

module.exports = reserveCards
