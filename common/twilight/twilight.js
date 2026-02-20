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
  this._spaceCombat(player, systemId)

  // Step 4: Invasion
  this._invasionStep(player, systemId)

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

  // Transport units (fighters and ground forces go to space area — in transit)
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

      // All transported units go to space area (in transit)
      this.state.units[targetSystemId].space.push(unit)
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

////////////////////////////////////////////////////////////////////////////////
// Space Combat

Twilight.prototype._spaceCombat = function(player, systemId) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return
  }

  // Find all players with ships in the system
  const playerShips = {}
  for (const unit of systemUnits.space) {
    if (!playerShips[unit.owner]) {
      playerShips[unit.owner] = []
    }
    playerShips[unit.owner].push(unit)
  }

  // Need exactly 2 players with ships for combat
  const combatants = Object.keys(playerShips)
  if (combatants.length < 2) {
    return
  }

  const attacker = player.name
  const defender = combatants.find(name => name !== attacker)
  if (!defender) {
    return
  }

  this.log.add({
    template: 'Space combat in system {system}',
    args: { system: systemId },
  })
  this.log.indent()

  // Anti-Fighter Barrage (before combat)
  this._antiFighterBarrage(systemId, attacker, defender)

  // Combat rounds
  let round = 0
  const MAX_ROUNDS = 20  // safety limit
  while (round < MAX_ROUNDS) {
    round++

    const attackerShips = systemUnits.space.filter(u => u.owner === attacker)
    const defenderShips = systemUnits.space.filter(u => u.owner === defender)

    if (attackerShips.length === 0 || defenderShips.length === 0) {
      break
    }

    // Both sides roll simultaneously
    const attackerHits = this._rollCombatDice(attackerShips)
    const defenderHits = this._rollCombatDice(defenderShips)

    this.log.add({
      template: 'Round {round}: attacker scores {aHits} hits, defender scores {dHits} hits',
      args: { round, aHits: attackerHits, dHits: defenderHits },
    })

    // Assign hits (auto-assign: sustain damage first, then cheapest units)
    this._assignHits(systemId, defender, attackerHits)
    this._assignHits(systemId, attacker, defenderHits)
  }

  this.log.outdent()
}

Twilight.prototype._antiFighterBarrage = function(systemId, attacker, defender) {
  const systemUnits = this.state.units[systemId]

  // Both sides can have AFB
  for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
    const ships = systemUnits.space.filter(u => u.owner === shooter)
    let totalAFBHits = 0

    for (const ship of ships) {
      const unitDef = res.getUnit(ship.type)
      if (!unitDef) {
        continue
      }

      // Parse AFB ability: 'anti-fighter-barrage-Nx#' where N is combat value, # is dice count
      const afbAbility = unitDef.abilities.find(a => a.startsWith('anti-fighter-barrage-'))
      if (!afbAbility) {
        continue
      }

      const parts = afbAbility.replace('anti-fighter-barrage-', '').split('x')
      const combatValue = parseInt(parts[0])
      const diceCount = parseInt(parts[1])

      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(this.random() * 10) + 1
        if (roll >= combatValue) {
          totalAFBHits++
        }
      }
    }

    // AFB hits only affect fighters
    if (totalAFBHits > 0) {
      this.log.add({
        template: '{shooter} scores {hits} anti-fighter barrage hits',
        args: { shooter, hits: totalAFBHits },
      })

      for (let i = 0; i < totalAFBHits; i++) {
        const fighterIdx = systemUnits.space.findIndex(
          u => u.owner === target && u.type === 'fighter'
        )
        if (fighterIdx !== -1) {
          systemUnits.space.splice(fighterIdx, 1)
        }
      }
    }
  }
}

Twilight.prototype._rollCombatDice = function(ships) {
  let hits = 0
  for (const ship of ships) {
    const unitDef = res.getUnit(ship.type)
    if (!unitDef || !unitDef.combat) {
      continue
    }

    // Each ship rolls 1 die (war suns roll 3 dice per their combat value)
    const diceCount = unitDef.type === 'war-sun' ? 3 : 1
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(this.random() * 10) + 1
      if (roll >= unitDef.combat) {
        hits++
      }
    }
  }
  return hits
}

Twilight.prototype._assignHits = function(systemId, ownerName, hits) {
  if (hits <= 0) {
    return
  }

  const systemUnits = this.state.units[systemId]
  let remainingHits = hits

  // First, sustain damage on undamaged ships that have the ability
  const sustainableShips = systemUnits.space
    .filter(u => u.owner === ownerName && !u.damaged)
    .filter(u => {
      const def = res.getUnit(u.type)
      return def && def.abilities.includes('sustain-damage')
    })
    // Prioritize most expensive ships for sustain
    .sort((a, b) => {
      const defA = res.getUnit(a.type)
      const defB = res.getUnit(b.type)
      return (defB?.cost || 0) - (defA?.cost || 0)
    })

  for (const ship of sustainableShips) {
    if (remainingHits <= 0) {
      break
    }
    ship.damaged = true
    remainingHits--
  }

  // Then destroy cheapest ships first
  while (remainingHits > 0) {
    const ships = systemUnits.space.filter(u => u.owner === ownerName)
    if (ships.length === 0) {
      break
    }

    // Sort by cost ascending (destroy cheapest first)
    ships.sort((a, b) => {
      const defA = res.getUnit(a.type)
      const defB = res.getUnit(b.type)
      return (defA?.cost || 0) - (defB?.cost || 0)
    })

    const target = ships[0]
    const idx = systemUnits.space.findIndex(u => u.id === target.id)
    if (idx !== -1) {
      systemUnits.space.splice(idx, 1)
    }
    remainingHits--
  }
}


////////////////////////////////////////////////////////////////////////////////
// Invasion

Twilight.prototype._invasionStep = function(player, systemId) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return
  }

  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  if (!tile || tile.planets.length === 0) {
    // No planets — just discard any ground forces in space (can't exist without planet)
    this._discardGroundForcesInSpace(systemId, player.name)
    return
  }

  // Find ground forces in space (in transit)
  const groundForcesInSpace = systemUnits.space
    .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')

  // Find enemy-controlled planets in this system
  const enemyPlanets = tile.planets.filter(planetId => {
    const planetState = this.state.planets[planetId]
    return planetState && planetState.controller && planetState.controller !== player.name
  })

  if (enemyPlanets.length > 0 && groundForcesInSpace.length > 0) {
    // Invasion! Attack the first enemy planet
    const targetPlanet = enemyPlanets[0]

    // Step 1: Bombardment
    this._bombardment(systemId, targetPlanet, player.name)

    // Step 2: Commit ground forces from space to the planet
    this._commitGroundForces(systemId, targetPlanet, player.name)

    // Step 3: Ground combat
    this._groundCombat(systemId, targetPlanet, player.name)

    // Step 4: Establish control
    this._establishControl(systemId, targetPlanet, player.name)
  }
  else {
    // No enemy planets — auto-place ground forces on the first friendly/empty planet
    this._autoPlaceGroundForces(systemId, player.name, tile)
  }
}

Twilight.prototype._bombardment = function(systemId, planetId, attackerName) {
  const systemUnits = this.state.units[systemId]
  const planetUnits = systemUnits.planets[planetId] || []

  // Check for planetary shield on defending units
  const defenderName = this.state.planets[planetId]?.controller
  if (!defenderName) {
    return
  }

  const hasShield = planetUnits.some(u => {
    if (u.owner !== defenderName) {
      return false
    }
    const def = res.getUnit(u.type)
    return def && def.abilities.includes('planetary-shield')
  })

  // Ships with bombardment ability fire at the planet
  const attackerShips = systemUnits.space.filter(u => u.owner === attackerName)
  let totalHits = 0

  for (const ship of attackerShips) {
    const unitDef = res.getUnit(ship.type)
    if (!unitDef) {
      continue
    }

    // Parse bombardment ability: 'bombardment-NxD' where N is combat value, D is dice count
    const bombAbility = unitDef.abilities.find(a => a.startsWith('bombardment-'))
    if (!bombAbility) {
      continue
    }

    const parts = bombAbility.replace('bombardment-', '').split('x')
    const combatValue = parseInt(parts[0])
    const diceCount = parseInt(parts[1])

    // War suns ignore planetary shield; other bombardment is blocked by it
    const isWarSun = unitDef.type === 'war-sun'
    if (hasShield && !isWarSun) {
      continue
    }

    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(this.random() * 10) + 1
      if (roll >= combatValue) {
        totalHits++
      }
    }
  }

  if (totalHits > 0) {
    this.log.add({
      template: '{attacker} bombardment scores {hits} hits on {planet}',
      args: { attacker: attackerName, hits: totalHits, planet: planetId },
    })

    // Auto-assign bombardment hits to defender's ground forces (cheapest first)
    this._assignGroundHits(systemId, planetId, defenderName, totalHits)
  }
}

Twilight.prototype._commitGroundForces = function(systemId, planetId, ownerName) {
  const systemUnits = this.state.units[systemId]

  // Move all ground forces from space to the planet
  const toCommit = []
  for (let i = systemUnits.space.length - 1; i >= 0; i--) {
    const unit = systemUnits.space[i]
    if (unit.owner === ownerName) {
      const unitDef = res.getUnit(unit.type)
      if (unitDef?.category === 'ground') {
        toCommit.push(systemUnits.space.splice(i, 1)[0])
      }
    }
  }

  if (!systemUnits.planets[planetId]) {
    systemUnits.planets[planetId] = []
  }

  for (const unit of toCommit) {
    systemUnits.planets[planetId].push(unit)
  }
}

Twilight.prototype._groundCombat = function(systemId, planetId, attackerName) {
  const systemUnits = this.state.units[systemId]
  const planetUnits = systemUnits.planets[planetId]
  if (!planetUnits) {
    return
  }

  const defenderName = this.state.planets[planetId]?.controller
  if (!defenderName) {
    return
  }

  const attackerForces = planetUnits.filter(u => u.owner === attackerName)
  const defenderForces = planetUnits.filter(u => u.owner === defenderName)

  if (attackerForces.length === 0 || defenderForces.length === 0) {
    return
  }

  this.log.add({
    template: 'Ground combat on {planet}',
    args: { planet: planetId },
  })

  let round = 0
  const MAX_ROUNDS = 20
  while (round < MAX_ROUNDS) {
    round++

    const attackers = planetUnits.filter(u => u.owner === attackerName)
    const defenders = planetUnits.filter(u => u.owner === defenderName)

    if (attackers.length === 0 || defenders.length === 0) {
      break
    }

    const attackerHits = this._rollCombatDice(attackers)
    const defenderHits = this._rollCombatDice(defenders)

    this._assignGroundHits(systemId, planetId, defenderName, attackerHits)
    this._assignGroundHits(systemId, planetId, attackerName, defenderHits)
  }
}

Twilight.prototype._assignGroundHits = function(systemId, planetId, ownerName, hits) {
  if (hits <= 0) {
    return
  }

  const planetUnits = this.state.units[systemId].planets[planetId]
  if (!planetUnits) {
    return
  }

  let remainingHits = hits

  // First, sustain damage on undamaged units (mechs)
  const sustainableUnits = planetUnits
    .filter(u => u.owner === ownerName && !u.damaged)
    .filter(u => {
      const def = res.getUnit(u.type)
      return def && def.abilities.includes('sustain-damage')
    })
    .sort((a, b) => {
      const defA = res.getUnit(a.type)
      const defB = res.getUnit(b.type)
      return (defB?.cost || 0) - (defA?.cost || 0)
    })

  for (const unit of sustainableUnits) {
    if (remainingHits <= 0) {
      break
    }
    unit.damaged = true
    remainingHits--
  }

  // Then destroy cheapest units first
  while (remainingHits > 0) {
    const units = planetUnits.filter(u => u.owner === ownerName)
    if (units.length === 0) {
      break
    }

    units.sort((a, b) => {
      const defA = res.getUnit(a.type)
      const defB = res.getUnit(b.type)
      return (defA?.cost || 0) - (defB?.cost || 0)
    })

    const target = units[0]
    const idx = planetUnits.findIndex(u => u.id === target.id)
    if (idx !== -1) {
      planetUnits.splice(idx, 1)
    }
    remainingHits--
  }
}

Twilight.prototype._establishControl = function(systemId, planetId, attackerName) {
  const planetUnits = this.state.units[systemId].planets[planetId] || []
  const defenderName = this.state.planets[planetId]?.controller

  const attackerForces = planetUnits.filter(u => u.owner === attackerName)
  const defenderForces = defenderName
    ? planetUnits.filter(u => u.owner === defenderName)
    : []

  if (attackerForces.length > 0 && defenderForces.length === 0) {
    // Attacker wins — destroy defender structures and take control
    if (defenderName) {
      const structuresToRemove = planetUnits.filter(u => {
        if (u.owner !== defenderName) {
          return false
        }
        const def = res.getUnit(u.type)
        return def?.category === 'structure'
      })
      for (const structure of structuresToRemove) {
        const idx = planetUnits.findIndex(u => u.id === structure.id)
        if (idx !== -1) {
          planetUnits.splice(idx, 1)
        }
      }
    }

    this.state.planets[planetId].controller = attackerName
    this.state.planets[planetId].exhausted = true  // newly gained planets are exhausted

    this.log.add({
      template: '{player} takes control of {planet}',
      args: { player: attackerName, planet: planetId },
    })

    // Check for Mecatol Rex custodians
    if (planetId === 'mecatol-rex' && !this.state.custodiansRemoved) {
      this.state.custodiansRemoved = true
      const player = this.players.byName(attackerName)
      player.addVictoryPoints(1)

      this.log.add({
        template: '{player} removes the Custodians Token and gains 1 VP!',
        args: { player: attackerName },
      })
    }
  }
}

Twilight.prototype._autoPlaceGroundForces = function(systemId, ownerName, tile) {
  const systemUnits = this.state.units[systemId]

  // Find ground forces in space
  const groundForces = []
  for (let i = systemUnits.space.length - 1; i >= 0; i--) {
    const unit = systemUnits.space[i]
    if (unit.owner === ownerName) {
      const unitDef = res.getUnit(unit.type)
      if (unitDef?.category === 'ground') {
        groundForces.push(systemUnits.space.splice(i, 1)[0])
      }
    }
  }

  if (groundForces.length === 0) {
    return
  }

  // Place on first planet
  const targetPlanet = tile.planets[0]
  if (!systemUnits.planets[targetPlanet]) {
    systemUnits.planets[targetPlanet] = []
  }

  for (const unit of groundForces) {
    systemUnits.planets[targetPlanet].push(unit)
  }

  // Take control if uncontrolled
  if (!this.state.planets[targetPlanet]?.controller) {
    this.state.planets[targetPlanet].controller = ownerName
    this.state.planets[targetPlanet].exhausted = true

    // Check for Mecatol Rex custodians
    if (targetPlanet === 'mecatol-rex' && !this.state.custodiansRemoved) {
      this.state.custodiansRemoved = true
      const player = this.players.byName(ownerName)
      player.addVictoryPoints(1)

      this.log.add({
        template: '{player} removes the Custodians Token and gains 1 VP!',
        args: { player: ownerName },
      })
    }
  }
}

Twilight.prototype._discardGroundForcesInSpace = function(systemId, ownerName) {
  const systemUnits = this.state.units[systemId]
  for (let i = systemUnits.space.length - 1; i >= 0; i--) {
    const unit = systemUnits.space[i]
    if (unit.owner === ownerName) {
      const unitDef = res.getUnit(unit.type)
      if (unitDef?.category === 'ground') {
        systemUnits.space.splice(i, 1)
      }
    }
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
