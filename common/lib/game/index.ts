// Import all exports from game folder files
const BaseActionManager = require('./BaseActionManager.js')
const BaseCard = require('./BaseCard.js')
const BaseCardManager = require('./BaseCardManager.js')
const BaseLogManager = require('./BaseLogManager.js')
const BasePlayer = require('./BasePlayer.js')
const BasePlayerManager = require('./BasePlayerManager.js')
const BaseZone = require('./BaseZone.js')
const BaseZoneManager = require('./BaseZoneManager.js')


// Re-export all classes and functions
module.exports = {
  ...BaseActionManager,
  ...BaseCard,
  ...BaseCardManager,
  ...BaseLogManager,
  ...BasePlayer,
  ...BasePlayerManager,
  ...BaseZone,
  ...BaseZoneManager,
}

// Also export types
export * from './BaseActionManager.js'
export * from './BaseCard.js'
export * from './BaseCardManager.js'
export * from './BaseLogManager.js'
export * from './BasePlayer.js'
export * from './BasePlayerManager.js'
export * from './BaseZone.js'
export * from './BaseZoneManager.js'
export * from './GameProxy.js'
