const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const { BaseCard } = require('../lib/game/index.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { TwilightActionManager } = require('./TwilightActionManager.js')
const { TwilightLogManager } = require('./TwilightLogManager.js')
const { TwilightPlayerManager } = require('./TwilightPlayerManager.js')


module.exports = {
  GameOverEvent,
  Twilight,
  TwilightFactory,

  constructor: Twilight,
  factory: factoryFromLobby,
  res,
}


function Twilight(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    ActionManager: TwilightActionManager,
    LogManager: TwilightLogManager,
    PlayerManager: TwilightPlayerManager,
  })
}

util.inherit(Game, Twilight)


function TwilightFactory(settings, viewerName) {
  const data = GameFactory(settings)
  data.settings = data.settings || {}
  data.settings.factions = settings.factions || []
  return new Twilight(data, viewerName)
}


function factoryFromLobby(lobby) {
  return TwilightFactory({
    game: 'TwilightImperium',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    factions: lobby.options?.factions || [],
  })
}


////////////////////////////////////////////////////////////////////////////////
// Main Program

Twilight.prototype._mainProgram = function() {
  this.initialize()
  this.mainLoop()
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Twilight.prototype.initialize = function() {
  this._initializeState()
  this._initializeZones()
  this._initializeFactions()
  this._initializeGalaxy()
  this._initializeStartingUnits()
  this._initializePlanetControl()

  this._breakpoint('initialization-complete')
}

Twilight.prototype._initializeState = function() {
  this.state.round = 0
  this.state.phase = 'setup'
  this.state.speaker = this.players.first().name

  // Galaxy state
  this.state.systems = {}
  this.state.units = {}
  this.state.planets = {}

  // Custodians token on Mecatol Rex
  this.state.custodiansRemoved = false

  // Track available strategy cards
  this.state.availableStrategyCards = res.getAllStrategyCards().map(c => c.id)
  this.state.strategyCardTradeGoods = {}  // cardId -> trade goods on unchosen cards
}

Twilight.prototype._initializeZones = function() {
  // Common zones
  this.zones.create(this, 'common.strategy-cards', 'Strategy Cards', 'public')
  this.zones.create(this, 'common.public-objectives-I', 'Public Objectives I', 'public')
  this.zones.create(this, 'common.public-objectives-II', 'Public Objectives II', 'public')
  this.zones.create(this, 'common.laws', 'Laws', 'public')

  // Per-player zones
  for (const player of this.players.all()) {
    const p = player.name
    this.zones.create(this, `players.${p}.technologies`, 'Technologies', 'public', player)
    this.zones.create(this, `players.${p}.action-cards`, 'Action Cards', 'private', player)
    this.zones.create(this, `players.${p}.secret-objectives`, 'Secret Objectives', 'private', player)
    this.zones.create(this, `players.${p}.scored-objectives`, 'Scored Objectives', 'public', player)
    this.zones.create(this, `players.${p}.promissory-notes`, 'Promissory Notes', 'private', player)
    this.zones.create(this, `players.${p}.planets`, 'Planets', 'public', player)
    this.zones.create(this, `players.${p}.leaders`, 'Leaders', 'public', player)
  }
}

Twilight.prototype._initializeFactions = function() {
  const factionIds = this.settings.factions
  const allFactions = res.getAllFactionIds()

  const players = this.players.all()
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    const factionId = factionIds[i] || allFactions[i]
    player.initializeFaction(factionId)

    // Register starting technologies as cards
    const techCards = []
    for (const techId of player.faction.startingTechnologies) {
      const tech = res.getTechnology(techId)
      if (tech) {
        const card = new BaseCard(this, { ...tech, id: `${player.name}-${techId}` })
        this.cards.register(card)
        techCards.push(card)
      }
    }
    const techZone = this.zones.byPlayer(player, 'technologies')
    techZone.initializeCards(techCards)
  }
}

Twilight.prototype._initializeGalaxy = function() {
  const playerCount = this.players.all().length
  const layout = res.getLayout(playerCount)

  // Place Mecatol Rex
  this.state.systems[18] = {
    tileId: 18,
    position: layout.mecatol,
    commandTokens: [],
  }

  // Place home systems
  const players = this.players.all()
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    const faction = player.faction
    const homeSystemId = faction.homeSystem
    const position = layout.homePositions[i]

    this.state.systems[homeSystemId] = {
      tileId: homeSystemId,
      position,
      commandTokens: [],
    }
  }

  // Fill remaining positions with blue and red tiles
  const allPositions = [...layout.ring1, ...layout.ring2]

  // Filter out positions already used by Mecatol or home systems
  const usedPositions = new Set()
  usedPositions.add(`${layout.mecatol.q},${layout.mecatol.r}`)
  for (const pos of layout.homePositions) {
    usedPositions.add(`${pos.q},${pos.r}`)
  }

  const availablePositions = allPositions.filter(
    p => !usedPositions.has(`${p.q},${p.r}`)
  )

  // Shuffle available tiles
  const blueTiles = res.getBlueTiles().map(t => t.id)
  const redTiles = res.getRedTiles().map(t => t.id)

  // Shuffle using game's seeded random
  this._shuffle(blueTiles)
  this._shuffle(redTiles)

  // Place tiles on available positions
  const tilesToPlace = [
    ...blueTiles.slice(0, Math.min(layout.blueTileCount, availablePositions.length)),
    ...redTiles.slice(0, Math.max(0, availablePositions.length - layout.blueTileCount)),
  ]

  for (let i = 0; i < Math.min(tilesToPlace.length, availablePositions.length); i++) {
    const tileId = tilesToPlace[i]
    const position = availablePositions[i]

    this.state.systems[tileId] = {
      tileId,
      position,
      commandTokens: [],
    }
  }

  // Initialize unit tracking for all systems
  for (const systemId of Object.keys(this.state.systems)) {
    this.state.units[systemId] = {
      space: [],
      planets: {},
    }

    // Initialize planet slots
    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (tile) {
      for (const planetId of tile.planets) {
        this.state.units[systemId].planets[planetId] = []
        this.state.planets[planetId] = {
          controller: null,
          exhausted: false,
          attachments: [],
        }
      }
    }
  }
}

Twilight.prototype._initializeStartingUnits = function() {
  for (const player of this.players.all()) {
    const faction = player.faction
    const homeSystemId = faction.homeSystem

    // Place space units
    if (faction.startingUnits.space) {
      for (const unitType of faction.startingUnits.space) {
        this._addUnit(homeSystemId, 'space', unitType, player.name)
      }
    }

    // Place ground units on planets
    if (faction.startingUnits.planets) {
      for (const [planetId, unitTypes] of Object.entries(faction.startingUnits.planets)) {
        for (const unitType of unitTypes) {
          this._addUnit(homeSystemId, planetId, unitType, player.name)
        }
      }
    }
  }
}

Twilight.prototype._initializePlanetControl = function() {
  // Each player controls their home planets
  for (const player of this.players.all()) {
    const faction = player.faction
    const homeSystem = res.getSystemTile(faction.homeSystem)
    if (homeSystem) {
      for (const planetId of homeSystem.planets) {
        if (this.state.planets[planetId]) {
          this.state.planets[planetId].controller = player.name
        }
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Unit management

Twilight.prototype._nextUnitId = function() {
  if (!this.state._unitCounter) {
    this.state._unitCounter = 0
  }
  this.state._unitCounter++
  return `u-${String(this.state._unitCounter).padStart(3, '0')}`
}

Twilight.prototype._addUnit = function(systemId, location, unitType, ownerName) {
  const unit = {
    id: this._nextUnitId(),
    type: unitType,
    owner: ownerName,
    damaged: false,
  }

  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    throw new Error(`System ${systemId} not found in units state`)
  }

  if (location === 'space') {
    systemUnits.space.push(unit)
  }
  else {
    if (!systemUnits.planets[location]) {
      systemUnits.planets[location] = []
    }
    systemUnits.planets[location].push(unit)
  }

  return unit
}

Twilight.prototype._removeUnit = function(systemId, location, unitId) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return null
  }

  const arr = location === 'space'
    ? systemUnits.space
    : systemUnits.planets[location]

  if (!arr) {
    return null
  }

  const idx = arr.findIndex(u => u.id === unitId)
  if (idx === -1) {
    return null
  }

  return arr.splice(idx, 1)[0]
}

Twilight.prototype._getUnitsInSystem = function(systemId, ownerName) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return { space: [], planets: {} }
  }

  const result = {
    space: systemUnits.space.filter(u => !ownerName || u.owner === ownerName),
    planets: {},
  }

  for (const [planetId, units] of Object.entries(systemUnits.planets)) {
    result.planets[planetId] = units.filter(u => !ownerName || u.owner === ownerName)
  }

  return result
}


////////////////////////////////////////////////////////////////////////////////
// Galaxy helpers

Twilight.prototype._getAdjacentSystems = function(systemId) {
  const system = this.state.systems[systemId]
  if (!system) {
    return []
  }

  const adjacent = []
  const pos = system.position

  // Check physical adjacency
  for (const [otherId, otherSystem] of Object.entries(this.state.systems)) {
    if (otherId === String(systemId)) {
      continue
    }
    const dist = res.getHexDistance(pos, otherSystem.position)
    if (dist === 1) {
      adjacent.push(otherId)
    }
  }

  // Check wormhole adjacency
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  if (tile && tile.wormholes.length > 0) {
    for (const [otherId] of Object.entries(this.state.systems)) {
      if (otherId === String(systemId)) {
        continue
      }
      if (adjacent.includes(otherId)) {
        continue
      }

      const otherTile = res.getSystemTile(otherId) || res.getSystemTile(Number(otherId))
      if (otherTile) {
        const hasMatchingWormhole = tile.wormholes.some(w =>
          otherTile.wormholes.includes(w)
        )
        if (hasMatchingWormhole) {
          adjacent.push(otherId)
        }
      }
    }
  }

  return adjacent
}


////////////////////////////////////////////////////////////////////////////////
// Shuffle helper

Twilight.prototype._shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(this.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Twilight.prototype.mainLoop = function() {
  while (true) {
    this.state.round++
    this.state.phase = 'strategy'

    this.log.add({
      template: 'Round {round}',
      args: { round: this.state.round },
    })

    this.strategyPhase()
    this.actionPhase()
    this.statusPhase()

    if (this.state.custodiansRemoved) {
      this.agendaPhase()
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Phase stubs (to be implemented in phase files)

Twilight.prototype.strategyPhase = function() {
  this.state.phase = 'strategy'
  this.log.add({ template: 'Strategy Phase' })
  this.log.indent()

  // Reset strategy cards
  this.state.availableStrategyCards = res.getAllStrategyCards().map(c => c.id)

  // Clockwise from speaker
  const speaker = this.players.byName(this.state.speaker)
  const clockwiseOrder = this.players.startingWith(speaker)

  // 3-4 players pick 2 cards each (snake draft), others pick 1
  const numPlayers = this.players.all().length
  const cardsPerPlayer = (numPlayers >= 3 && numPlayers <= 4) ? 2 : 1

  for (let round = 0; round < cardsPerPlayer; round++) {
    // Snake draft: first round clockwise, second round reverse
    const pickOrder = round === 0 ? clockwiseOrder : [...clockwiseOrder].reverse()

    for (const player of pickOrder) {
      const available = this.state.availableStrategyCards
      const selection = this.actions.choose(player, available, {
        title: 'Choose Strategy Card',
      })
      const cardId = selection[0]

      player.pickStrategyCard(cardId)
      this.state.availableStrategyCards = this.state.availableStrategyCards.filter(id => id !== cardId)

      // Add trade goods from card if any
      const tradeGoodsOnCard = this.state.strategyCardTradeGoods[cardId] || 0
      if (tradeGoodsOnCard > 0) {
        player.addTradeGoods(tradeGoodsOnCard)
        delete this.state.strategyCardTradeGoods[cardId]
      }

      this.log.add({
        template: '{player} chooses {card}',
        args: { player, card: res.getStrategyCard(cardId).name },
      })
    }
  }

  // Place trade goods on unchosen strategy cards
  for (const cardId of this.state.availableStrategyCards) {
    this.state.strategyCardTradeGoods[cardId] = (this.state.strategyCardTradeGoods[cardId] || 0) + 1
  }

  this.log.outdent()
}

Twilight.prototype.actionPhase = function() {
  this.state.phase = 'action'
  this.log.add({ template: 'Action Phase' })
  this.log.indent()

  // Reset passed state
  for (const player of this.players.all()) {
    player.resetPassed()
  }

  // Turn order by strategy card initiative number
  const turnOrder = this.players.all()
    .filter(p => p.getStrategyCardId())
    .sort((a, b) => {
      const cardA = res.getStrategyCard(a.getStrategyCardId())
      const cardB = res.getStrategyCard(b.getStrategyCardId())
      return cardA.number - cardB.number
    })

  let activeIndex = 0

  while (true) {
    // Check if all players have passed
    const activePlayers = turnOrder.filter(p => !p.hasPassed())
    if (activePlayers.length === 0) {
      break
    }

    // Find next active player
    const player = turnOrder[activeIndex % turnOrder.length]
    activeIndex++

    if (player.hasPassed()) {
      continue
    }

    // Player must use strategy card before passing
    const choices = ['Tactical Action', 'Component Action']
    if (!player.hasUsedStrategyCard()) {
      choices.push('Strategic Action')
    }
    choices.push('Pass')

    // Cannot pass until strategy card is used
    const availableChoices = player.hasUsedStrategyCard()
      ? choices
      : choices.filter(c => c !== 'Pass')

    const selection = this.actions.choose(player, availableChoices, {
      title: 'Choose Action',
    })

    const action = selection[0]

    this.log.add({
      template: '{player}: {action}',
      args: { player, action },
    })

    switch (action) {
      case 'Tactical Action':
        this._tacticalAction(player)
        break
      case 'Strategic Action':
        this._strategicAction(player)
        break
      case 'Component Action':
        this._componentAction(player)
        break
      case 'Pass':
        player.pass()
        this.log.add({
          template: '{player} passes',
          args: { player },
        })
        break
    }
  }

  this.log.outdent()
}

Twilight.prototype.statusPhase = function() {
  this.state.phase = 'status'
  this.log.add({ template: 'Status Phase' })
  this.log.indent()

  // Step 1: Score objectives (in initiative order)
  // TODO: Implement objective scoring

  // Step 2: Reveal public objective
  // TODO: Implement objective reveal

  // Step 3: Draw action cards
  // TODO: Implement action card draw

  // Step 4: Remove command tokens from board
  for (const systemId of Object.keys(this.state.systems)) {
    this.state.systems[systemId].commandTokens = []
  }

  // Step 5: Gain and redistribute command tokens
  for (const player of this.players.all()) {
    // Gain 2 tokens (Sol gets 3 via Versatile ability)
    const bonusTokens = player.faction.abilities?.some(a => a.id === 'versatile') ? 1 : 0
    const newTokens = 2 + bonusTokens

    // For now, add to tactics pool. Later: let player distribute.
    const selection = this.actions.choose(player, ['Done'], {
      title: `Redistribute Command Tokens (+${newTokens})`,
      allowsAction: 'redistribute-tokens',
    })

    if (selection.action === 'redistribute-tokens') {
      player.setCommandTokens(selection)
    }
    else {
      // Default: add all to tactics
      player.commandTokens.tactics += newTokens
    }
  }

  // Step 6: Ready cards
  for (const planetId of Object.keys(this.state.planets)) {
    this.state.planets[planetId].exhausted = false
  }

  // Step 7: Repair units (remove damage)
  for (const systemId of Object.keys(this.state.units)) {
    const systemUnits = this.state.units[systemId]
    for (const unit of systemUnits.space) {
      unit.damaged = false
    }
    for (const planetUnits of Object.values(systemUnits.planets)) {
      for (const unit of planetUnits) {
        unit.damaged = false
      }
    }
  }

  // Step 8: Return strategy cards
  for (const player of this.players.all()) {
    player.returnStrategyCard()
  }

  this.log.outdent()
}

Twilight.prototype.agendaPhase = function() {
  this.state.phase = 'agenda'
  this.log.add({ template: 'Agenda Phase' })
  // TODO: Implement agenda phase
}


////////////////////////////////////////////////////////////////////////////////
// Action stubs

Twilight.prototype._tacticalAction = function(player) {
  this.log.indent()

  // Step 1: Activate a system
  const activateSelection = this.actions.choose(player, ['Done'], {
    title: 'Activate System',
    allowsAction: 'activate-system',
  })

  if (activateSelection.action !== 'activate-system') {
    this.log.outdent()
    return
  }

  const systemId = String(activateSelection.systemId)
  player.spendTacticToken()
  this.state.systems[systemId].commandTokens.push(player.name)

  this.log.add({
    template: '{player} activates system {system}',
    args: { player, system: systemId },
  })

  // Step 2: Move ships
  this._movementStep(player, systemId)

  // Step 3: Space combat
  // TODO: Implement space combat

  // Step 4: Invasion
  // TODO: Implement invasion

  // Step 5: Production
  // TODO: Implement production

  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Movement

Twilight.prototype._movementStep = function(player, targetSystemId) {
  const moveSelection = this.actions.choose(player, ['Done'], {
    title: 'Move Ships',
    allowsAction: 'move-ships',
  })

  if (moveSelection.action !== 'move-ships') {
    return
  }

  const movements = moveSelection.movements || []
  if (movements.length === 0) {
    return
  }

  const galaxy = new (require('./model/Galaxy.js').Galaxy)(this)

  // Separate ship movements from transported units
  const shipMovements = []
  const transportedUnits = []

  for (const m of movements) {
    const unitDef = res.getUnit(m.unitType)
    if (!unitDef) {
      continue
    }

    if (unitDef.category === 'ship' && !unitDef.requiresCapacity) {
      shipMovements.push(m)
    }
    else {
      transportedUnits.push(m)
    }
  }

  // Validate and execute ship movements
  const movedShips = []
  for (const m of shipMovements) {
    const fromSystemId = String(m.from)

    // Cannot move ships from a system with own command token
    if (this.state.systems[fromSystemId]?.commandTokens.includes(player.name)) {
      continue
    }

    const unitDef = res.getUnit(m.unitType)
    const path = galaxy.findPath(fromSystemId, targetSystemId, player.name, unitDef.move)
    if (!path) {
      continue  // Ship cannot reach the target
    }

    // Move units (up to count)
    const systemUnits = this.state.units[fromSystemId]
    if (!systemUnits) {
      continue
    }

    for (let i = 0; i < m.count; i++) {
      const unitIdx = systemUnits.space.findIndex(
        u => u.owner === player.name && u.type === m.unitType
      )
      if (unitIdx === -1) {
        break
      }

      const unit = systemUnits.space.splice(unitIdx, 1)[0]
      this.state.units[targetSystemId].space.push(unit)
      movedShips.push(unit)
    }
  }

  // Check fleet pool limit (non-fighter ships in target system)
  const fleetLimit = player.commandTokens.fleet
  const nonFighterShips = this.state.units[targetSystemId].space
    .filter(u => u.owner === player.name && u.type !== 'fighter')
  if (nonFighterShips.length > fleetLimit) {
    // Remove excess ships (return to origin — for now, just remove the last moved)
    const excess = nonFighterShips.length - fleetLimit
    for (let i = 0; i < excess; i++) {
      const lastMoved = movedShips.pop()
      if (lastMoved && lastMoved.type !== 'fighter') {
        const idx = this.state.units[targetSystemId].space.findIndex(u => u.id === lastMoved.id)
        if (idx !== -1) {
          this.state.units[targetSystemId].space.splice(idx, 1)
          // Return to origin — find origin from movements
          const origin = shipMovements.find(m => m.unitType === lastMoved.type)?.from
          if (origin) {
            this.state.units[String(origin)].space.push(lastMoved)
          }
        }
      }
    }
  }

  // Calculate total transport capacity of ships in target system
  let totalCapacity = 0
  for (const unit of this.state.units[targetSystemId].space) {
    if (unit.owner === player.name) {
      const unitDef = res.getUnit(unit.type)
      if (unitDef) {
        totalCapacity += unitDef.capacity || 0
      }
    }
  }

  // Count units already being transported (fighters + ground forces already in system)
  let usedCapacity = 0
  for (const unit of this.state.units[targetSystemId].space) {
    if (unit.owner === player.name) {
      const unitDef = res.getUnit(unit.type)
      if (unitDef?.requiresCapacity) {
        usedCapacity++
      }
    }
  }

  // Transport units (fighters stay in space, ground forces go to planets)
  const targetTile = res.getSystemTile(targetSystemId) || res.getSystemTile(Number(targetSystemId))
  const firstPlanet = targetTile?.planets[0]

  for (const m of transportedUnits) {
    const fromSystemId = String(m.from)
    const unitDef = res.getUnit(m.unitType)
    if (!unitDef) {
      continue
    }

    const systemUnits = this.state.units[fromSystemId]
    if (!systemUnits) {
      continue
    }

    for (let i = 0; i < m.count; i++) {
      if (usedCapacity >= totalCapacity) {
        break  // No more capacity
      }

      // Find the unit in the from system (check space for fighters, planets for ground forces)
      let unit = null
      if (unitDef.category === 'ship') {
        // Fighters are in space
        const idx = systemUnits.space.findIndex(
          u => u.owner === player.name && u.type === m.unitType
        )
        if (idx !== -1) {
          unit = systemUnits.space.splice(idx, 1)[0]
        }
      }
      else if (unitDef.category === 'ground') {
        // Ground forces are on planets
        for (const planetId of Object.keys(systemUnits.planets)) {
          const idx = systemUnits.planets[planetId].findIndex(
            u => u.owner === player.name && u.type === m.unitType
          )
          if (idx !== -1) {
            unit = systemUnits.planets[planetId].splice(idx, 1)[0]
            break
          }
        }
      }

      if (!unit) {
        break
      }

      // Place the unit
      if (unitDef.category === 'ship') {
        // Fighters go to space
        this.state.units[targetSystemId].space.push(unit)
      }
      else if (firstPlanet) {
        // Ground forces go to the first planet
        if (!this.state.units[targetSystemId].planets[firstPlanet]) {
          this.state.units[targetSystemId].planets[firstPlanet] = []
        }
        this.state.units[targetSystemId].planets[firstPlanet].push(unit)
      }

      usedCapacity++
    }
  }

  if (movedShips.length > 0 || transportedUnits.length > 0) {
    this.log.add({
      template: '{player} moves ships to system {system}',
      args: { player, system: targetSystemId },
    })
  }
}

Twilight.prototype._strategicAction = function(player) {
  this.log.indent()
  const usedCardId = player.useStrategyCard()

  this.log.add({
    template: '{player} uses {card}',
    args: { player, card: res.getStrategyCard(usedCardId).name },
  })

  // TODO: Resolve primary and secondary abilities

  this.log.outdent()
}

Twilight.prototype._componentAction = function(_player) {
  this.log.indent()
  // TODO: Implement component actions
  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Victory

Twilight.prototype._checkVictory = function() {
  for (const player of this.players.all()) {
    if (player.getVictoryPoints() >= 10) {
      this.youWin(player, `${player.name} has reached 10 victory points!`)
    }
  }
}
