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
const { FactionAbilities } = require('./systems/factionAbilities.js')


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
  this.factionAbilities = new FactionAbilities(this)
}

util.inherit(Game, Twilight)


function TwilightFactory(settings, viewerName) {
  const data = GameFactory(settings)
  data.settings = data.settings || {}
  data.settings.factions = settings.factions || []
  data.settings.randomFactions = settings.randomFactions !== false
  if (settings.keleresSubFaction) {
    data.settings.keleresSubFaction = settings.keleresSubFaction
  }
  if (settings.mapLayout) {
    data.settings.mapLayout = settings.mapLayout
  }
  return new Twilight(data, viewerName)
}


function factoryFromLobby(lobby) {
  return TwilightFactory({
    game: 'Twilight Imperium',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    factions: lobby.options?.factions || [],
    randomFactions: lobby.options?.randomFactions !== false,
    mapLayout: lobby.options?.mapLayout || undefined,
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
  // Expose res module so objectives/abilities can access game data via game.res
  this.res = res

  this._initializeState()
  this._initializeZones()
  this._initializeFactions()
  this._setupPhase()
  this._initializeGalaxy()
  this._initializeStartingUnits()
  this._initializePlanetControl()

  this.state.initializationComplete = true
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

  // Agenda deck (initialized lazily to preserve random seed order for galaxy)
  this.state.agendaDeck = null
  this.state.activeLaws = []
  this.state.lastStrategyCard = null

  // Objectives
  this.state.objectiveDeckI = null   // initialized lazily
  this.state.objectiveDeckII = null  // initialized lazily
  this.state.revealedObjectives = [] // currently revealed public objectives
  this.state.scoredObjectives = {}   // playerName → [objectiveId, ...]

  // Action card deck (initialized lazily)
  this.state.actionCardDeck = null

  // Secret objectives deck (initialized lazily)
  this.state.secretObjectiveDeck = null

  // Exploration decks (initialized lazily)
  this.state.explorationDecks = null
  this.state.exploredPlanets = {}    // planetId → true (tracks which planets have been explored)

  // Faction-specific state
  this.state.sleeperTokens = {}        // { planetId: ownerName } — Titans of Ul
  this.state.capturedUnits = {}         // { playerName: [{ type, originalOwner }] } — Vuil'raith Cabal
  this.state.capturedCommandTokens = {} // { playerName: [otherPlayerName, ...] } — Mahact Gene-Sorcerers
  this.state.nekroPrediction = null     // { playerName, outcome } — Nekro Virus agenda prediction
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
  const allFactions = [...res.getAllFactionIds()]

  // Determine faction assignments
  const assignedFactions = []
  if (factionIds.length > 0) {
    // Pre-set factions (from tests or explicit configuration)
    assignedFactions.push(...factionIds)
  }
  else if (this.settings.randomFactions) {
    // Random: shuffle and take the first N
    this._shuffle(allFactions)
    assignedFactions.push(...allFactions)
  }
  else {
    // Faction selection: each player picks from available factions
    const available = [...allFactions]
    for (const player of this.players.all()) {
      const choices = available.map(id => res.getFaction(id).name)
      const selection = this.actions.choose(player, choices, {
        title: 'Choose your faction',
        noAutoRespond: true,
      })
      const chosenName = selection[0]
      const chosenId = available.find(id => res.getFaction(id).name === chosenName)
      available.splice(available.indexOf(chosenId), 1)
      assignedFactions.push(chosenId)
    }
  }

  const players = this.players.all()
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    const factionId = assignedFactions[i] || allFactions[i]
    player.initializeFaction(factionId)

    // Nomad The Company: initialize 3 agents instead of 1
    if (this.factionAbilities._hasAbility(player, 'the-company')) {
      player.leaders.agents = [
        { id: 'artuno', name: 'Artuno the Betrayer', status: 'ready' },
        { id: 'thundarian', name: 'The Thundarian', status: 'ready' },
        { id: 'mercer', name: 'Field Marshal Mercer', status: 'ready' },
      ]
      delete player.leaders.agent
    }

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

    // Give player their generic promissory notes + faction note
    const genericNotes = res.getGenericPromissoryNotes()
    for (const note of genericNotes) {
      player.addPromissoryNote(note.id, player.name)
    }
    if (player.faction.promissoryNote) {
      player.addPromissoryNote(player.faction.promissoryNote.id, player.name)
      // Empyrean Dark Whispers: gain 1 additional copy of faction promissory note
      if (this.factionAbilities._hasAbility(player, 'dark-whispers')) {
        player.addPromissoryNote(player.faction.promissoryNote.id, player.name)
      }
    }

    // Alliance promissory note
    if (this.factionAbilities._hasAbility(player, 'hubris')) {
      // Mahact Hubris: Alliance note is purged at setup
      // (do not add it)
    }
    else {
      player.addPromissoryNote('alliance', player.name)
    }
  }
}

Twilight.prototype._setupPhase = function() {
  // Handle interactive setup choices (e.g., Keleres sub-faction)
  for (const player of this.players.all()) {
    if (this.factionAbilities._hasAbility(player, 'the-tribunii')) {
      this._keleresSubFactionSetup(player)
    }
  }
}

Twilight.prototype._keleresSubFactionSetup = function(player) {
  // Filter to unplayed factions
  const playedFactions = this.players.all().map(p => p.factionId)
  const subFactionChoices = ['mentak-coalition', 'xxcha-kingdom', 'argent-flight']
    .filter(id => !playedFactions.includes(id))

  if (subFactionChoices.length === 0) {
    return
  }

  let chosenId

  // Check game setting for pre-configured sub-faction (used by tests)
  if (this.settings.keleresSubFaction) {
    chosenId = this.settings.keleresSubFaction
  }
  else {
    const selection = this.actions.choose(player, subFactionChoices, {
      title: 'The Tribunii: Choose a sub-faction to inherit their home system',
      noAutoRespond: true,
    })
    chosenId = selection[0]
  }

  player.keleresSubFaction = chosenId

  const subFaction = res.getFaction(chosenId)
  if (subFaction) {
    player.faction.homeSystem = subFaction.homeSystem
    // Inherit the sub-faction's home planet starting units
    player.faction.startingUnits.planets = subFaction.startingUnits.planets
  }

  this.log.add({
    template: '{player} chooses {faction} as their Keleres sub-faction',
    args: { player, faction: subFaction.name },
  })
}

Twilight.prototype._initializeGalaxy = function() {
  const playerCount = this.players.all().length
  const layoutKey = this.settings?.mapLayout || playerCount
  const layout = res.getLayout(layoutKey)

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

    // Creuss Gate: place gate tile at home position, home system off-map
    if (this.factionAbilities._hasAbility(player, 'creuss-gate')) {
      // Place Creuss Gate (tile 17, delta wormhole, no planets) at home position
      this.state.systems['creuss-gate'] = {
        tileId: 'creuss-gate',
        position,
        commandTokens: [],
      }
      // Place actual home system off-map (connected via delta wormhole)
      this.state.systems['creuss-home'] = {
        tileId: 'creuss-home',
        position: { q: 99, r: 99 },
        commandTokens: [],
      }
    }
    else {
      this.state.systems[homeSystemId] = {
        tileId: homeSystemId,
        position,
        commandTokens: [],
      }
    }
  }

  // Place hyperlane tiles if the layout has them
  const hyperlanePositionSet = new Set()
  if (layout.hyperlanePositions) {
    for (let i = 0; i < layout.hyperlanePositions.length; i++) {
      const pos = layout.hyperlanePositions[i]
      const hlId = `hyperlane-${i}`
      hyperlanePositionSet.add(`${pos.q},${pos.r}`)
      this.state.systems[hlId] = {
        tileId: 'hyperlane',
        position: pos,
        commandTokens: [],
        isHyperlane: true,
      }
    }
    this.state.hyperlaneConnections = layout.hyperlaneConnections
    if (layout.hyperlaneRoutes) {
      this.state.hyperlaneRoutes = layout.hyperlaneRoutes
    }
  }

  // Fill remaining positions with blue and red tiles
  const allPositions = [...layout.ring1, ...layout.ring2, ...(layout.outerPositions || [])]

  // Filter out positions already used by Mecatol, home systems, or hyperlanes
  const usedPositions = new Set()
  usedPositions.add(`${layout.mecatol.q},${layout.mecatol.r}`)
  for (const pos of layout.homePositions) {
    usedPositions.add(`${pos.q},${pos.r}`)
  }
  for (const key of hyperlanePositionSet) {
    usedPositions.add(key)
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
  const layout = res.getLayout(this.players.all().length)
  const players = this.players.all()

  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    const faction = player.faction
    // Creuss Gate: starting units go on creuss-home (off-map), not creuss-gate
    const homeSystemId = this.factionAbilities._hasAbility(player, 'creuss-gate')
      ? 'creuss-home'
      : faction.homeSystem

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

    // Apply bonus trade goods from map layout (e.g. 5-player asymmetric positions)
    const bonus = layout.homePositions[i].bonusTradeGoods
    if (bonus) {
      player.addTradeGoods(bonus)
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

Twilight.prototype._isTechReady = function(player, techId) {
  return player.hasTechnology(techId) && !(player.exhaustedTechs || []).includes(techId)
}

Twilight.prototype._exhaustTech = function(player, techId) {
  if (!player.exhaustedTechs) {
    player.exhaustedTechs = []
  }
  player.exhaustedTechs.push(techId)
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


// Returns unit stats for a given player, applying any researched unit upgrades.
// Falls back to base stats if no upgrade is available.
Twilight.prototype._getUnitStats = function(playerName, unitType) {
  const base = res.getUnit(unitType)
  if (!base) {
    return null
  }

  const player = this.players.byName(playerName)
  if (!player) {
    return base
  }

  // Check if player has researched a unit upgrade for this type
  const techIds = player.getTechIds()
  const allTechs = [...res.getGenericTechnologies()]
  if (player.faction?.factionTechnologies) {
    allTechs.push(...player.faction.factionTechnologies)
  }

  const upgrade = allTechs.find(t => t.unitUpgrade === unitType && techIds.includes(t.id))
  if (!upgrade || !upgrade.stats) {
    return base
  }

  // Merge upgrade stats over base stats
  return { ...base, ...upgrade.stats }
}


////////////////////////////////////////////////////////////////////////////////
// Galaxy helpers

Twilight.prototype._getAdjacentSystems = function(systemId) {
  const system = this.state.systems[systemId]
  if (!system) {
    return []
  }

  // Hyperlane systems are not valid adjacency sources or targets
  if (system.isHyperlane) {
    return []
  }

  const adjacent = []
  const pos = system.position

  // Check physical adjacency (skip hyperlane tiles)
  for (const [otherId, otherSystem] of Object.entries(this.state.systems)) {
    if (otherId === String(systemId)) {
      continue
    }
    if (otherSystem.isHyperlane) {
      continue
    }
    const dist = res.getHexDistance(pos, otherSystem.position)
    if (dist === 1) {
      adjacent.push(otherId)
    }
  }

  // Check hyperlane connections
  if (this.state.hyperlaneConnections) {
    const posKey = `${pos.q},${pos.r}`
    for (const [posA, posB] of this.state.hyperlaneConnections) {
      const keyA = `${posA.q},${posA.r}`
      const keyB = `${posB.q},${posB.r}`
      let targetPos = null
      if (keyA === posKey) {
        targetPos = posB
      }
      else if (keyB === posKey) {
        targetPos = posA
      }
      if (targetPos) {
        // Find the system at the target position
        const targetId = Object.keys(this.state.systems).find(id => {
          const sys = this.state.systems[id]
          return sys.position.q === targetPos.q && sys.position.r === targetPos.r && !sys.isHyperlane
        })
        if (targetId && !adjacent.includes(targetId)) {
          adjacent.push(targetId)
        }
      }
    }
  }

  // Check wormhole adjacency — combine tile wormholes with faction-granted wormholes
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  const tileWormholes = tile ? [...tile.wormholes] : []

  // Creuss quantum-entanglement: home system has alpha + beta wormholes
  if (this.factionAbilities) {
    const factionWormholes = this.factionAbilities.getHomeSystemWormholes(systemId)
    for (const w of factionWormholes) {
      if (!tileWormholes.includes(w)) {
        tileWormholes.push(w)
      }
    }
  }

  if (tileWormholes.length > 0) {
    for (const [otherId, otherSystem] of Object.entries(this.state.systems)) {
      if (otherId === String(systemId)) {
        continue
      }
      if (adjacent.includes(otherId)) {
        continue
      }
      if (otherSystem.isHyperlane) {
        continue
      }

      const otherTile = res.getSystemTile(otherId) || res.getSystemTile(Number(otherId))
      const otherWormholes = otherTile ? [...otherTile.wormholes] : []

      if (this.factionAbilities) {
        const otherFactionWormholes = this.factionAbilities.getHomeSystemWormholes(otherId)
        for (const w of otherFactionWormholes) {
          if (!otherWormholes.includes(w)) {
            otherWormholes.push(w)
          }
        }
      }

      if (otherWormholes.length > 0) {
        const hasMatchingWormhole = tileWormholes.some(w =>
          otherWormholes.includes(w)
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
  // Initial setup draws (only on round 0 → 1 transition)
  if (this.state.round === 0) {
    this._initialDraws()
  }

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


Twilight.prototype._initialDraws = function() {
  // Skip if initial draws are disabled (e.g., in tests)
  if (this.state.skipInitialDraws) {
    return
  }

  this._initSecretObjectiveDeck()

  // Draw 2 secret objectives per player, then let all players pick simultaneously.
  // If the deck is too small for 2 each, auto-assign 1 per player instead.
  const needsSecret = this.players.all().filter(player =>
    !player.secretObjectives || player.secretObjectives.length === 0
  )

  if (needsSecret.length === 0) {
    return
  }

  const canDraw2 = this.state.secretObjectiveDeck.length >= needsSecret.length * 2

  if (!canDraw2) {
    // Not enough cards for a pick — just deal 1 each
    for (const player of needsSecret) {
      if (this.state.secretObjectiveDeck.length === 0) {
        break
      }
      if (!player.secretObjectives) {
        player.secretObjectives = []
      }
      player.secretObjectives.push(this.state.secretObjectiveDeck.pop())
    }
    return
  }

  const playerDraws = []  // { player, drawn: [id, id] }
  for (const player of needsSecret) {
    const drawn = [
      this.state.secretObjectiveDeck.pop(),
      this.state.secretObjectiveDeck.pop(),
    ]
    playerDraws.push({ player, drawn })
  }

  this.log.add({
    template: 'Each player draws 2 secret objectives and keeps 1',
  })

  // All players choose simultaneously
  const selectors = playerDraws.map(({ player, drawn }) => {
    const choices = drawn.map(id => {
      const obj = res.getObjective(id)
      return obj ? `${id}: ${obj.name}` : id
    })
    return {
      actor: player.name,
      title: 'Choose Secret Objective to Keep',
      choices,
    }
  })

  const responses = this.requestInputMany(selectors)

  // Process all choices
  for (let i = 0; i < playerDraws.length; i++) {
    const { player, drawn } = playerDraws[i]
    const response = responses[i]
    const keptId = response.selection[0].split(':')[0]
    const discardedId = drawn.find(id => id !== keptId)

    if (!player.secretObjectives) {
      player.secretObjectives = []
    }
    player.secretObjectives.push(keptId)

    // Return discarded to bottom of deck
    if (discardedId) {
      this.state.secretObjectiveDeck.unshift(discardedId)
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Phase stubs (to be implemented in phase files)

Twilight.prototype.strategyPhase = function() {
  this.state.phase = 'strategy'
  this.log.add({ template: 'Strategy Phase' })
  this.log.indent()

  // Minister of Commerce law: elected player gains 1 TG
  const ministerOutcome = this._getLawOutcome('minister-of-commerce')
  if (ministerOutcome) {
    const minister = this.players.byName(ministerOutcome)
    if (minister) {
      minister.addTradeGoods(1)
      this.log.add({
        template: '{player} gains 1 trade good (Minister of Commerce)',
        args: { player: minister },
      })
    }
  }

  // Keleres council-patronage: replenish commodities + 1 TG at start of strategy phase
  for (const player of this.players.all()) {
    this.factionAbilities.onStrategyPhaseStart(player)
  }

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
  // Naalu Telepathic: always initiative 0 (goes first)
  const turnOrder = this.players.all()
    .filter(p => p.getStrategyCardId())
    .sort((a, b) => {
      const aInit = this._getInitiative(a)
      const bInit = this._getInitiative(b)
      return aInit - bInit
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

    // Check leader unlock conditions at start of each turn
    this._checkLeaderUnlocks()

    // Clear previous player's law blanking
    this.state.lawsBlankedByPlayer = null

    // Keleres laws-order: spend 1 influence to blank all laws this turn
    this.factionAbilities.onTurnStart(player)

    // Player must use strategy card before passing
    const choices = ['Tactical Action', 'Component Action']
    if (!player.hasUsedStrategyCard()) {
      choices.push('Strategic Action')
    }
    // Add action card option if player has action-timing cards
    const actionTimingCards = (player.actionCards || []).filter(c => c.timing === 'action')
    if (actionTimingCards.length > 0) {
      choices.push('Play Action Card')
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

    // Track which neighbors have been traded with this turn
    this.state.transactionsThisTurn = {}

    // Reset secret objective triggers for this action
    this.state.actionPhaseSecretTriggers = {}

    switch (action) {
      case 'Tactical Action':
        this._tacticalAction(player)
        break
      case 'Strategic Action':
        this._strategicAction(player)
        this._resolveSecondaries(player, this.state.lastStrategyCard)
        break
      case 'Component Action':
        this._componentAction(player)
        break
      case 'Play Action Card':
        this._playActionCard(player)
        break
      case 'Pass':
        player.pass()
        this.state.lastPlayerToPassed = player.name
        this.log.add({
          template: '{player} passes',
          args: { player },
        })
        break
    }

    // Check for action phase secret objective scoring
    if (action !== 'Pass') {
      this._checkActionPhaseSecrets()
    }

    // After action (except pass), offer transaction window
    if (action !== 'Pass') {
      this._offerTransactions(player)
    }

    // Fleet Logistics: allow one additional action per turn
    if (action !== 'Pass' && !this.state.fleetLogisticsUsed?.[player.name]
        && player.hasTechnology('fleet-logistics')) {
      if (!this.state.fleetLogisticsUsed) {
        this.state.fleetLogisticsUsed = {}
      }
      this.state.fleetLogisticsUsed[player.name] = true

      // Offer second action
      const bonusChoices = ['Tactical Action', 'Component Action']
      if (!player.hasUsedStrategyCard()) {
        bonusChoices.push('Strategic Action')
      }
      const bonusActionCards = (player.actionCards || []).filter(c => c.timing === 'action')
      if (bonusActionCards.length > 0) {
        bonusChoices.push('Play Action Card')
      }
      bonusChoices.push('Decline')

      const bonusSelection = this.actions.choose(player, bonusChoices, {
        title: 'Fleet Logistics: Choose additional action',
      })
      const bonusAction = bonusSelection[0]

      if (bonusAction !== 'Decline') {
        this.log.add({
          template: '{player} uses Fleet Logistics: {action}',
          args: { player, action: bonusAction },
        })

        // Reset secret triggers for bonus action
        this.state.actionPhaseSecretTriggers = {}

        switch (bonusAction) {
          case 'Tactical Action':
            this._tacticalAction(player)
            break
          case 'Strategic Action':
            this._strategicAction(player)
            this._resolveSecondaries(player, this.state.lastStrategyCard)
            break
          case 'Component Action':
            this._componentAction(player)
            break
          case 'Play Action Card':
            this._playActionCard(player)
            break
        }

        this._checkActionPhaseSecrets()

        if (bonusAction !== 'Decline') {
          this._offerTransactions(player)
        }
      }
    }
  }

  // Prove Endurance: last player to pass scores this secret
  if (this.state.lastPlayerToPassed) {
    this.state.actionPhaseSecretTriggers = {}
    this._recordSecretTrigger(this.state.lastPlayerToPassed, 'prove-endurance')
    this._checkActionPhaseSecrets()
  }

  // Reset Fleet Logistics tracking at end of action phase
  this.state.fleetLogisticsUsed = {}

  this.log.outdent()
}

Twilight.prototype.statusPhase = function() {
  this.state.phase = 'status'
  this.log.add({ template: 'Status Phase' })
  this.log.indent()

  // Step 0: Faction status phase abilities
  for (const player of this._getPlayersInInitiativeOrder()) {
    this.factionAbilities.onStatusPhaseStart(player)
  }

  // Step 1: Score objectives (in initiative order)
  this._scoreObjectives()

  // Step 2: Reveal public objective
  this._revealObjective()

  // Step 3: Draw action cards (each player draws 1; Neural Motivator draws 2)
  for (const player of this._getPlayersInInitiativeOrder()) {
    const drawCount = player.hasTechnology('neural-motivator') ? 2 : 1
    this._drawActionCards(player, drawCount)
  }

  // Step 3b: Enforce action card hand limit
  for (const player of this.players.all()) {
    const limit = this.factionAbilities.getActionCardHandLimit(player)
    const cards = player.actionCards || []
    while (cards.length > limit) {
      const choices = cards.map(c => c.id)
      const selection = this.actions.choose(player, choices, {
        title: `Discard to hand limit (${cards.length}/${limit})`,
      })
      const cardId = selection[0]
      player.actionCards = player.actionCards.filter(c => c.id !== cardId)
    }
  }

  // Step 4: Remove command tokens from board
  for (const systemId of Object.keys(this.state.systems)) {
    this.state.systems[systemId].commandTokens = []
  }

  // Step 5: Gain and redistribute command tokens
  for (const player of this.players.all()) {
    // Gain 2 tokens (Sol gets 3 via Versatile ability; Hyper Metabolism adds 1)
    const bonusTokens = this.factionAbilities.getStatusPhaseTokenBonus(player)
    const hyperBase = player.hasTechnology('hyper-metabolism') ? 3 : 2
    const newTokens = hyperBase + bonusTokens

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

  // Step 8: Ready agents and exhausted technologies
  for (const player of this.players.all()) {
    if (player.leaders.agents) {
      // Multi-agent (Nomad): ready all agents
      for (const agent of player.leaders.agents) {
        if (agent.status === 'exhausted') {
          agent.status = 'ready'
        }
      }
    }
    else if (player.leaders.agent === 'exhausted') {
      player.readyAgent()
    }
    player.exhaustedTechs = []
  }

  // Step 9: Return strategy cards
  for (const player of this.players.all()) {
    player.returnStrategyCard()
  }

  this.log.outdent()
}

Twilight.prototype.agendaPhase = function() {
  this.state.phase = 'agenda'
  this.log.add({ template: 'Agenda Phase' })
  this.log.indent()

  // Resolve 2 agendas
  for (let i = 0; i < 2; i++) {
    this._resolveAgenda(i + 1)
  }

  // Ready all planets after agenda phase
  for (const [, planetState] of Object.entries(this.state.planets)) {
    planetState.exhausted = false
  }

  this.log.outdent()
}

Twilight.prototype._resolveAgenda = function(agendaNumber) {
  // Draw agenda card from deck
  let agenda = this._drawAgendaCard()
  if (!agenda) {
    return
  }

  this.log.add({
    template: `Agenda ${agendaNumber}: {name}`,
    args: { name: agenda.name },
  })
  this.log.indent()

  // Faction abilities on agenda revealed (e.g., Xxcha Quash)
  const replacement = this.factionAbilities.onAgendaRevealed(agenda)
  if (replacement) {
    agenda = replacement
    this.log.add({
      template: 'New agenda: {name}',
      args: { name: agenda.name },
    })
  }

  // Determine outcomes based on agenda type
  let outcomes
  if (agenda.outcomeType === 'for-against') {
    outcomes = ['For', 'Against']
  }
  else if (agenda.outcomeType === 'elect-player') {
    outcomes = this.players.all().map(p => p.name)
  }
  else {
    outcomes = ['For', 'Against']  // fallback
  }

  // Voting: each player votes sequentially, starting left of speaker
  const speakerName = this.state.speaker
  const allPlayers = this.players.all()
  const speakerIndex = allPlayers.findIndex(p => p.name === speakerName)
  let votingOrder = []
  for (let j = 1; j <= allPlayers.length; j++) {
    votingOrder.push(allPlayers[(speakerIndex + j) % allPlayers.length])
  }

  // Faction abilities modify agenda participation (Argent first, Nekro excluded)
  const participation = this.factionAbilities.getAgendaParticipation(votingOrder)
  votingOrder = participation.order

  // Nekro prediction before voting
  this.factionAbilities.onAgendaVotingStart(agenda, outcomes)

  const votes = {}  // outcome → total votes
  for (const outcome of outcomes) {
    votes[outcome] = 0
  }
  const playerVotes = {}  // playerName → { outcome, count }

  for (const player of votingOrder) {
    // Skip excluded players (e.g., Nekro)
    if (participation.excluded.includes(player.name)) {
      this.log.add({
        template: '{player} cannot vote (Galactic Threat)',
        args: { player },
      })
      continue
    }

    const availableInfluence = player.getTotalInfluence()
    const votingModifier = this.factionAbilities.getVotingModifier(player)
    const voteChoices = ['Abstain', ...outcomes]

    const selection = this.actions.choose(player, voteChoices, {
      title: `Vote on ${agenda.name} (${availableInfluence} influence available)`,
      noAutoRespond: true,
    })

    const chosen = selection[0]
    if (chosen === 'Abstain') {
      this.log.add({
        template: '{player} abstains',
        args: { player },
      })
      continue
    }

    // Player chose an outcome — exhaust planets to cast votes
    const readyPlanets = player.getReadyPlanets()
    if (readyPlanets.length === 0) {
      // No planets to exhaust, but still counts as modifier votes for outcome
      const totalVotes = 0 + votingModifier
      this.log.add({
        template: '{player} votes for {outcome} ({count} votes)',
        args: { player, outcome: chosen, count: totalVotes },
      })
      votes[chosen] = (votes[chosen] || 0) + totalVotes
      playerVotes[player.name] = { outcome: chosen, count: totalVotes }
      continue
    }

    // Choose which planets to exhaust for votes
    const planetChoices = readyPlanets.map(pId => {
      const planet = res.getPlanet(pId)
      return `${pId} (${planet ? planet.influence : 0})`
    })

    const exhaustSelection = this.actions.choose(player, planetChoices, {
      title: `Exhaust planets for votes`,
      min: 0,
      max: readyPlanets.length,
    })

    let totalInfluence = 0
    for (const choice of exhaustSelection) {
      const planetId = choice.split(' (')[0]
      const planet = res.getPlanet(planetId)
      if (planet) {
        totalInfluence += planet.influence
        this.state.planets[planetId].exhausted = true
      }
    }

    totalInfluence += votingModifier
    votes[chosen] = (votes[chosen] || 0) + totalInfluence
    playerVotes[player.name] = { outcome: chosen, count: totalInfluence }

    this.log.add({
      template: '{player} votes for {outcome} ({count} votes)',
      args: { player, outcome: chosen, count: totalInfluence },
    })
  }

  // Resolve outcome
  let winningOutcome = null
  let maxVotes = -1
  const tiedOutcomes = []

  for (const [outcome, count] of Object.entries(votes)) {
    if (count > maxVotes) {
      maxVotes = count
      winningOutcome = outcome
      tiedOutcomes.length = 0
      tiedOutcomes.push(outcome)
    }
    else if (count === maxVotes) {
      tiedOutcomes.push(outcome)
    }
  }

  // Speaker breaks ties
  if (tiedOutcomes.length > 1 || maxVotes === 0) {
    const speaker = this.players.byName(speakerName)
    const tieSelection = this.actions.choose(speaker, tiedOutcomes, {
      title: 'Speaker breaks tie',
      noAutoRespond: true,
    })
    winningOutcome = tieSelection[0]
  }

  this.log.add({
    template: 'Outcome: {outcome} ({count} votes)',
    args: { outcome: winningOutcome, count: maxVotes },
  })

  // Apply agenda effects
  this._resolveAgendaOutcome(agenda, winningOutcome, playerVotes)

  // Faction abilities on agenda outcome (Nekro prediction, Nomad future-sight)
  this.factionAbilities.onAgendaOutcomeResolved(agenda, winningOutcome, playerVotes)

  this.log.outdent()
}

Twilight.prototype._drawAgendaCard = function() {
  // Lazily initialize agenda deck on first draw
  if (!this.state.agendaDeck) {
    const allAgendas = res.getAllAgendaCards()
    const agendaDeck = [...allAgendas]
    this._shuffle(agendaDeck)
    this.state.agendaDeck = agendaDeck
  }
  if (this.state.agendaDeck.length === 0) {
    return null
  }
  return this.state.agendaDeck.shift()
}

Twilight.prototype._resolveAgendaOutcome = function(agenda, outcome, playerVotes) {
  // Resolve specific agenda effects
  if (agenda.id === 'mutiny') {
    if (outcome === 'For') {
      for (const [playerName, vote] of Object.entries(playerVotes)) {
        if (vote.outcome === 'For') {
          const player = this.players.byName(playerName)
          player.addVictoryPoints(1)
          this._checkVictory()
        }
      }
    }
    else {
      for (const [playerName, vote] of Object.entries(playerVotes)) {
        if (vote.outcome === 'Against') {
          const player = this.players.byName(playerName)
          player.addVictoryPoints(1)
          this._checkVictory()
        }
      }
    }
  }

  if (agenda.id === 'committee-formation' && agenda.outcomeType === 'elect-player') {
    this.state.speaker = outcome
  }

  if (agenda.id === 'economic-equality' && outcome === 'For') {
    for (const player of this.players.all()) {
      player.tradeGoods = 5
    }
  }

  // Track active laws
  if (agenda.type === 'law' && outcome !== 'Against') {
    if (!this.state.activeLaws) {
      this.state.activeLaws = []
    }
    this.state.activeLaws.push({
      ...agenda,
      resolvedOutcome: outcome,
    })
  }
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

  // Track tactical action context for action phase secret objective detection
  this.state.currentTacticalAction = {
    activatingPlayer: player.name,
    systemId: systemId,
    promissoryNotesAtStart: {},
  }
  for (const p of this.players.all()) {
    const notes = p.getPromissoryNotes()
    this.state.currentTacticalAction.promissoryNotesAtStart[p.name] =
      notes.map(n => ({ id: n.id, owner: n.owner }))
  }

  this.log.add({
    template: '{player} activates system {system}',
    args: { player, system: systemId },
  })

  // Titans awaken: replace sleeper tokens with PDS
  this.factionAbilities.onSystemActivated(player.name, systemId)

  // Z'eu agent (Naalu): may return the command token to the player's reinforcements
  this.factionAbilities.onCommandTokenPlaced(player.name, systemId)

  // Magen Defense Grid: if activated system has another player's structures,
  // that player with the tech gets to place 1 infantry per structure
  const tileForMagen = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  if (tileForMagen) {
    for (const mPlanetId of tileForMagen.planets) {
      const mPlanetUnits = this.state.units[systemId]?.planets[mPlanetId] || []
      const structuresByOwner = {}
      for (const u of mPlanetUnits) {
        if (u.owner === player.name) {
          continue
        }
        const uDef = res.getUnit(u.type)
        if (uDef?.category === 'structure') {
          structuresByOwner[u.owner] = (structuresByOwner[u.owner] || 0) + 1
        }
      }
      for (const [structOwner, count] of Object.entries(structuresByOwner)) {
        const structPlayer = this.players.byName(structOwner)
        if (structPlayer && structPlayer.hasTechnology('magen-defense-grid')) {
          for (let mi = 0; mi < count; mi++) {
            this._addUnit(systemId, mPlanetId, 'infantry', structOwner)
          }
          this.log.add({
            template: 'Magen Defense Grid: {player} places {count} infantry on {planet}',
            args: { player: structOwner, count, planet: mPlanetId },
          })
        }
      }
    }
  }

  // Scanlink Drone Network: explore 1 planet in activated system with owner's units
  if (player.hasTechnology('scanlink-drone-network')) {
    const scanTile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (scanTile) {
      for (const sPlanetId of scanTile.planets) {
        const sPlanetUnits = this.state.units[systemId]?.planets[sPlanetId] || []
        const hasUnits = sPlanetUnits.some(u => u.owner === player.name)
        const isExplored = this.state.exploredPlanets?.[sPlanetId]
        if (hasUnits && !isExplored) {
          this._explorePlanet(sPlanetId, player.name)
          this.log.add({
            template: 'Scanlink Drone Network: {player} explores {planet}',
            args: { player, planet: sPlanetId },
          })
          break  // only 1 planet per activation
        }
      }
    }
  }

  // Empyrean Aetherpassage: prompt before movement
  this.factionAbilities.onPreMovement(player, systemId)

  // Step 2: Move ships
  this._movementStep(player, systemId)

  // Dark Energy Tap: explore frontier token in activated system if player has ships
  if (player.hasTechnology('dark-energy-tap')) {
    const hasShipsInSystem = this.state.units[systemId]?.space.some(u => u.owner === player.name)
    const deTile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (hasShipsInSystem && deTile && deTile.planets.length === 0) {
      // Frontier system — draw from frontier exploration deck
      if (!this.state.exploredPlanets) {
        this.state.exploredPlanets = {}
      }
      if (!this.state.exploredPlanets[systemId]) {
        this.state.exploredPlanets[systemId] = true
        const card = this._drawExplorationCard('frontier')
        if (card) {
          this.log.add({
            template: 'Dark Energy Tap: {player} explores frontier — {card}',
            args: { player, card: card.name },
          })
          // Apply simple frontier effects (trade goods, relic fragments)
          if (card.tradeGoods) {
            player.addTradeGoods(card.tradeGoods)
          }
          if (card.relicFragment) {
            if (!player.relicFragments) {
              player.relicFragments = []
            }
            player.relicFragments.push(card.relicFragment)
          }
        }
      }
    }
  }

  // Step 2b: Naalu Foresight (after ships enter, before combat)
  this.factionAbilities.onShipsEnterSystem(systemId, player.name)

  // Step 3: Space Cannon Offense (PDS fire at ships)
  this._spaceCannonOffense(player, systemId)

  // Step 4: Space combat (Titans Coalescence forces combat if flagship present)
  this._spaceCombat(player, systemId)

  // Step 5: Invasion (Coalescence: force ground combat if Titans mech on planet)
  this._invasionStep(player, systemId)

  // Step 6: Production
  this._productionStep(player, systemId)

  // Clear aetherpassage grant
  this.state.aetherpassageGrant = null

  // End-of-tactical-action faction triggers (e.g., Sardakk N'orr agent T'ro)
  this.factionAbilities.onTacticalActionEnd(player, systemId)

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
    const unitDef = this._getUnitStats(player.name, m.unitType)
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

    const unitDef = this._getUnitStats(player.name, m.unitType)
    const moveBonus = this.factionAbilities.getMovementBonus(player.name, fromSystemId)
    // Gravity Drive: +1 movement for all ships
    const gravityDriveBonus = player.hasTechnology('gravity-drive') ? 1 : 0
    // Captain Mendosa: override move value for one ship type
    const mendosa = this.state.currentTacticalAction?.mendosaBonus
    const baseMove = (mendosa && mendosa.playerName === player.name && mendosa.shipType === m.unitType)
      ? mendosa.moveValue
      : unitDef.move
    const path = galaxy.findPath(fromSystemId, targetSystemId, player.name, baseMove + moveBonus + gravityDriveBonus)
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
  const fleetLimit = this._getFleetLimit(player)
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
      const unitDef = this._getUnitStats(unit.owner, unit.type)
      if (unitDef) {
        totalCapacity += unitDef.capacity || 0
      }
    }
  }

  // Count units already being transported (fighters + ground forces already in system)
  let usedCapacity = 0
  for (const unit of this.state.units[targetSystemId].space) {
    if (unit.owner === player.name) {
      const unitDef = this._getUnitStats(unit.owner, unit.type)
      if (unitDef?.requiresCapacity) {
        usedCapacity++
      }
    }
  }

  // Transport units (fighters and ground forces go to space area — in transit)
  for (const m of transportedUnits) {
    const fromSystemId = String(m.from)
    const unitDef = this._getUnitStats(player.name, m.unitType)
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

  // Mentak Ambush (before AFB)
  this.factionAbilities.onSpaceCombatStart(systemId, attacker, defender)

  // Anti-Fighter Barrage (before combat)
  this._antiFighterBarrage(systemId, attacker, defender)

  // Assault Cannon: if a player has 3+ non-fighter ships and this tech, opponent destroys 1 non-fighter
  for (const [acOwner, acTarget] of [[attacker, defender], [defender, attacker]]) {
    const acPlayer = this.players.byName(acOwner)
    if (acPlayer && acPlayer.hasTechnology('assault-cannon')) {
      const ownShips = systemUnits.space.filter(
        u => u.owner === acOwner && u.type !== 'fighter'
      )
      if (ownShips.length >= 3) {
        const targetShips = systemUnits.space.filter(
          u => u.owner === acTarget && u.type !== 'fighter'
        )
        if (targetShips.length > 0) {
          // Destroy cheapest non-fighter
          targetShips.sort((a, b) => {
            const defA = this._getUnitStats(a.owner, a.type)
            const defB = this._getUnitStats(b.owner, b.type)
            return (defA?.cost || 0) - (defB?.cost || 0)
          })
          const victim = targetShips[0]
          const idx = systemUnits.space.findIndex(u => u.id === victim.id)
          if (idx !== -1) {
            systemUnits.space.splice(idx, 1)
            this.log.add({
              template: 'Assault Cannon: {target} loses a {unit}',
              args: { target: acTarget, unit: victim.type },
            })
          }
        }
      }
    }
  }

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

    // Start-of-round faction abilities (e.g., Letnev Munitions Reserves)
    this.factionAbilities.onSpaceCombatRound(systemId, attacker, defender)

    // Both sides roll simultaneously
    const attackerHits = this._rollCombatDice(attackerShips)
    const defenderHits = this._rollCombatDice(defenderShips)

    this.log.add({
      template: 'Round {round}: attacker scores {aHits} hits, defender scores {dHits} hits',
      args: { round, aHits: attackerHits, dHits: defenderHits },
    })

    // Assign hits (auto-assign: sustain damage first, then cheapest units)
    this._assignHits(systemId, defender, attackerHits, attacker)
    this._assignHits(systemId, attacker, defenderHits, defender)

    // Post-round faction abilities (e.g., Yin Devotion)
    this.factionAbilities.afterSpaceCombatRound(systemId, attacker, defender)

    // Check if either side wants to retreat (only after first round)
    if (round >= 1) {
      // Check for pending retreat announcements
      const defenderRetreating = this.state.retreatAnnounced?.[defender]
      const attackerRetreating = this.state.retreatAnnounced?.[attacker]

      if (defenderRetreating) {
        this._executeRetreat(systemId, defender, defenderRetreating)
        delete this.state.retreatAnnounced[defender]
        break
      }
      if (attackerRetreating) {
        this._executeRetreat(systemId, attacker, attackerRetreating)
        delete this.state.retreatAnnounced[attacker]
        break
      }
    }
  }

  // Determine combat winner/loser for faction abilities (Mahact edict)
  const aShipsAfter = systemUnits.space.filter(u => u.owner === attacker)
  const dShipsAfter = systemUnits.space.filter(u => u.owner === defender)
  if (aShipsAfter.length > 0 && dShipsAfter.length === 0) {
    this.factionAbilities.afterCombatResolved(systemId, attacker, defender, 'space')
    this._detectCombatSecrets(systemId, attacker, defender, 'space')
  }
  else if (dShipsAfter.length > 0 && aShipsAfter.length === 0) {
    this.factionAbilities.afterCombatResolved(systemId, defender, attacker, 'space')
    this._detectCombatSecrets(systemId, defender, attacker, 'space')
  }

  this.log.outdent()
}

// Announce retreat: called from action cards or before combat round
Twilight.prototype.announceRetreat = function(playerName, targetSystemId) {
  if (!this.state.retreatAnnounced) {
    this.state.retreatAnnounced = {}
  }
  this.state.retreatAnnounced[playerName] = targetSystemId
}

Twilight.prototype._executeRetreat = function(fromSystemId, playerName, toSystemId) {
  const fromUnits = this.state.units[fromSystemId]

  // Ensure target system unit structure exists
  if (!this.state.units[toSystemId]) {
    this.state.units[toSystemId] = { space: [], planets: {} }
  }

  // Move all ships belonging to this player
  const ships = fromUnits.space.filter(u => u.owner === playerName)
  fromUnits.space = fromUnits.space.filter(u => u.owner !== playerName)

  for (const ship of ships) {
    this.state.units[toSystemId].space.push(ship)
  }

  this.log.add({
    template: '{player} retreats to {system}',
    args: { player: playerName, system: toSystemId },
  })
}

Twilight.prototype._getRetreatTargets = function(systemId, playerName) {
  const adjacentSystems = this._getAdjacentSystems(systemId)
  return adjacentSystems.filter(adjId => {
    const adjUnits = this.state.units[adjId]
    if (!adjUnits) {
      return true
    }
    // Cannot retreat into a system with enemy ships
    return !adjUnits.space.some(u => u.owner !== playerName)
  })
}


Twilight.prototype._antiFighterBarrage = function(systemId, attacker, defender) {
  const systemUnits = this.state.units[systemId]

  // Both sides can have AFB
  for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
    const ships = systemUnits.space.filter(u => u.owner === shooter)
    let totalAFBHits = 0

    for (const ship of ships) {
      const unitDef = this._getUnitStats(ship.owner, ship.type)
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

      let fightersDestroyed = 0
      for (let i = 0; i < totalAFBHits; i++) {
        const fighterIdx = systemUnits.space.findIndex(
          u => u.owner === target && u.type === 'fighter'
        )
        if (fighterIdx !== -1) {
          systemUnits.space.splice(fighterIdx, 1)
          fightersDestroyed++
        }
      }

      // fight-with-precision: destroyed all fighters during AFB
      if (fightersDestroyed > 0) {
        const remainingFighters = systemUnits.space.filter(
          u => u.owner === target && u.type === 'fighter'
        )
        if (remainingFighters.length === 0) {
          this._recordSecretTrigger(shooter, 'fight-with-precision')
        }
      }

      // Argent raid-formation: excess AFB hits apply as sustain-damage to opponent ships
      const excessHits = this.factionAbilities.getRaidFormationExcessHits(
        shooter, totalAFBHits, fightersDestroyed
      )
      if (excessHits > 0) {
        let remaining = excessHits
        // Apply sustain damage to opponent ships
        const sustainShips = systemUnits.space
          .filter(u => u.owner === target && !u.damaged)
          .filter(u => {
            const def = this._getUnitStats(u.owner, u.type)
            return def && def.abilities.includes('sustain-damage')
          })
        for (const ship of sustainShips) {
          if (remaining <= 0) {
            break
          }
          ship.damaged = true
          remaining--
        }
        if (excessHits > 0) {
          this.log.add({
            template: '{shooter} Raid Formation: {hits} excess hits damage ships',
            args: { shooter, hits: excessHits },
          })
        }
      }
    }
  }
}

Twilight.prototype._rollCombatDice = function(ships) {
  let hits = 0
  for (const ship of ships) {
    const unitDef = this._getUnitStats(ship.owner, ship.type)
    if (!unitDef || !unitDef.combat) {
      continue
    }

    // Faction combat modifiers
    const owner = this.players.byName(ship.owner)
    const combatModifier = this.factionAbilities.getCombatModifier(owner)
    const effectiveCombat = Math.max(1, Math.min(unitDef.combat + combatModifier, 10))

    // Each ship rolls 1 die (war suns roll 3 dice per their combat value)
    // bonusDice: temporary extra dice (e.g., Letnev agent Viscount Unlenn)
    const baseDice = unitDef.type === 'war-sun' ? 3 : 1
    const diceCount = baseDice + (ship.bonusDice || 0)
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(this.random() * 10) + 1
      if (roll >= effectiveCombat) {
        hits++
      }
    }
  }
  return hits
}

Twilight.prototype._assignHits = function(systemId, ownerName, hits, destroyerName) {
  if (hits <= 0) {
    return
  }

  // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
  const effectiveHits = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, 'space')
  if (effectiveHits <= 0) {
    return
  }

  const systemUnits = this.state.units[systemId]
  let remainingHits = effectiveHits

  // Track which units just sustained this round (for Duranium Armor)
  const justSustainedIds = new Set()

  // First, sustain damage on undamaged ships that have the ability
  const sustainableShips = systemUnits.space
    .filter(u => u.owner === ownerName && !u.damaged)
    .filter(u => {
      const def = this._getUnitStats(u.owner, u.type)
      return def && def.abilities.includes('sustain-damage')
    })
    // Prioritize most expensive ships for sustain
    .sort((a, b) => {
      const defA = this._getUnitStats(a.owner, a.type)
      const defB = this._getUnitStats(b.owner, b.type)
      return (defB?.cost || 0) - (defA?.cost || 0)
    })

  for (const ship of sustainableShips) {
    if (remainingHits <= 0) {
      break
    }
    ship.damaged = true
    justSustainedIds.add(ship.id)
    remainingHits--
  }

  // Faction hook: after units sustain damage (e.g., Letnev commander)
  if (justSustainedIds.size > 0) {
    this.factionAbilities.onUnitsSustainedDamage(ownerName, systemId, justSustainedIds.size)
  }

  // Then destroy cheapest ships first
  while (remainingHits > 0) {
    const ships = systemUnits.space.filter(u => u.owner === ownerName)
    if (ships.length === 0) {
      break
    }

    // Sort by cost ascending (destroy cheapest first)
    ships.sort((a, b) => {
      const defA = this._getUnitStats(a.owner, a.type)
      const defB = this._getUnitStats(b.owner, b.type)
      return (defA?.cost || 0) - (defB?.cost || 0)
    })

    const target = ships[0]
    const idx = systemUnits.space.findIndex(u => u.id === target.id)
    if (idx !== -1) {
      const removed = systemUnits.space.splice(idx, 1)[0]
      // Track destruction of war suns/flagships for secret objectives
      if (destroyerName && (removed.type === 'war-sun' || removed.type === 'flagship')) {
        this._recordSecretTrigger(destroyerName, 'destroy-their-greatest-ship')
      }
      if (destroyerName) {
        this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, null)
      }
    }
    remainingHits--
  }

  // Duranium Armor: repair 1 damaged unit that did NOT sustain this round
  const owner = this.players.byName(ownerName)
  if (owner && owner.hasTechnology('duranium-armor')) {
    const repairCandidate = systemUnits.space.find(
      u => u.owner === ownerName && u.damaged && !justSustainedIds.has(u.id)
    )
    if (repairCandidate) {
      repairCandidate.damaged = false
    }
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

  // Coalescence: Titans mech on a planet forces ground combat
  const coalescencePlanets = tile.planets.filter(planetId => {
    return this.factionAbilities.checkCoalescenceOnPlanet(systemId, planetId, player.name)
  })

  // Invasion if: enemy planets with ground forces to land, OR coalescence forces combat
  const shouldInvade = (enemyPlanets.length > 0 && groundForcesInSpace.length > 0)
    || coalescencePlanets.length > 0

  if (shouldInvade) {
    // Target the first enemy planet (prefer coalescence planet if no standard invasion target)
    const targetPlanet = (enemyPlanets.length > 0 && groundForcesInSpace.length > 0)
      ? enemyPlanets[0]
      : coalescencePlanets[0]

    // Snapshot defender structures before combat (for L1Z1X Assimilate)
    const defenderName = this.state.planets[targetPlanet]?.controller
    const preInvasionStructures = {}
    if (defenderName) {
      const planetUnits = systemUnits.planets[targetPlanet] || []
      for (const unit of planetUnits) {
        if (unit.owner === defenderName) {
          const def = res.getUnit(unit.type)
          if (def?.category === 'structure') {
            preInvasionStructures[unit.type] = (preInvasionStructures[unit.type] || 0) + 1
          }
        }
      }
    }

    // Step 1: Bombardment
    this._bombardment(systemId, targetPlanet, player.name)

    // Step 2: Space Cannon Defense (PDS fire at landing ground forces)
    this._spaceCannonDefense(systemId, targetPlanet, player.name)

    // Step 3: Commit ground forces from space to the planet
    this._commitGroundForces(systemId, targetPlanet, player.name)

    // Step 4: Ground combat
    this._groundCombat(systemId, targetPlanet, player.name)

    // Step 5: Establish control (pass pre-invasion structure counts)
    this._establishControl(systemId, targetPlanet, player.name, preInvasionStructures)
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
    const def = this._getUnitStats(u.owner, u.type)
    return def && def.abilities.includes('planetary-shield')
  })

  // Ships with bombardment ability fire at the planet
  const attackerShips = systemUnits.space.filter(u => u.owner === attackerName)
  let totalHits = 0
  const attackerPlayer = this.players.byName(attackerName)
  let plasmaUsed = false

  for (const ship of attackerShips) {
    const unitDef = this._getUnitStats(ship.owner, ship.type)
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
    let diceCount = parseInt(parts[1])

    // War suns ignore planetary shield; other bombardment is blocked by it
    const isWarSun = unitDef.type === 'war-sun'
    if (hasShield && !isWarSun) {
      continue
    }

    // Plasma Scoring: +1 die for the first unit that fires bombardment
    if (!plasmaUsed && attackerPlayer.hasTechnology('plasma-scoring')) {
      diceCount++
      plasmaUsed = true
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

    // make-an-example-of-their-world: destroyed all ground forces via bombardment
    const remainingGroundForces = (systemUnits.planets[planetId] || []).filter(u => {
      if (u.owner !== defenderName) {
        return false
      }
      const def = res.getUnit(u.type)
      return def && def.category === 'ground'
    })
    if (remainingGroundForces.length === 0) {
      this._recordSecretTrigger(attackerName, 'make-an-example-of-their-world')
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Space Cannon

/**
 * Space Cannon Offense — fires after movement, before space combat.
 * PDS units in the active system fire at the active player's ships.
 * PDS II (upgraded) can also fire from adjacent systems.
 */
Twilight.prototype._spaceCannonOffense = function(activePlayer, systemId) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return
  }

  // Check if the active player has any ships in the system
  const activeShips = systemUnits.space.filter(u => u.owner === activePlayer.name)
  if (activeShips.length === 0) {
    return
  }

  // Collect all PDS that can fire at this system
  let totalHits = 0
  const plasmaUsedByOwner = {}  // Plasma Scoring: track per-owner first-unit bonus
  // Antimass Deflectors: +1 combat value when firing at target with this tech
  const antimassDefense = activePlayer.hasTechnology('antimass-deflectors') ? 1 : 0

  // 1. PDS in the active system (on planets) belonging to non-active players
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  if (tile) {
    for (const planetId of tile.planets) {
      const planetUnits = systemUnits.planets[planetId] || []
      for (const unit of planetUnits) {
        if (unit.owner === activePlayer.name || unit.type !== 'pds') {
          continue
        }
        // Plasma Scoring: +1 die for first space cannon unit per owner
        let extraDice = 0
        if (!plasmaUsedByOwner[unit.owner]) {
          const owner = this.players.byName(unit.owner)
          if (owner && owner.hasTechnology('plasma-scoring')) {
            extraDice = 1
            plasmaUsedByOwner[unit.owner] = true
          }
        }
        totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense)
      }
    }
  }

  // 2. PDS II in adjacent systems (check if owner has PDS II upgrade)
  const adjacentSystems = this._getAdjacentSystems(systemId)
  for (const adjSystemId of adjacentSystems) {
    const adjSystemUnits = this.state.units[adjSystemId]
    if (!adjSystemUnits) {
      continue
    }
    const adjTile = res.getSystemTile(adjSystemId) || res.getSystemTile(Number(adjSystemId))
    if (!adjTile) {
      continue
    }

    for (const adjPlanetId of adjTile.planets) {
      const adjPlanetUnits = adjSystemUnits.planets[adjPlanetId] || []
      for (const unit of adjPlanetUnits) {
        if (unit.owner === activePlayer.name || unit.type !== 'pds') {
          continue
        }
        // Only PDS II can fire into adjacent systems
        const unitStats = this._getUnitStats(unit.owner, unit.type)
        if (!unitStats) {
          continue
        }
        const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
        if (!scAbility) {
          continue
        }
        // PDS II has space-cannon-5x1; base PDS has space-cannon-6x1
        // Check if owner has pds-ii technology
        const owner = this.players.byName(unit.owner)
        if (owner && owner.hasTechnology('pds-ii')) {
          let extraDice = 0
          if (!plasmaUsedByOwner[unit.owner] && owner.hasTechnology('plasma-scoring')) {
            extraDice = 1
            plasmaUsedByOwner[unit.owner] = true
          }
          totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense)
        }
      }
    }
  }

  // Graviton Laser System: auto-exhaust to force hits onto non-fighter ships
  let gravitonActive = false
  for (const firingOwner of Object.keys(plasmaUsedByOwner).concat(
    // Also check owners who fired but didn't have plasma
    tile ? tile.planets.flatMap(pId =>
      (systemUnits.planets[pId] || [])
        .filter(u => u.owner !== activePlayer.name && u.type === 'pds')
        .map(u => u.owner)
    ) : []
  )) {
    const fp = this.players.byName(firingOwner)
    if (fp && this._isTechReady(fp, 'graviton-laser-system')) {
      this._exhaustTech(fp, 'graviton-laser-system')
      gravitonActive = true
      break
    }
  }

  if (totalHits > 0) {
    this.log.add({
      template: 'Space Cannon Offense scores {hits} hit(s) against {player}',
      args: { hits: totalHits, player: activePlayer },
    })

    // Check if active player had non-fighter ships before SCO (for turn-their-fleets-to-dust)
    const hadNonFighters = activeShips.some(u => u.type !== 'fighter')

    // Active player assigns hits to their ships
    this._assignSpaceCannonHits(systemId, activePlayer.name, totalHits, gravitonActive)

    // turn-their-fleets-to-dust: all non-fighter ships destroyed by space cannon offense
    if (hadNonFighters) {
      const remainingNonFighters = systemUnits.space.filter(
        u => u.owner === activePlayer.name && u.type !== 'fighter'
      )
      if (remainingNonFighters.length === 0) {
        // Credit to all PDS owners who fired
        const pdsOwners = new Set()
        if (tile) {
          for (const pId of tile.planets) {
            for (const u of (systemUnits.planets[pId] || [])) {
              if (u.owner !== activePlayer.name && u.type === 'pds') {
                pdsOwners.add(u.owner)
              }
            }
          }
        }
        for (const owner of pdsOwners) {
          this._recordSecretTrigger(owner, 'turn-their-fleets-to-dust')
        }
      }
    }
  }
}

/**
 * Space Cannon Defense — fires during invasion, before ground combat.
 * PDS and units with Space Cannon ability on the planet fire at invading ground forces.
 */
Twilight.prototype._spaceCannonDefense = function(systemId, planetId, attackerName) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return
  }

  const defenderName = this.state.planets[planetId]?.controller
  if (!defenderName) {
    return
  }

  // Find ground forces in space (not yet committed)
  const groundForcesInSpace = systemUnits.space
    .filter(u => u.owner === attackerName && res.getUnit(u.type)?.category === 'ground')

  if (groundForcesInSpace.length === 0) {
    return
  }

  // Fire space cannon from defender's PDS and other units with space cannon on this planet
  let totalHits = 0
  const planetUnits = systemUnits.planets[planetId] || []
  let defenderPlasmaUsed = false
  // Antimass Deflectors: +1 combat value when firing at target with this tech
  const attackerPlayer = this.players.byName(attackerName)
  const antimassDefense = attackerPlayer && attackerPlayer.hasTechnology('antimass-deflectors') ? 1 : 0

  for (const unit of planetUnits) {
    if (unit.owner !== defenderName) {
      continue
    }
    const unitStats = this._getUnitStats(unit.owner, unit.type)
    if (!unitStats) {
      continue
    }
    const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
    if (scAbility) {
      // Plasma Scoring: +1 die for first space cannon unit
      let extraDice = 0
      if (!defenderPlasmaUsed) {
        const defender = this.players.byName(defenderName)
        if (defender && defender.hasTechnology('plasma-scoring')) {
          extraDice = 1
          defenderPlasmaUsed = true
        }
      }
      totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense)
    }
  }

  if (totalHits > 0) {
    this.log.add({
      template: 'Space Cannon Defense scores {hits} hit(s) against {attacker} on {planet}',
      args: { hits: totalHits, attacker: attackerName, planet: planetId },
    })

    // Hits are assigned to ground forces in space (before they commit)
    // Auto-assign to cheapest ground forces
    this._assignGroundForcesInSpaceHits(systemId, attackerName, totalHits)
  }
}

/**
 * Roll space cannon dice for a single unit.
 * Returns number of hits scored.
 */
Twilight.prototype._fireSpaceCannon = function(ownerName, unitType, extraDice, combatPenalty) {
  const unitStats = this._getUnitStats(ownerName, unitType)
  if (!unitStats) {
    return 0
  }

  const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
  if (!scAbility) {
    return 0
  }

  // Parse space-cannon-NxD where N is combat value, D is dice count
  const parts = scAbility.replace('space-cannon-', '').split('x')
  // Antimass Deflectors: +1 to combat value (harder to hit)
  const combatValue = Math.min(10, parseInt(parts[0]) + (combatPenalty || 0))
  const diceCount = parseInt(parts[1]) + (extraDice || 0)

  let hits = 0
  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(this.random() * 10) + 1
    if (roll >= combatValue) {
      hits++
    }
  }
  return hits
}

/**
 * Assign space cannon offense hits to ships in the system.
 * Auto-assign cheapest first for now.
 */
Twilight.prototype._assignSpaceCannonHits = function(systemId, ownerName, hits, gravitonActive) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits || hits <= 0) {
    return
  }

  // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
  let remaining = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, 'space-cannon')
  if (remaining <= 0) {
    return
  }

  // Graviton Laser System: hits must target non-fighter ships
  const shipFilter = gravitonActive
    ? (u => u.owner === ownerName && u.type !== 'fighter')
    : (u => u.owner === ownerName)

  // Find ships that can sustain damage first
  const ownerShips = systemUnits.space.filter(shipFilter)

  // Sort: cheapest first (destroy cheap ships before expensive ones)
  const costOrder = ownerShips.sort((a, b) => {
    const aDef = this._getUnitStats(a.owner, a.type)
    const bDef = this._getUnitStats(b.owner, b.type)
    return (aDef?.cost || 0) - (bDef?.cost || 0)
  })

  // Check for sustain damage on undamaged units first
  for (const ship of costOrder) {
    if (remaining <= 0) {
      break
    }
    const def = this._getUnitStats(ship.owner, ship.type)
    if (def && def.abilities.includes('sustain-damage') && !ship.damaged) {
      ship.damaged = true
      remaining--
    }
  }

  // Destroy remaining
  for (let i = costOrder.length - 1; i >= 0 && remaining > 0; i--) {
    const idx = systemUnits.space.indexOf(costOrder[i])
    if (idx >= 0) {
      systemUnits.space.splice(idx, 1)
      remaining--
    }
  }
}

/**
 * Assign space cannon defense hits to ground forces in space (pre-commit).
 */
Twilight.prototype._assignGroundForcesInSpaceHits = function(systemId, ownerName, hits) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits || hits <= 0) {
    return
  }

  let remaining = hits

  // Remove ground forces from space
  for (let i = systemUnits.space.length - 1; i >= 0 && remaining > 0; i--) {
    const unit = systemUnits.space[i]
    if (unit.owner === ownerName) {
      const def = res.getUnit(unit.type)
      if (def?.category === 'ground') {
        systemUnits.space.splice(i, 1)
        remaining--
      }
    }
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

  // Pre-combat faction abilities (e.g., Yin Indoctrination)
  this.factionAbilities.onGroundCombatStart(systemId, planetId, attackerName, defenderName)

  // Magen Defense Grid: if planet has defender's structures, produce 1 auto-hit on attacker
  const defenderPlayer = this.players.byName(defenderName)
  if (defenderPlayer && defenderPlayer.hasTechnology('magen-defense-grid')) {
    const defStructures = planetUnits.filter(u => {
      if (u.owner !== defenderName) {
        return false
      }
      const uDef = res.getUnit(u.type)
      return uDef?.category === 'structure'
    })
    if (defStructures.length > 0) {
      this.log.add({
        template: 'Magen Defense Grid: 1 automatic hit on attacker',
        args: {},
      })
      this._assignGroundHits(systemId, planetId, attackerName, 1, defenderName)
    }
  }

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

    this._assignGroundHits(systemId, planetId, defenderName, attackerHits, attackerName)
    this._assignGroundHits(systemId, planetId, attackerName, defenderHits, defenderName)

    // End-of-round faction abilities (e.g., L1Z1X Harrow)
    this.factionAbilities.onGroundCombatRoundEnd(systemId, planetId, attackerName, defenderName)
  }

  // Determine ground combat winner/loser
  const aForcesAfter = planetUnits.filter(u => u.owner === attackerName)
  const dForcesAfter = planetUnits.filter(u => u.owner === defenderName)
  const groundWinner = (aForcesAfter.length > 0 && dForcesAfter.length === 0) ? attackerName
    : (dForcesAfter.length > 0 && aForcesAfter.length === 0) ? defenderName
      : null

  if (groundWinner) {
    const loser = groundWinner === attackerName ? defenderName : attackerName
    this.factionAbilities.afterCombatResolved(systemId, groundWinner, loser, 'ground')
    this._detectCombatSecrets(systemId, groundWinner, loser, 'ground')

    // Dacxive Animators: winner places 1 infantry on the planet
    const winnerPlayer = this.players.byName(groundWinner)
    if (winnerPlayer && winnerPlayer.hasTechnology('dacxive-animators')) {
      this._addUnit(systemId, planetId, 'infantry', groundWinner)
      this.log.add({
        template: 'Dacxive Animators: {player} places 1 infantry on {planet}',
        args: { player: groundWinner, planet: planetId },
      })
    }
  }
}

Twilight.prototype._assignGroundHits = function(systemId, planetId, ownerName, hits, destroyerName) {
  if (hits <= 0) {
    return
  }

  // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
  const effectiveHits = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, 'ground')
  if (effectiveHits <= 0) {
    return
  }
  hits = effectiveHits

  const planetUnits = this.state.units[systemId].planets[planetId]
  if (!planetUnits) {
    return
  }

  let remainingHits = hits
  const justSustainedIds = new Set()

  // First, sustain damage on undamaged units (mechs)
  const sustainableUnits = planetUnits
    .filter(u => u.owner === ownerName && !u.damaged)
    .filter(u => {
      const def = this._getUnitStats(u.owner, u.type)
      return def && def.abilities.includes('sustain-damage')
    })
    .sort((a, b) => {
      const defA = this._getUnitStats(a.owner, a.type)
      const defB = this._getUnitStats(b.owner, b.type)
      return (defB?.cost || 0) - (defA?.cost || 0)
    })

  for (const unit of sustainableUnits) {
    if (remainingHits <= 0) {
      break
    }
    unit.damaged = true
    justSustainedIds.add(unit.id)
    remainingHits--
  }

  // Faction hook: after units sustain damage (e.g., Letnev commander)
  if (justSustainedIds.size > 0) {
    this.factionAbilities.onUnitsSustainedDamage(ownerName, systemId, justSustainedIds.size)
  }

  // Then destroy cheapest units first
  while (remainingHits > 0) {
    const units = planetUnits.filter(u => u.owner === ownerName)
    if (units.length === 0) {
      break
    }

    units.sort((a, b) => {
      const defA = this._getUnitStats(a.owner, a.type)
      const defB = this._getUnitStats(b.owner, b.type)
      return (defA?.cost || 0) - (defB?.cost || 0)
    })

    const target = units[0]
    const idx = planetUnits.findIndex(u => u.id === target.id)
    if (idx !== -1) {
      const removed = planetUnits.splice(idx, 1)[0]
      if (destroyerName) {
        this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, planetId)
      }
    }
    remainingHits--
  }

  // Duranium Armor: repair 1 damaged unit that did NOT sustain this round
  const owner = this.players.byName(ownerName)
  if (owner && owner.hasTechnology('duranium-armor')) {
    const repairCandidate = planetUnits.find(
      u => u.owner === ownerName && u.damaged && !justSustainedIds.has(u.id)
    )
    if (repairCandidate) {
      repairCandidate.damaged = false
    }
  }
}

Twilight.prototype._establishControl = function(systemId, planetId, attackerName, preInvasionStructures) {
  const planetUnits = this.state.units[systemId].planets[planetId] || []
  const defenderName = this.state.planets[planetId]?.controller

  const attackerForces = planetUnits.filter(u => u.owner === attackerName)
  const defenderForces = defenderName
    ? planetUnits.filter(u => u.owner === defenderName)
    : []

  if (attackerForces.length > 0 && defenderForces.length === 0) {
    // Remove any remaining defender structures
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

    // Use pre-invasion structure counts (captured before combat destroyed them)
    const structureCounts = preInvasionStructures || {}

    const previousController = this.state.planets[planetId].controller
    this.state.planets[planetId].controller = attackerName
    this.state.planets[planetId].exhausted = true  // newly gained planets are exhausted

    // become-a-martyr: defender lost a planet in their home system
    if (previousController) {
      const previousPlayer = this.players.byName(previousController)
      if (previousPlayer) {
        const factions = require('./res/factions/index.js')
        const f = factions.getFaction(previousPlayer.factionId)
        if (f && f.homeSystem === systemId) {
          this._recordSecretTrigger(previousController, 'become-a-martyr')
        }
      }
    }

    this.log.add({
      template: '{player} takes control of {planet}',
      args: { player: attackerName, planet: planetId },
    })

    // Explore planet if it wasn't controlled by another player
    if (!previousController) {
      this._explorePlanet(planetId, attackerName)
    }

    // Check for Mecatol Rex custodians
    if (planetId === 'mecatol-rex' && !this.state.custodiansRemoved) {
      const player = this.players.byName(attackerName)
      const cost = this.factionAbilities.getCustodiansCost(player)
      if (cost > 0 && player.getTotalInfluence() < cost) {
        // Cannot afford custodians — skip
      }
      else {
        if (cost > 0) {
          this._payInfluence(player, cost)
        }
        this.state.custodiansRemoved = true
        player.addVictoryPoints(1)

        this.log.add({
          template: '{player} removes the Custodians Token and gains 1 VP!',
          args: { player: attackerName },
        })
      }
    }

    // Faction abilities on planet gained (Saar scavenge, L1Z1X assimilate, Winnu reclamation)
    this.factionAbilities.onPlanetGained(attackerName, planetId, systemId, structureCounts)

    // Integrated Economy: free production up to planet's resource value
    const iePlayer = this.players.byName(attackerName)
    if (iePlayer && iePlayer.hasTechnology('integrated-economy')) {
      const planet = res.getPlanet(planetId)
      if (planet && planet.resources > 0) {
        const prodSel = this.actions.choose(iePlayer, ['Done'], {
          title: `Integrated Economy: Free production (up to ${planet.resources} cost)`,
          allowsAction: 'produce-units',
        })

        if (prodSel.action === 'produce-units') {
          const reqUnits = prodSel.units || []
          let ieCost = 0
          let ieCount = 0
          for (const req of reqUnits) {
            const unitDef = this._getUnitStats(attackerName, req.type)
            if (!unitDef) {
              continue
            }
            for (let ii = 0; ii < req.count; ii++) {
              let unitCost = unitDef.cost
              if (unitDef.costFor > 1 && ii % unitDef.costFor !== 0) {
                unitCost = 0
              }
              if (ieCost + unitCost > planet.resources) {
                break
              }
              ieCost += unitCost
              ieCount++
              if (unitDef.category === 'ship') {
                this._addUnit(systemId, 'space', unitDef.type, attackerName)
              }
              else {
                this._addUnit(systemId, planetId, unitDef.type, attackerName)
              }
            }
          }
          if (ieCount > 0) {
            this.log.add({
              template: 'Integrated Economy: {player} produces {count} free units on {planet}',
              args: { player: attackerName, count: ieCount, planet: planetId },
            })
          }
        }
      }
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

    // Explore newly controlled planet
    this._explorePlanet(targetPlanet, ownerName)

    // Check for Mecatol Rex custodians
    if (targetPlanet === 'mecatol-rex' && !this.state.custodiansRemoved) {
      const player = this.players.byName(ownerName)
      const cost = this.factionAbilities.getCustodiansCost(player)
      if (cost > 0 && player.getTotalInfluence() < cost) {
        // Cannot afford custodians — skip
      }
      else {
        if (cost > 0) {
          this._payInfluence(player, cost)
        }
        this.state.custodiansRemoved = true
        player.addVictoryPoints(1)

        this.log.add({
          template: '{player} removes the Custodians Token and gains 1 VP!',
          args: { player: ownerName },
        })
      }
    }

    // Faction abilities on planet gained
    this.factionAbilities.onPlanetGained(ownerName, targetPlanet, systemId, {})
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


////////////////////////////////////////////////////////////////////////////////
// Production

Twilight.prototype._productionStep = function(player, systemId) {
  const systemUnits = this.state.units[systemId]
  if (!systemUnits) {
    return
  }

  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  if (!tile) {
    return
  }

  // Find space dock(s) on planets in this system owned by this player
  let hasSpaceDock = false
  let productionCapacity = 0

  for (const planetId of tile.planets) {
    const planetUnits = systemUnits.planets[planetId] || []
    const docks = planetUnits.filter(
      u => u.owner === player.name && u.type === 'space-dock'
    )
    if (docks.length > 0) {
      hasSpaceDock = true
      const planet = res.getPlanet(planetId)
      const planetResources = planet ? planet.resources : 0
      const dockDef = this._getUnitStats(player.name, 'space-dock')
      const prodValue = dockDef?.productionValue || 2
      productionCapacity += planetResources + prodValue
    }
  }

  if (!hasSpaceDock) {
    return
  }

  // Check for blockade (enemy ships in space)
  const enemyShips = systemUnits.space.filter(
    u => u.owner !== player.name && res.getUnit(u.type)?.category === 'ship'
  )
  const isBlockaded = enemyShips.length > 0

  // Ask player what to produce
  const produceSelection = this.actions.choose(player, ['Done'], {
    title: 'Produce Units',
    allowsAction: 'produce-units',
  })

  if (produceSelection.action !== 'produce-units') {
    return
  }

  const requestedUnits = produceSelection.units || []
  if (requestedUnits.length === 0) {
    return
  }

  // Calculate available resources (ready, controlled planets)
  let availableResources = 0
  const controlledPlanets = player.getControlledPlanets()
  const readyPlanets = controlledPlanets.filter(
    pId => !this.state.planets[pId]?.exhausted
  )
  for (const pId of readyPlanets) {
    const planet = res.getPlanet(pId)
    if (planet) {
      availableResources += planet.resources
    }
  }
  availableResources += player.tradeGoods

  // Calculate total cost and unit count
  let totalCost = 0
  let totalUnitCount = 0
  const validatedUnits = []

  // Fleet pool tracking
  const currentNonFighters = systemUnits.space
    .filter(u => u.owner === player.name && u.type !== 'fighter')
    .length
  let producedNonFighters = 0
  const fleetLimit = this._getFleetLimit(player)

  for (const req of requestedUnits) {
    const unitDef = this._getUnitStats(player.name, req.type)
    if (!unitDef) {
      continue
    }

    for (let i = 0; i < req.count; i++) {
      // Check blockade: can't produce ships when blockaded
      if (isBlockaded && unitDef.category === 'ship') {
        continue
      }

      // Check fleet pool for non-fighter ships
      if (unitDef.category === 'ship' && unitDef.type !== 'fighter') {
        if (currentNonFighters + producedNonFighters >= fleetLimit) {
          continue
        }
        producedNonFighters++
      }

      // Check production capacity
      if (totalUnitCount >= productionCapacity) {
        break
      }

      // Calculate cost (units with costFor get multiple units per cost payment)
      let unitCost = unitDef.cost
      if (unitDef.costFor > 1 && i % unitDef.costFor !== 0) {
        unitCost = 0
      }

      if (totalCost + unitCost > availableResources) {
        break
      }

      totalCost += unitCost
      totalUnitCount++
      validatedUnits.push(unitDef)
    }
  }

  // Sarween Tools: reduce cost by 1 (min 0) when producing at least 1 unit
  if (totalUnitCount > 0 && player.hasTechnology('sarween-tools')) {
    totalCost = Math.max(0, totalCost - 1)
  }

  // Create validated units
  for (const unitDef of validatedUnits) {
    if (unitDef.category === 'ship') {
      this._addUnit(systemId, 'space', unitDef.type, player.name)
    }
    else if (unitDef.category === 'ground') {
      // Place on the first planet with a space dock
      const dockPlanet = tile.planets.find(pId => {
        const pu = systemUnits.planets[pId] || []
        return pu.some(u => u.owner === player.name && u.type === 'space-dock')
      })
      if (dockPlanet) {
        this._addUnit(systemId, dockPlanet, unitDef.type, player.name)
      }
    }
  }

  // Exhaust planets to pay cost, then spend trade goods for remainder
  let remainingCost = totalCost
  for (const pId of readyPlanets) {
    if (remainingCost <= 0) {
      break
    }
    const planet = res.getPlanet(pId)
    if (planet) {
      this.state.planets[pId].exhausted = true
      remainingCost -= planet.resources
    }
  }
  if (remainingCost > 0 && player.tradeGoods >= remainingCost) {
    player.spendTradeGoods(remainingCost)
    remainingCost = 0
  }

  if (totalUnitCount > 0) {
    this.log.add({
      template: '{player} produces {count} units in system {system}',
      args: { player, count: totalUnitCount, system: systemId },
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

  // Resolve primary ability
  switch (usedCardId) {
    case 'leadership':
      this._leadershipPrimary(player)
      break
    case 'diplomacy':
      this._diplomacyPrimary(player)
      break
    case 'politics':
      this._politicsPrimary(player)
      break
    case 'construction':
      this._constructionPrimary(player)
      break
    case 'trade':
      this._tradePrimary(player)
      break
    case 'warfare':
      this._warfarePrimary(player)
      break
    case 'technology':
      this._technologyPrimary(player)
      break
    case 'imperial':
      this._imperialPrimary(player)
      break
  }

  // Secondary abilities resolved separately (players opt-in during action phase)
  // Tracked so secondaries can be offered later
  this.state.lastStrategyCard = usedCardId

  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Leadership (#1)

Twilight.prototype._leadershipPrimary = function(player) {
  // Gain 3 command tokens (added to tactics by default)
  player.commandTokens.tactics += 3

  this.log.add({
    template: '{player} gains 3 command tokens',
    args: { player },
  })
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Trade (#5)

Twilight.prototype._tradePrimary = function(player) {
  // Gain 3 trade goods
  player.addTradeGoods(3)

  // Replenish commodities for active player
  player.replenishCommodities()

  // Replenish commodities for all other players
  const otherPlayers = this.players.all().filter(p => p.name !== player.name)
  for (const other of otherPlayers) {
    other.replenishCommodities()
  }

  this.log.add({
    template: '{player} gains 3 trade goods and replenishes commodities',
    args: { player },
  })

  // Nomad Artuno: after commodities replenished, may exhaust for 1 TG
  this.factionAbilities.onCommoditiesReplenished(player)
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Technology (#7)

Twilight.prototype._technologyPrimary = function(player) {
  this._researchTech(player)
}

Twilight.prototype._researchTech = function(player) {
  // Nekro Propagation: cannot research technology normally
  if (!this.factionAbilities.canResearchNormally(player)) {
    this.log.add({
      template: '{player} cannot research technology (Propagation)',
      args: { player },
    })
    return null
  }

  // Get available technologies player can research (generic + faction techs)
  const allTechs = [...res.getGenericTechnologies()]
  if (player.faction?.factionTechnologies) {
    allTechs.push(...player.faction.factionTechnologies)
  }
  const available = allTechs
    .filter(t => player.canResearchTechnology(t.id))
    .map(t => t.id)

  if (available.length === 0) {
    return null
  }

  const selection = this.actions.choose(player, available, {
    title: 'Research Technology',
  })

  const techId = selection[0]
  const tech = res.getTechnology(techId)
  if (!tech) {
    return null
  }

  // Create tech card and add to player's zone
  const cardId = `${player.name}-${techId}`
  let card
  try {
    card = this.cards.byId(cardId)
  }
  catch {
    card = new BaseCard(this, { id: cardId, ...tech })
    this.cards.register(card)
  }

  const techZone = this.zones.byPlayer(player, 'technologies')
  techZone.push(card, techZone.nextIndex())

  this.log.add({
    template: '{player} researches {tech}',
    args: { player, tech: tech.name },
  })

  // AI Development Algorithm: exhaust if used for unit upgrade prerequisite skip
  if (tech.unitUpgrade && this._isTechReady(player, 'ai-development-algorithm')) {
    const prereqs = player.getTechPrerequisites()
    const needed = {}
    for (const color of tech.prerequisites) {
      needed[color] = (needed[color] || 0) + 1
    }
    let deficit = 0
    for (const [color, count] of Object.entries(needed)) {
      const shortfall = count - (prereqs[color] || 0)
      if (shortfall > 0) {
        deficit += shortfall
      }
    }
    if (deficit > 0) {
      this._exhaustTech(player, 'ai-development-algorithm')
    }
  }

  // Jol-Nar Brilliant: exhaust 2 techs if this research required brilliant skip
  this.factionAbilities.onTechResearched(player, tech)

  return techId
}

// Grant technology directly (bypasses prerequisites — used by Nekro, Vuil'raith)
Twilight.prototype._grantTechnology = function(player, techId) {
  const tech = res.getTechnology(techId)
  if (!tech) {
    return
  }

  const cardId = `${player.name}-${techId}`
  let card
  try {
    card = this.cards.byId(cardId)
  }
  catch {
    card = new BaseCard(this, { id: cardId, ...tech })
    this.cards.register(card)
  }

  const techZone = this.zones.byPlayer(player, 'technologies')
  techZone.push(card, techZone.nextIndex())
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Imperial (#8)

Twilight.prototype._imperialPrimary = function(player) {
  // If you control Mecatol Rex, gain 1 VP
  if (this.state.planets['mecatol-rex']?.controller === player.name) {
    player.addVictoryPoints(1)
    this.log.add({
      template: '{player} scores 1 VP from controlling Mecatol Rex (Imperial)',
      args: { player },
    })
    this._checkVictory()
  }
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Diplomacy (#2)

Twilight.prototype._diplomacyPrimary = function(player) {
  // Choose a system containing a planet you control
  const controlledPlanets = player.getControlledPlanets()
  const systemsWithControlledPlanets = []
  for (const planetId of controlledPlanets) {
    const systemId = this._findSystemForPlanet(planetId)
    if (systemId && !systemsWithControlledPlanets.includes(systemId)) {
      systemsWithControlledPlanets.push(systemId)
    }
  }

  if (systemsWithControlledPlanets.length === 0) {
    return
  }

  const selection = this.actions.choose(player, systemsWithControlledPlanets, {
    title: 'Choose System (Diplomacy)',
    noAutoRespond: true,
  })
  const chosenSystem = selection[0]

  // Each other player places a command token from reinforcements in that system
  const otherPlayers = this.players.all().filter(p => p.name !== player.name)
  for (const other of otherPlayers) {
    // Only if they have tokens to place
    if (other.commandTokens.tactics > 0) {
      if (!this.state.systems[chosenSystem].commandTokens.includes(other.name)) {
        this.state.systems[chosenSystem].commandTokens.push(other.name)
      }
    }
  }

  this.log.add({
    template: '{player} uses Diplomacy on {system}',
    args: { player, system: chosenSystem },
  })

  // Faction abilities after diplomacy (e.g., Xxcha Peace Accords)
  this.factionAbilities.afterDiplomacyResolved(player)
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Politics (#3)

Twilight.prototype._politicsPrimary = function(player) {
  // Choose a player to become the new speaker
  const allPlayers = this.players.all()
  const playerNames = allPlayers.map(p => p.name)

  const selection = this.actions.choose(player, playerNames, {
    title: 'Choose New Speaker (Politics)',
  })
  const newSpeaker = selection[0]
  this.state.speaker = newSpeaker

  // Draw 2 action cards
  this._drawActionCards(player, 2)

  this.log.add({
    template: '{player} uses Politics. {speaker} is the new speaker',
    args: { player, speaker: newSpeaker },
  })
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Construction (#4)

Twilight.prototype._constructionPrimary = function(player) {
  // Place 1 PDS or 1 Space Dock on a planet you control
  // Then place 1 PDS on a planet you control
  const controlledPlanets = player.getControlledPlanets()
  if (controlledPlanets.length === 0) {
    return
  }

  // First structure: PDS or Space Dock
  const firstChoices = controlledPlanets.map(p => `pds:${p}`)
    .concat(controlledPlanets.map(p => `space-dock:${p}`))

  const firstSelection = this.actions.choose(player, firstChoices, {
    title: 'Place Structure (Construction)',
  })
  const [firstType, firstPlanet] = firstSelection[0].split(':')
  const firstSystemId = this._findSystemForPlanet(firstPlanet)
  if (firstSystemId) {
    this._addUnitToPlanet(firstSystemId, firstPlanet, firstType, player.name)
  }

  // Second structure: PDS only
  const secondChoices = controlledPlanets.map(p => `pds:${p}`)
  if (secondChoices.length > 0) {
    const secondSelection = this.actions.choose(player, secondChoices, {
      title: 'Place PDS (Construction)',
      noAutoRespond: true,
    })
    const [, secondPlanet] = secondSelection[0].split(':')
    const secondSystemId = this._findSystemForPlanet(secondPlanet)
    if (secondSystemId) {
      this._addUnitToPlanet(secondSystemId, secondPlanet, 'pds', player.name)
    }
  }

  this.log.add({
    template: '{player} uses Construction',
    args: { player },
  })
}


////////////////////////////////////////////////////////////////////////////////
// Strategy Card — Warfare (#6)

Twilight.prototype._warfarePrimary = function(player) {
  // Remove 1 command token from the game board
  const systemsWithTokens = []
  for (const [systemId, system] of Object.entries(this.state.systems)) {
    if (system.commandTokens.includes(player.name)) {
      systemsWithTokens.push(systemId)
    }
  }

  if (systemsWithTokens.length > 0) {
    const selection = this.actions.choose(player, systemsWithTokens, {
      title: 'Remove Command Token (Warfare)',
      noAutoRespond: true,
    })
    const chosenSystem = selection[0]
    const tokens = this.state.systems[chosenSystem].commandTokens
    const idx = tokens.indexOf(player.name)
    if (idx !== -1) {
      tokens.splice(idx, 1)
    }

    this.log.add({
      template: '{player} removes a command token from {system}',
      args: { player, system: chosenSystem },
    })
  }

  // Redistribute command tokens (same as status phase redistribution)
  this._redistributeTokens(player)
}

Twilight.prototype._redistributeTokens = function(player) {
  const totalTokens = player.commandTokens.tactics + player.commandTokens.strategy + player.commandTokens.fleet
  this.actions.choose(player, ['Done'], {
    title: `Redistribute Tokens (${totalTokens} total)`,
    noAutoRespond: true,
  })
  // For now, keep current distribution when player clicks Done
}


////////////////////////////////////////////////////////////////////////////////
// Secondary Abilities

Twilight.prototype._resolveSecondaries = function(activePlayer, cardId) {
  const otherPlayers = this.players.all().filter(p => p.name !== activePlayer.name)

  for (const player of otherPlayers) {
    // Determine what secondary this card offers
    const secondaryAvailable = this._getSecondaryDescription(cardId)
    if (!secondaryAvailable) {
      continue
    }

    // Hacan Masters of Trade: free Trade secondary (no strategy token cost)
    const isFree = cardId === 'trade'
      && this.factionAbilities.canSkipTradeSecondaryCost(player)

    // Skip if player has no strategy tokens to spend (unless free)
    if (!isFree && player.commandTokens.strategy <= 0) {
      continue
    }

    const costLabel = isFree ? 'free' : 'costs 1 strategy token'
    const choice = this.actions.choose(player, ['Use Secondary', 'Pass'], {
      title: `${secondaryAvailable} (${costLabel})`,
    })

    if (choice[0] === 'Use Secondary') {
      if (!isFree) {
        player.spendStrategyToken()
        this.factionAbilities.onStrategyTokenSpent(player)
      }
      this._resolveSecondary(player, cardId)
    }
  }
}

Twilight.prototype._getSecondaryDescription = function(cardId) {
  switch (cardId) {
    case 'leadership': return 'Spend influence to gain command tokens'
    case 'diplomacy': return 'Ready exhausted planets'
    case 'politics': return 'Draw 2 action cards'
    case 'construction': return 'Place 1 structure'
    case 'trade': return 'Replenish commodities'
    case 'warfare': return 'Produce units in your home system'
    case 'technology': return 'Research 1 technology'
    case 'imperial': return 'Draw 1 secret objective'
    default: return null
  }
}

Twilight.prototype._resolveSecondary = function(player, cardId) {
  switch (cardId) {
    case 'leadership':
      // Spend 3 influence to gain 1 command token
      player.commandTokens.tactics += 1
      this.log.add({
        template: '{player} gains 1 command token (Leadership secondary)',
        args: { player },
      })
      break
    case 'diplomacy':
      // Ready 2 exhausted planets (simplified)
      this._diplomacySecondary(player)
      break
    case 'politics':
      // Draw 2 action cards
      this._drawActionCards(player, 2)
      this.log.add({
        template: '{player} draws 2 action cards (Politics secondary)',
        args: { player },
      })
      break
    case 'technology':
      // Research 1 technology (same as primary but costs strategy token)
      this._researchTech(player)
      break
    case 'warfare':
      // Produce units in home system
      this._warfareSecondary(player)
      break
    case 'construction':
      // Place 1 PDS or 1 space dock on a planet you control
      this._constructionSecondary(player)
      break
    case 'trade':
      // Replenish commodities
      player.replenishCommodities()
      this.log.add({
        template: '{player} replenishes commodities (Trade secondary)',
        args: { player },
      })
      // Nomad Artuno: after commodities replenished
      this.factionAbilities.onCommoditiesReplenished(player)
      break
    case 'imperial':
      this._drawSecretObjective(player)
      break
    default:
      break
  }
}

Twilight.prototype._diplomacySecondary = function(player) {
  // Ready exhausted planets outside home system (simplified: ready any 2)
  const exhaustedPlanets = player.getControlledPlanets()
    .filter(pId => this.state.planets[pId].exhausted)

  if (exhaustedPlanets.length === 0) {
    return
  }

  // Choose up to 2 planets to ready (simplified — just ready them all if ≤ 2)
  const toReady = exhaustedPlanets.slice(0, 2)
  for (const planetId of toReady) {
    this.state.planets[planetId].exhausted = false
  }

  this.log.add({
    template: '{player} readies planets (Diplomacy secondary)',
    args: { player },
  })

  // Faction abilities after diplomacy (e.g., Xxcha Peace Accords)
  this.factionAbilities.afterDiplomacyResolved(player)
}

Twilight.prototype._warfareSecondary = function(player) {
  // Produce units in home system (simplified: use existing production)
  const homeSystem = this._getHomeSystem(player)
  if (homeSystem) {
    this._productionStep(player, homeSystem)
  }
}

Twilight.prototype._constructionSecondary = function(player) {
  // Place 1 PDS or 1 space dock on a planet you control
  const controlledPlanets = player.getControlledPlanets()
  if (controlledPlanets.length === 0) {
    return
  }

  const choices = controlledPlanets.map(p => `pds:${p}`)
    .concat(controlledPlanets.map(p => `space-dock:${p}`))

  const selection = this.actions.choose(player, choices, {
    title: 'Place Structure (Construction Secondary)',
  })
  const [unitType, planetId] = selection[0].split(':')
  const systemId = this._findSystemForPlanet(planetId)
  if (systemId) {
    this._addUnitToPlanet(systemId, planetId, unitType, player.name)
  }

  this.log.add({
    template: '{player} places a {type} (Construction secondary)',
    args: { player, type: unitType },
  })
}

Twilight.prototype._getHomeSystem = function(player) {
  const faction = player.faction
  if (!faction) {
    return null
  }
  return faction.homeSystem || `${faction.id}-home`
}

Twilight.prototype._addUnitToPlanet = function(systemId, planetId, unitType, ownerName) {
  if (!this.state.units[systemId]) {
    return
  }
  if (!this.state.units[systemId].planets[planetId]) {
    return
  }
  const unitId = `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  this.state.units[systemId].planets[planetId].push({
    id: unitId,
    type: unitType,
    owner: ownerName,
    damaged: false,
  })
}


Twilight.prototype._payInfluence = function(player, cost) {
  // Auto-exhaust planets to pay influence cost (cheapest first to conserve value)
  let remaining = cost
  const readyPlanets = player.getReadyPlanets()
    .map(pId => ({ id: pId, influence: res.getPlanet(pId)?.influence || 0 }))
    .sort((a, b) => a.influence - b.influence)

  for (const planet of readyPlanets) {
    if (remaining <= 0) {
      break
    }
    this.state.planets[planet.id].exhausted = true
    remaining -= planet.influence
  }
}


////////////////////////////////////////////////////////////////////////////////
// Neighbor detection (for trade)

Twilight.prototype.areNeighbors = function(playerA, playerB) {
  // Two players are neighbors if either:
  // 1. They both have units (ships or ground forces) in the same system
  // 2. They have units in adjacent systems
  const systemsA = this._getSystemsWithUnits(playerA)
  const systemsB = this._getSystemsWithUnits(playerB)

  // Check same system
  for (const sysId of systemsA) {
    if (systemsB.includes(sysId)) {
      return true
    }
  }

  // Check adjacent systems
  for (const sysA of systemsA) {
    const adjacent = this._getAdjacentSystems(sysA)
    for (const sysB of systemsB) {
      if (adjacent.includes(sysB)) {
        return true
      }
    }
  }

  return false
}

Twilight.prototype._getSystemsWithUnits = function(playerName) {
  const systems = []
  for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    const hasSpaceUnits = systemUnits.space.some(u => u.owner === playerName)
    const hasPlanetUnits = Object.values(systemUnits.planets).some(
      units => units.some(u => u.owner === playerName)
    )
    if (hasSpaceUnits || hasPlanetUnits) {
      systems.push(systemId)
    }
  }
  return systems
}


////////////////////////////////////////////////////////////////////////////////
// Transactions

Twilight.prototype._offerTransactions = function(player) {
  // Find neighbors the player hasn't traded with this turn
  while (true) {
    const neighbors = this._getAvailableTradePartners(player)
    if (neighbors.length === 0) {
      break
    }

    // Check if player or any neighbor has trade goods or commodities
    const hasResources = player.tradeGoods > 0 || player.commodities > 0
    const neighborHasResources = neighbors.some(n => {
      const p = this.players.byName(n)
      return p.tradeGoods > 0 || p.commodities > 0
    })
    if (!hasResources && !neighborHasResources) {
      break
    }

    const choices = ['Skip Transaction', ...neighbors]
    const selection = this.actions.choose(player, choices, {
      title: 'Propose Transaction?',
    })

    const targetName = selection[0]
    if (targetName === 'Skip Transaction') {
      break
    }

    this._resolveTransaction(player, targetName)
  }
}

Twilight.prototype._getAvailableTradePartners = function(player) {
  const traded = this.state.transactionsThisTurn || {}
  // Hacan Guild Ships: can trade with non-neighbors
  const hasGuildShips = this.factionAbilities.canTradeWithNonNeighbors(player)
  return this.players.all()
    .filter(p => p.name !== player.name)
    .filter(p => hasGuildShips || this.areNeighbors(player.name, p.name))
    .filter(p => !traded[p.name])
    .map(p => p.name)
}

Twilight.prototype._resolveTransaction = function(player, targetName) {
  const target = this.players.byName(targetName)

  // Mark this neighbor as traded with (one attempt per neighbor per turn)
  if (!this.state.transactionsThisTurn) {
    this.state.transactionsThisTurn = {}
  }
  this.state.transactionsThisTurn[targetName] = true

  // Active player proposes: what they offer
  const offerSelection = this.actions.choose(player, ['Done'], {
    title: `Offer to ${targetName}`,
    allowsAction: 'trade-offer',
  })

  if (offerSelection.action !== 'trade-offer') {
    return
  }

  const offering = offerSelection.offering || {}
  const requesting = offerSelection.requesting || {}

  // Validate the active player can afford what they're offering
  if ((offering.tradeGoods || 0) > player.tradeGoods) {
    return
  }
  if ((offering.commodities || 0) > player.commodities) {
    return
  }

  // Validate action card trading (requires Hacan Arbiters)
  const hasActionCards = (offering.actionCards || []).length > 0 || (requesting.actionCards || []).length > 0
  if (hasActionCards && !this.factionAbilities.canTradeActionCards(player, target)) {
    return
  }

  // Mahact Hubris: cannot receive Alliance promissory notes
  const offeredAllianceToMahact = (offering.promissoryNotes || [])
    .some(n => n.id === 'alliance') && this.factionAbilities._hasAbility(target, 'hubris')
  const requestedAllianceFromMahact = (requesting.promissoryNotes || [])
    .some(n => n.id === 'alliance') && this.factionAbilities._hasAbility(player, 'hubris')
  if (offeredAllianceToMahact || requestedAllianceFromMahact) {
    return
  }

  // Target player accepts or rejects
  const response = this.actions.choose(target, ['Accept', 'Reject'], {
    title: `Transaction from ${player.name}`,
    context: {
      offering,
      requesting,
    },
  })

  if (response[0] !== 'Accept') {
    this.log.add({
      template: '{target} rejects transaction from {player}',
      args: { target: targetName, player },
    })
    return
  }

  // Validate the target can afford what's requested
  if ((requesting.tradeGoods || 0) > target.tradeGoods) {
    return
  }
  if ((requesting.commodities || 0) > target.commodities) {
    return
  }

  // Execute the exchange
  this._executeTransaction(player, target, offering, requesting)
}

Twilight.prototype._executeTransaction = function(player, target, offering, requesting) {
  // Player gives offering to target
  const offeredTG = offering.tradeGoods || 0
  const offeredComm = offering.commodities || 0

  if (offeredTG > 0) {
    player.spendTradeGoods(offeredTG)
    target.addTradeGoods(offeredTG)  // trade goods stay as trade goods
  }
  if (offeredComm > 0) {
    player.commodities -= offeredComm
    target.addTradeGoods(offeredComm)  // commodities convert to trade goods on receipt
  }

  // Target gives requesting to player
  const requestedTG = requesting.tradeGoods || 0
  const requestedComm = requesting.commodities || 0

  if (requestedTG > 0) {
    target.spendTradeGoods(requestedTG)
    player.addTradeGoods(requestedTG)
  }
  if (requestedComm > 0) {
    target.commodities -= requestedComm
    player.addTradeGoods(requestedComm)  // commodities convert to trade goods on receipt
  }

  // Exchange promissory notes
  const offeredNotes = offering.promissoryNotes || []
  for (const noteSpec of offeredNotes) {
    const note = player.removePromissoryNote(noteSpec.id, noteSpec.owner)
    if (note) {
      target.addPromissoryNote(note.id, note.owner)
    }
  }

  const requestedNotes = requesting.promissoryNotes || []
  for (const noteSpec of requestedNotes) {
    const note = target.removePromissoryNote(noteSpec.id, noteSpec.owner)
    if (note) {
      player.addPromissoryNote(note.id, note.owner)
    }
  }

  // Exchange action cards (Hacan Arbiters)
  const offeredCards = offering.actionCards || []
  for (const cardId of offeredCards) {
    const idx = (player.actionCards || []).findIndex(c => c.id === cardId)
    if (idx !== -1) {
      const [card] = player.actionCards.splice(idx, 1)
      if (!target.actionCards) {
        target.actionCards = []
      }
      target.actionCards.push(card)
    }
  }

  const requestedCards = requesting.actionCards || []
  for (const cardId of requestedCards) {
    const idx = (target.actionCards || []).findIndex(c => c.id === cardId)
    if (idx !== -1) {
      const [card] = target.actionCards.splice(idx, 1)
      if (!player.actionCards) {
        player.actionCards = []
      }
      player.actionCards.push(card)
    }
  }

  this.log.add({
    template: '{player} and {target} complete a transaction',
    args: { player, target },
  })

  // Mentak Pillage: after transaction, Mentak neighbor can steal 1 TG/commodity
  this.factionAbilities.onTransactionComplete(player)
  this.factionAbilities.onTransactionComplete(target)
}


////////////////////////////////////////////////////////////////////////////////
// Helper: find system ID for a planet

Twilight.prototype._findSystemForPlanet = function(planetId) {
  for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    if (systemUnits.planets[planetId] !== undefined) {
      return systemId
    }
  }
  return null
}

Twilight.prototype._isLawActive = function(lawId) {
  if (!this.state.activeLaws || this.state.activeLaws.length === 0) {
    return false
  }
  // Keleres laws-order: all laws blanked for the current player's turn
  if (this.state.lawsBlankedByPlayer) {
    return false
  }
  return this.state.activeLaws.some(law => law.id === lawId)
}

Twilight.prototype._getLawOutcome = function(lawId) {
  if (!this.state.activeLaws) {
    return null
  }
  if (this.state.lawsBlankedByPlayer) {
    return null
  }
  const law = this.state.activeLaws.find(l => l.id === lawId)
  return law ? law.resolvedOutcome : null
}

Twilight.prototype._componentAction = function(player) {
  this.log.indent()

  // Gather available component actions (faction abilities + technology)
  const actions = this.factionAbilities.getAvailableComponentActions(player)

  // Technology-based component actions
  const techActions = this._getTechComponentActions(player)
  actions.push(...techActions)

  if (actions.length === 0) {
    this.log.add({
      template: 'No component actions available',
      args: {},
    })
    this.log.outdent()
    return
  }

  const choices = actions.map(a => a.id)
  const selection = this.actions.choose(player, choices, {
    title: 'Choose Component Action',
    noAutoRespond: true,
  })

  const actionId = selection[0]

  // Check if it's a tech component action
  const techAction = techActions.find(a => a.id === actionId)
  if (techAction) {
    techAction.execute(player)
  }
  else {
    this.factionAbilities.executeComponentAction(player, actionId)
  }

  this.log.outdent()
}

Twilight.prototype._getTechComponentActions = function(player) {
  const actions = []

  // Transit Diodes: exhaust to relocate up to 4 ground forces
  if (this._isTechReady(player, 'transit-diodes')) {
    actions.push({
      id: 'transit-diodes',
      name: 'Transit Diodes',
      execute: (p) => this._executeTransitDiodes(p),
    })
  }

  // Sling Relay: exhaust to produce 1 ship in any system with a space dock
  if (this._isTechReady(player, 'sling-relay')) {
    actions.push({
      id: 'sling-relay',
      name: 'Sling Relay',
      execute: (p) => this._executeSlingRelay(p),
    })
  }

  // Bio-Stims: exhaust to ready 1 planet or 1 technology
  if (this._isTechReady(player, 'bio-stims')) {
    actions.push({
      id: 'bio-stims',
      name: 'Bio-Stims',
      execute: (p) => this._executeBioStims(p),
    })
  }

  // Predictive Intelligence: exhaust to redistribute command tokens
  if (this._isTechReady(player, 'predictive-intelligence')) {
    actions.push({
      id: 'predictive-intelligence',
      name: 'Predictive Intelligence',
      execute: (p) => this._executePredictiveIntelligence(p),
    })
  }

  // Self Assembly Routines: exhaust to place 1 mech on a controlled planet
  if (this._isTechReady(player, 'self-assembly-routines')) {
    actions.push({
      id: 'self-assembly-routines',
      name: 'Self Assembly Routines',
      execute: (p) => this._executeSelfAssemblyRoutines(p),
    })
  }

  // Scanlink Drone Network: registered as passive (in tactical action), not here

  return actions
}

Twilight.prototype._executeTransitDiodes = function(player) {
  this._exhaustTech(player, 'transit-diodes')

  const controlledPlanets = player.getControlledPlanets()
  if (controlledPlanets.length === 0) {
    return
  }

  // Collect ground forces from all controlled planets
  const groundForces = []
  for (const planetId of controlledPlanets) {
    const systemId = this._findSystemForPlanet(planetId)
    if (!systemId) {
      continue
    }
    const planetUnits = this.state.units[systemId]?.planets[planetId] || []
    for (const u of planetUnits) {
      if (u.owner === player.name && (u.type === 'infantry' || u.type === 'mech')) {
        groundForces.push({ unit: u, planetId, systemId })
      }
    }
  }

  if (groundForces.length === 0) {
    return
  }

  // Let player choose how many to move (up to 4)
  const moveCount = Math.min(4, groundForces.length)
  for (let i = 0; i < moveCount; i++) {
    const remaining = []
    for (const pId of controlledPlanets) {
      const sId = this._findSystemForPlanet(pId)
      if (!sId) {
        continue
      }
      const pUnits = this.state.units[sId]?.planets[pId] || []
      const gf = pUnits.filter(u => u.owner === player.name && (u.type === 'infantry' || u.type === 'mech'))
      if (gf.length > 0) {
        remaining.push(pId)
      }
    }
    if (remaining.length === 0) {
      break
    }

    const fromChoices = ['Done', ...remaining.map(p => `from:${p}`)]
    const fromSel = this.actions.choose(player, fromChoices, {
      title: `Transit Diodes: Move ground force ${i + 1}/${moveCount}`,
    })
    if (fromSel[0] === 'Done') {
      break
    }

    const fromPlanet = fromSel[0].replace('from:', '')
    const fromSystem = this._findSystemForPlanet(fromPlanet)
    if (!fromSystem) {
      continue
    }

    const toSel = this.actions.choose(player, controlledPlanets, {
      title: 'Transit Diodes: Choose destination',
    })
    const toPlanet = toSel[0]
    const toSystem = this._findSystemForPlanet(toPlanet)
    if (!toSystem) {
      continue
    }

    // Move the first matching ground force
    const fromUnits = this.state.units[fromSystem].planets[fromPlanet]
    const gfIdx = fromUnits.findIndex(u => u.owner === player.name && (u.type === 'infantry' || u.type === 'mech'))
    if (gfIdx !== -1) {
      const moved = fromUnits.splice(gfIdx, 1)[0]
      if (!this.state.units[toSystem].planets[toPlanet]) {
        this.state.units[toSystem].planets[toPlanet] = []
      }
      this.state.units[toSystem].planets[toPlanet].push(moved)
    }
  }

  this.log.add({
    template: '{player} uses Transit Diodes to relocate ground forces',
    args: { player },
  })
}

Twilight.prototype._executeSlingRelay = function(player) {
  this._exhaustTech(player, 'sling-relay')

  // Find all systems with player's space dock
  const dockSystems = []
  for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    for (const [_planetId, planetUnits] of Object.entries(systemUnits.planets)) {
      if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
        dockSystems.push(systemId)
        break
      }
    }
  }

  if (dockSystems.length === 0) {
    return
  }

  const systemSel = this.actions.choose(player, dockSystems, {
    title: 'Sling Relay: Choose system to produce in',
  })
  const targetSystem = systemSel[0]

  // Choose 1 ship to produce (limited to cost the player can afford)
  const shipTypes = ['fighter', 'destroyer', 'cruiser', 'carrier', 'dreadnought', 'war-sun']
  const affordableShips = shipTypes.filter(type => {
    const def = this._getUnitStats(player.name, type)
    return def && def.cost <= (player.tradeGoods + this._getAvailableResources(player))
  })

  if (affordableShips.length === 0) {
    return
  }

  const shipSel = this.actions.choose(player, affordableShips, {
    title: 'Sling Relay: Choose ship to produce',
  })
  const shipType = shipSel[0]
  const def = this._getUnitStats(player.name, shipType)

  this._addUnit(targetSystem, 'space', shipType, player.name)

  // Pay cost
  let cost = def.cost
  const controlledPlanets = player.getControlledPlanets()
  for (const pId of controlledPlanets) {
    if (cost <= 0) {
      break
    }
    if (!this.state.planets[pId]?.exhausted) {
      const planet = res.getPlanet(pId)
      if (planet) {
        this.state.planets[pId].exhausted = true
        cost -= planet.resources
      }
    }
  }
  if (cost > 0) {
    player.spendTradeGoods(Math.min(cost, player.tradeGoods))
  }

  this.log.add({
    template: '{player} uses Sling Relay to produce a {ship}',
    args: { player, ship: shipType },
  })
}

Twilight.prototype._executeBioStims = function(player) {
  this._exhaustTech(player, 'bio-stims')

  // Offer to ready 1 exhausted planet or 1 exhausted technology
  const exhaustedPlanets = player.getControlledPlanets()
    .filter(pId => this.state.planets[pId]?.exhausted)
  const exhaustedTechs = (player.exhaustedTechs || [])
    .filter(id => id !== 'bio-stims')  // can't ready itself

  const choices = [
    ...exhaustedPlanets.map(p => `planet:${p}`),
    ...exhaustedTechs.map(t => `tech:${t}`),
  ]

  if (choices.length === 0) {
    return
  }

  const sel = this.actions.choose(player, choices, {
    title: 'Bio-Stims: Ready a planet or technology',
  })

  const choice = sel[0]
  if (choice.startsWith('planet:')) {
    const planetId = choice.replace('planet:', '')
    this.state.planets[planetId].exhausted = false
    this.log.add({
      template: '{player} uses Bio-Stims to ready {planet}',
      args: { player, planet: planetId },
    })
  }
  else if (choice.startsWith('tech:')) {
    const techId = choice.replace('tech:', '')
    player.exhaustedTechs = player.exhaustedTechs.filter(t => t !== techId)
    this.log.add({
      template: '{player} uses Bio-Stims to ready {tech}',
      args: { player, tech: techId },
    })
  }
}

Twilight.prototype._executePredictiveIntelligence = function(player) {
  this._exhaustTech(player, 'predictive-intelligence')

  // Redistribute command tokens
  const sel = this.actions.choose(player, ['Done'], {
    title: 'Predictive Intelligence: Redistribute Command Tokens',
    allowsAction: 'redistribute-tokens',
  })

  if (sel.action === 'redistribute-tokens') {
    player.setCommandTokens(sel)
  }

  this.log.add({
    template: '{player} uses Predictive Intelligence to redistribute tokens',
    args: { player },
  })
}

Twilight.prototype._executeSelfAssemblyRoutines = function(player) {
  this._exhaustTech(player, 'self-assembly-routines')

  const controlledPlanets = player.getControlledPlanets()
  if (controlledPlanets.length === 0) {
    return
  }

  const sel = this.actions.choose(player, controlledPlanets, {
    title: 'Self Assembly Routines: Place 1 mech',
  })
  const targetPlanet = sel[0]
  const systemId = this._findSystemForPlanet(targetPlanet)

  if (systemId) {
    this._addUnit(systemId, targetPlanet, 'mech', player.name)
    this.log.add({
      template: '{player} uses Self Assembly Routines to place a mech on {planet}',
      args: { player, planet: targetPlanet },
    })
  }
}

Twilight.prototype._getAvailableResources = function(player) {
  let total = 0
  const controlledPlanets = player.getControlledPlanets()
  for (const pId of controlledPlanets) {
    if (!this.state.planets[pId]?.exhausted) {
      const planet = res.getPlanet(pId)
      if (planet) {
        total += planet.resources
      }
    }
  }
  return total
}

Twilight.prototype._getInitiative = function(player) {
  // Naalu Telepathic: initiative 0 (always goes first)
  if (this.factionAbilities._hasAbility(player, 'telepathic')) {
    return 0
  }
  const card = res.getStrategyCard(player.getStrategyCardId())
  return card ? card.number : 99
}

Twilight.prototype._getFleetLimit = function(player) {
  let limit = player.commandTokens.fleet
  // Letnev Armada: +2 to fleet pool for non-fighter ships
  if (this.factionAbilities._hasAbility(player, 'armada')) {
    limit += 2
  }
  // Mahact Edict: captured command tokens count toward fleet pool
  limit += this.factionAbilities.getCapturedTokenFleetBonus(player)
  return limit
}


////////////////////////////////////////////////////////////////////////////////
// Objectives

Twilight.prototype._initObjectiveDecks = function() {
  if (!this.state.objectiveDeckI) {
    const stageI = res.getPublicObjectivesI().map(o => o.id)
    this._shuffle(stageI)
    this.state.objectiveDeckI = stageI
  }
  if (!this.state.objectiveDeckII) {
    const stageII = res.getPublicObjectivesII().map(o => o.id)
    this._shuffle(stageII)
    this.state.objectiveDeckII = stageII
  }
}

Twilight.prototype._scoreObjectives = function() {
  // Each player in initiative order may score 1 public objective and 1 secret objective
  const revealedObjectives = this.state.revealedObjectives || []

  // Get players in initiative order
  const players = this._getPlayersInInitiativeOrder()

  for (const player of players) {
    const playerScored = this.state.scoredObjectives[player.name] || []

    // --- Public Objective Scoring ---
    if (revealedObjectives.length > 0) {
      // Find which revealed public objectives this player can score
      const scorable = revealedObjectives.filter(objId => {
        if (playerScored.includes(objId)) {
          return false
        }
        const obj = res.getObjective(objId)
        if (!obj || !obj.check) {
          return false
        }
        return obj.check(player, this)
      })

      if (scorable.length > 0) {
        const choices = ['Skip', ...scorable.map(id => {
          const obj = res.getObjective(id)
          return `${id}: ${obj.name}`
        })]

        const selection = this.actions.choose(player, choices, {
          title: 'Score Public Objective',
          noAutoRespond: true,
        })

        const chosen = selection[0]
        if (chosen !== 'Skip') {
          this._recordObjectiveScore(player, chosen)
        }
      }
    }

    // --- Secret Objective Scoring ---
    const secrets = player.secretObjectives || []
    const scorableSecrets = secrets.filter(objId => {
      if (playerScored.includes(objId)) {
        return false
      }
      const obj = res.getObjective(objId)
      if (!obj || !obj.check) {
        return false
      }
      return obj.check(player, this)
    })

    if (scorableSecrets.length > 0) {
      const secretChoices = ['Skip', ...scorableSecrets.map(id => {
        const obj = res.getObjective(id)
        return `${id}: ${obj.name}`
      })]

      const secretSelection = this.actions.choose(player, secretChoices, {
        title: 'Score Secret Objective',
        noAutoRespond: true,
      })

      const secretChosen = secretSelection[0]
      if (secretChosen !== 'Skip') {
        this._recordObjectiveScore(player, secretChosen)
      }
    }
  }
}

Twilight.prototype._recordObjectiveScore = function(player, choiceString) {
  // Extract objective ID from choice (format: "id: Name")
  const objId = choiceString.split(':')[0]
  const obj = res.getObjective(objId)
  if (!obj) {
    return
  }

  if (!this.state.scoredObjectives[player.name]) {
    this.state.scoredObjectives[player.name] = []
  }
  this.state.scoredObjectives[player.name].push(objId)
  player.addVictoryPoints(obj.points)

  this.log.add({
    template: '{player} scores {objective} (+{points} VP)',
    args: { player, objective: obj.name, points: obj.points },
  })

  this._checkVictory()
  this._checkLeaderUnlocks()
}

////////////////////////////////////////////////////////////////////////////////
// Action Phase Secret Objective Scoring

Twilight.prototype._recordSecretTrigger = function(playerName, objectiveId) {
  if (!playerName) {
    return
  }
  if (!this.state.actionPhaseSecretTriggers) {
    this.state.actionPhaseSecretTriggers = {}
  }
  if (!this.state.actionPhaseSecretTriggers[playerName]) {
    this.state.actionPhaseSecretTriggers[playerName] = []
  }
  if (!this.state.actionPhaseSecretTriggers[playerName].includes(objectiveId)) {
    this.state.actionPhaseSecretTriggers[playerName].push(objectiveId)
  }
}

Twilight.prototype._checkActionPhaseSecrets = function() {
  const triggers = this.state.actionPhaseSecretTriggers || {}

  for (const [playerName, triggeredIds] of Object.entries(triggers)) {
    const player = this.players.byName(playerName)
    if (!player) {
      continue
    }

    const secrets = player.secretObjectives || []
    const scored = this.state.scoredObjectives[playerName] || []

    const scorable = triggeredIds.filter(objId => {
      return secrets.includes(objId) && !scored.includes(objId)
    })

    if (scorable.length > 0) {
      const choices = ['Skip', ...scorable.map(id => {
        const obj = res.getObjective(id)
        return `${id}: ${obj.name}`
      })]

      const selection = this.actions.choose(player, choices, {
        title: 'Score Secret Objective',
        noAutoRespond: true,
      })

      const chosen = selection[0]
      if (chosen !== 'Skip') {
        this._recordObjectiveScore(player, chosen)
      }
    }
  }
}

Twilight.prototype._detectCombatSecrets = function(systemId, winner, loser, combatType) {
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  const allPlayers = this.players.all()

  // spark-a-rebellion: winner beat player with most VP
  const maxVP = Math.max(...allPlayers.map(p => p.getVictoryPoints()))
  const loserPlayer = this.players.byName(loser)
  if (loserPlayer && loserPlayer.getVictoryPoints() === maxVP) {
    this._recordSecretTrigger(winner, 'spark-a-rebellion')
  }

  // brave-the-void: system is an anomaly
  if (tile && tile.anomaly) {
    this._recordSecretTrigger(winner, 'brave-the-void')
  }

  // darken-the-skies: system is another player's home system
  if (typeof systemId === 'string' && systemId.includes('-home')) {
    const factions = require('./res/factions/index.js')
    for (const p of allPlayers) {
      const f = factions.getFaction(p.factionId)
      if (f && f.homeSystem === systemId && p.name !== winner) {
        this._recordSecretTrigger(winner, 'darken-the-skies')
        break
      }
    }
  }

  // betray-a-friend: winner had loser's promissory note at tactical action start
  const ctx = this.state.currentTacticalAction
  if (ctx && ctx.promissoryNotesAtStart) {
    const winnerNotes = ctx.promissoryNotesAtStart[winner] || []
    if (winnerNotes.some(n => n.owner === loser)) {
      this._recordSecretTrigger(winner, 'betray-a-friend')
    }
  }

  // Space combat specific
  if (combatType === 'space') {
    const systemUnits = this.state.units[systemId]

    // unveil-flagship: winner has flagship in system that survived
    if (systemUnits) {
      const winnerShips = systemUnits.space.filter(u => u.owner === winner)
      if (winnerShips.some(u => u.type === 'flagship')) {
        this._recordSecretTrigger(winner, 'unveil-flagship')
      }
    }

    // demonstrate-your-power: winner has 3+ non-fighter ships
    if (systemUnits) {
      const nonFighterShips = systemUnits.space.filter(
        u => u.owner === winner && u.type !== 'fighter'
      )
      if (nonFighterShips.length >= 3) {
        this._recordSecretTrigger(winner, 'demonstrate-your-power')
      }
    }
  }
}

Twilight.prototype._revealObjective = function() {
  this._initObjectiveDecks()

  // Reveal Stage I objectives for the first 5 rounds, Stage II after
  const round = this.state.round
  let deck, stage
  if (round <= 5) {
    deck = this.state.objectiveDeckI
    stage = 'I'
  }
  else {
    deck = this.state.objectiveDeckII
    stage = 'II'
  }

  if (deck && deck.length > 0) {
    const objectiveId = deck.shift()
    if (!this.state.revealedObjectives) {
      this.state.revealedObjectives = []
    }
    this.state.revealedObjectives.push(objectiveId)

    const obj = res.getObjective(objectiveId)
    if (obj) {
      this.log.add({
        template: 'Public Objective Stage {stage} revealed: {name}',
        args: { stage, name: obj.name },
      })
    }
  }
}

Twilight.prototype._getPlayersInInitiativeOrder = function() {
  const players = this.players.all()
  return [...players].sort((a, b) => {
    return this._getInitiative(a) - this._getInitiative(b)
  })
}


////////////////////////////////////////////////////////////////////////////////
// Action Cards

Twilight.prototype._initActionCardDeck = function() {
  if (this.state.actionCardDeck) {
    return
  }

  const deck = res.buildActionDeck()
  this._shuffle(deck)
  this.state.actionCardDeck = deck
}

Twilight.prototype._drawActionCards = function(player, count) {
  this._initActionCardDeck()

  const drawn = []
  for (let i = 0; i < count; i++) {
    if (this.state.actionCardDeck.length === 0) {
      break
    }
    const card = this.state.actionCardDeck.pop()
    drawn.push(card)
  }

  if (drawn.length === 0) {
    return
  }

  // Store in player's hand
  if (!player.actionCards) {
    player.actionCards = []
  }
  player.actionCards.push(...drawn)

  this.log.add({
    template: '{player} draws {count} action card(s)',
    args: { player, count: drawn.length },
  })

  // Yssaril Scheming: draw 1 extra, then discard 1
  this.factionAbilities.onActionCardDraw(player, drawn)
}


////////////////////////////////////////////////////////////////////////////////
// Playing Action Cards

Twilight.prototype._playActionCard = function(player) {
  const actionCards = (player.actionCards || []).filter(c => c.timing === 'action')
  if (actionCards.length === 0) {
    return
  }

  const cardNames = actionCards.map(c => c.name)
  const selection = this.actions.choose(player, cardNames, {
    title: 'Play Action Card',
  })

  const cardName = selection[0]
  const cardIndex = player.actionCards.findIndex(c => c.name === cardName && c.timing === 'action')
  if (cardIndex === -1) {
    return
  }

  const card = player.actionCards.splice(cardIndex, 1)[0]

  this.log.add({
    template: '{player} plays {card}',
    args: { player, card: card.name },
  })

  // Discard the card
  if (!this.state.actionCardDiscard) {
    this.state.actionCardDiscard = []
  }
  this.state.actionCardDiscard.push(card)

  // Resolve the card effect
  this._resolveActionCard(player, card)
}

Twilight.prototype._resolveActionCard = function(player, card) {
  switch (card.id) {
    case 'focused-research':
      this._resolveCard_focusedResearch(player)
      break
    case 'mining-initiative':
      this._resolveCard_miningInitiative(player)
      break
    case 'industrial-initiative':
      this._resolveCard_industrialInitiative(player)
      break
    case 'unexpected-action':
      this._resolveCard_unexpectedAction(player)
      break
    case 'ghost-ship':
      this._resolveCard_ghostShip(player)
      break
    case 'plague':
      this._resolveCard_plague(player)
      break
    case 'uprising':
      this._resolveCard_uprising(player)
      break
  }
}

// Focused Research: Spend 4 trade goods to research 1 technology
Twilight.prototype._resolveCard_focusedResearch = function(player) {
  if (player.tradeGoods < 4) {
    return
  }
  player.spendTradeGoods(4)
  this._researchTech(player)
}

// Mining Initiative: Gain trade goods equal to the resource value of 1 planet you control
Twilight.prototype._resolveCard_miningInitiative = function(player) {
  const planets = player.getControlledPlanets()
  if (planets.length === 0) {
    return
  }

  const selection = this.actions.choose(player, planets, {
    title: 'Choose planet (Mining Initiative)',
  })

  const planetId = selection[0]
  const planet = res.getPlanet(planetId)
  if (planet) {
    player.addTradeGoods(planet.resources)
    this.log.add({
      template: '{player} gains {amount} trade goods from {planet}',
      args: { player, amount: planet.resources, planet: planetId },
    })
  }
}

// Industrial Initiative: Gain 1 trade good for each industrial planet you control
Twilight.prototype._resolveCard_industrialInitiative = function(player) {
  const planets = player.getControlledPlanets()
  let count = 0
  for (const planetId of planets) {
    const planet = res.getPlanet(planetId)
    if (planet && planet.trait === 'industrial') {
      count++
    }
  }
  if (count > 0) {
    player.addTradeGoods(count)
    this.log.add({
      template: '{player} gains {count} trade goods from industrial planets',
      args: { player, count },
    })
  }
}

// Unexpected Action: Remove 1 command token from a system and return it
Twilight.prototype._resolveCard_unexpectedAction = function(player) {
  const systemsWithTokens = Object.entries(this.state.systems)
    .filter(([, sys]) => sys.commandTokens.includes(player.name))
    .map(([id]) => id)

  if (systemsWithTokens.length === 0) {
    return
  }

  const selection = this.actions.choose(player, systemsWithTokens, {
    title: 'Remove command token from system',
  })

  const systemId = selection[0]
  const tokens = this.state.systems[systemId].commandTokens
  const idx = tokens.indexOf(player.name)
  if (idx !== -1) {
    tokens.splice(idx, 1)
    player.commandTokens.tactics++
    this.log.add({
      template: '{player} removes command token from system {system}',
      args: { player, system: systemId },
    })
  }
}

// Ghost Ship: Place 1 destroyer in a system with a wormhole and no enemy ships
Twilight.prototype._resolveCard_ghostShip = function(player) {
  const validSystems = Object.entries(this.state.systems)
    .filter(([, sys]) => {
      const tile = res.getSystemTile(sys.tileId) || res.getSystemTile(Number(sys.tileId))
      if (!tile || !tile.wormholes || tile.wormholes.length === 0) {
        return false
      }
      const units = this.state.units[String(sys.tileId)]
      if (!units) {
        return false
      }
      const hasEnemyShips = units.space.some(
        u => u.owner !== player.name && res.getUnit(u.type)?.category === 'ship'
      )
      return !hasEnemyShips
    })
    .map(([id]) => id)

  if (validSystems.length === 0) {
    return
  }

  const selection = this.actions.choose(player, validSystems, {
    title: 'Place destroyer (Ghost Ship)',
  })

  const systemId = selection[0]
  this._addUnit(systemId, 'space', 'destroyer', player.name)
  this.log.add({
    template: '{player} places a destroyer in system {system}',
    args: { player, system: systemId },
  })
}

// Plague: Roll dice for infantry on a planet, destroy on 6+
Twilight.prototype._resolveCard_plague = function(player) {
  // Find all planets with infantry
  const planetsWithInfantry = []
  for (const [, systemUnits] of Object.entries(this.state.units)) {
    for (const [planetId, units] of Object.entries(systemUnits.planets)) {
      const infantry = units.filter(u => u.type === 'infantry')
      if (infantry.length > 0) {
        planetsWithInfantry.push(planetId)
      }
    }
  }

  if (planetsWithInfantry.length === 0) {
    return
  }

  const selection = this.actions.choose(player, planetsWithInfantry, {
    title: 'Choose planet (Plague)',
  })

  const planetId = selection[0]
  const systemId = this._findSystemForPlanet(planetId)
  if (!systemId) {
    return
  }

  const planetUnits = this.state.units[systemId].planets[planetId]
  const infantry = planetUnits.filter(u => u.type === 'infantry')
  let destroyed = 0

  for (const unit of infantry) {
    const roll = Math.floor(this.random() * 10) + 1
    if (roll >= 6) {
      const idx = planetUnits.findIndex(u => u.id === unit.id)
      if (idx !== -1) {
        planetUnits.splice(idx, 1)
        destroyed++
      }
    }
  }

  this.log.add({
    template: 'Plague destroys {count} infantry on {planet}',
    args: { count: destroyed, planet: planetId },
  })
}

// Uprising: Exhaust 1 non-home planet controlled by another player, gain TG equal to resources
Twilight.prototype._resolveCard_uprising = function(player) {
  const targetPlanets = []
  for (const [planetId, planetState] of Object.entries(this.state.planets)) {
    if (planetState.controller && planetState.controller !== player.name && !planetState.exhausted) {
      // Check if this is a home planet
      const controller = this.players.byName(planetState.controller)
      if (!controller?.faction) {
        continue
      }
      const homeSystem = res.getSystemTile(controller.faction.homeSystem)
      if (homeSystem && homeSystem.planets.includes(planetId)) {
        continue  // Skip home planets
      }
      targetPlanets.push(planetId)
    }
  }

  if (targetPlanets.length === 0) {
    return
  }

  const selection = this.actions.choose(player, targetPlanets, {
    title: 'Choose planet (Uprising)',
  })

  const planetId = selection[0]
  this.state.planets[planetId].exhausted = true
  const planet = res.getPlanet(planetId)
  if (planet) {
    player.addTradeGoods(planet.resources)
    this.log.add({
      template: '{player} exhausts {planet} and gains {amount} trade goods',
      args: { player, planet: planetId, amount: planet.resources },
    })
  }
}


////////////////////////////////////////////////////////////////////////////////
// Secret Objectives

Twilight.prototype._initSecretObjectiveDeck = function() {
  if (this.state.secretObjectiveDeck) {
    return
  }

  const secrets = res.getSecretObjectives().map(o => o.id)
  this._shuffle(secrets)
  this.state.secretObjectiveDeck = secrets
}

Twilight.prototype._drawSecretObjective = function(player) {
  this._initSecretObjectiveDeck()

  if (this.state.secretObjectiveDeck.length === 0) {
    return
  }

  const objectiveId = this.state.secretObjectiveDeck.pop()

  if (!player.secretObjectives) {
    player.secretObjectives = []
  }
  player.secretObjectives.push(objectiveId)

  this.log.add({
    template: '{player} draws a secret objective',
    args: { player },
  })
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


////////////////////////////////////////////////////////////////////////////////
// Leaders

/**
 * Check all players' commander and hero unlock conditions.
 * Called after key game events (scoring, combat, gaining resources, etc.)
 */
Twilight.prototype._checkLeaderUnlocks = function() {
  for (const player of this.players.all()) {
    this._checkCommanderUnlock(player)
    this._checkHeroUnlock(player)
  }
}

/**
 * Check if a player's hero should unlock (universal: 3 scored objectives).
 */
Twilight.prototype._checkHeroUnlock = function(player) {
  if (player.isHeroUnlocked() || player.isHeroPurged()) {
    return
  }

  const scored = this.state.scoredObjectives[player.name] || []
  if (scored.length >= 3) {
    player.unlockHero()
    this.log.add({
      template: '{player} unlocks hero: {name}',
      args: { player, name: player.faction?.leaders?.hero?.name || 'Hero' },
    })
  }
}

/**
 * Check if a player's commander should unlock (faction-specific conditions).
 */
Twilight.prototype._checkCommanderUnlock = function(player) {
  if (player.isCommanderUnlocked()) {
    return
  }

  const factionId = player.faction?.id
  let conditionMet = false

  switch (factionId) {
    case 'federation-of-sol':
      // Have 12 or more ground forces on the game board
      conditionMet = this._countGroundForces(player.name) >= 12
      break
    case 'emirates-of-hacan':
      // Have 10 trade goods
      conditionMet = player.tradeGoods >= 10
      break
    case 'barony-of-letnev':
      // Have 5 non-fighter ships in 1 system
      conditionMet = this._hasNonFighterShipsInOneSystem(player.name, 5)
      break
    case 'sardakk-norr':
      // Control 5 non-home planets
      conditionMet = this._countNonHomePlanets(player.name) >= 5
      break
    case 'universities-of-jol-nar':
      // Have 8 technologies
      conditionMet = player.getTechIds().length >= 8
      break
    case 'l1z1x-mindnet':
      // Have 3+ dreadnoughts on the game board
      conditionMet = this._countUnitsOnBoard(player.name, 'dreadnought') >= 3
      break
    case 'xxcha-kingdom':
      // Control planets with combined influence 12+
      conditionMet = this._getTotalControlledInfluence(player.name) >= 12
      break
    case 'embers-of-muaat':
      // Have a war sun on the game board
      conditionMet = this._countUnitsOnBoard(player.name, 'war-sun') >= 1
      break
    case 'arborec':
      // Have 12+ ground forces on board
      conditionMet = this._countGroundForces(player.name) >= 12
      break
    case 'yssaril-tribes':
      // Have 7 action cards in hand
      conditionMet = (player.actionCards?.length || 0) >= 7
      break
    case 'nomad':
      // Have 1 scored secret objective
      conditionMet = (this.state.scoredObjectives[player.name] || [])
        .some(id => {
          const obj = res.getObjective(id)
          return obj && obj.type === 'secret'
        })
      break
    case 'ghosts-of-creuss':
      // Units in/adjacent to alpha wormhole AND beta wormhole systems
      conditionMet = this._hasUnitsNearWormholes(player.name, 'alpha')
        && this._hasUnitsNearWormholes(player.name, 'beta')
      break
    case 'nekro-virus':
      // Have 3 technologies
      conditionMet = player.getTechIds().length >= 3
      break
    case 'argent-flight':
      // 6+ units with AFB/SC/Bombardment on board
      conditionMet = this._countCombatAbilityUnits(player.name) >= 6
      break
    case 'empyrean':
      // Be neighbors with all other players
      conditionMet = this._isNeighborWithAll(player.name)
      break
    case 'mahact-gene-sorcerers':
      // 2 other players' command tokens in fleet pool
      conditionMet = (this.state.capturedCommandTokens[player.name] || []).length >= 2
      break
    case 'naaz-rokha-alliance':
      // 3 mechs in 3 different systems
      conditionMet = this._countMechSystems(player.name) >= 3
      break
    case 'titans-of-ul':
      // 5 structures on the game board
      conditionMet = this._countStructures(player.name) >= 5
      break
    case 'vuil-raith-cabal':
      // Units in 3 systems with gravity rifts
      conditionMet = this._countGravityRiftSystems(player.name) >= 3
      break
    default:
      break
  }

  if (conditionMet) {
    player.unlockCommander()
    this.log.add({
      template: '{player} unlocks commander: {name}',
      args: { player, name: player.faction?.leaders?.commander?.name || 'Commander' },
    })
  }
}

// Leader helper methods
Twilight.prototype._countGroundForces = function(playerName) {
  let count = 0
  for (const systemUnits of Object.values(this.state.units)) {
    for (const planetUnits of Object.values(systemUnits.planets)) {
      count += planetUnits.filter(u =>
        u.owner === playerName && res.getUnit(u.type)?.category === 'ground'
      ).length
    }
  }
  return count
}

Twilight.prototype._hasNonFighterShipsInOneSystem = function(playerName, count) {
  for (const systemUnits of Object.values(this.state.units)) {
    const nonFighterShips = systemUnits.space.filter(u =>
      u.owner === playerName && u.type !== 'fighter'
    )
    if (nonFighterShips.length >= count) {
      return true
    }
  }
  return false
}

Twilight.prototype._countNonHomePlanets = function(playerName) {
  let count = 0
  for (const [planetId, planetState] of Object.entries(this.state.planets)) {
    if (planetState.controller !== playerName) {
      continue
    }
    const systemId = this._findSystemForPlanet(planetId)
    if (systemId && !systemId.includes('-home')) {
      count++
    }
  }
  return count
}

Twilight.prototype._countUnitsOnBoard = function(playerName, unitType) {
  let count = 0
  for (const systemUnits of Object.values(this.state.units)) {
    count += systemUnits.space.filter(u =>
      u.owner === playerName && u.type === unitType
    ).length
    for (const planetUnits of Object.values(systemUnits.planets)) {
      count += planetUnits.filter(u =>
        u.owner === playerName && u.type === unitType
      ).length
    }
  }
  return count
}

Twilight.prototype._getTotalControlledInfluence = function(playerName) {
  let total = 0
  for (const [planetId, planetState] of Object.entries(this.state.planets)) {
    if (planetState.controller !== playerName) {
      continue
    }
    const planet = res.getPlanet(planetId)
    if (planet) {
      total += planet.influence
    }
  }
  return total
}

Twilight.prototype._hasUnitsNearWormholes = function(playerName, wormholeType) {
  // Check if player has units in or adjacent to systems with this wormhole type
  const { Galaxy } = require('./model/Galaxy.js')
  const galaxy = new Galaxy(this)
  const wormholeSystems = galaxy.getSystemsWithWormhole(wormholeType)

  for (const sysId of wormholeSystems) {
    // Check units in the wormhole system itself
    const sysUnits = this.state.units[sysId]
    if (sysUnits) {
      if (sysUnits.space.some(u => u.owner === playerName)) {
        return true
      }
      for (const planetUnits of Object.values(sysUnits.planets)) {
        if (planetUnits.some(u => u.owner === playerName)) {
          return true
        }
      }
    }

    // Check adjacent systems
    const adjacent = galaxy.getAdjacent(sysId)
    for (const adjId of adjacent) {
      const adjUnits = this.state.units[adjId]
      if (adjUnits) {
        if (adjUnits.space.some(u => u.owner === playerName)) {
          return true
        }
        for (const planetUnits of Object.values(adjUnits.planets)) {
          if (planetUnits.some(u => u.owner === playerName)) {
            return true
          }
        }
      }
    }
  }
  return false
}

Twilight.prototype._countCombatAbilityUnits = function(playerName) {
  let count = 0
  for (const systemUnits of Object.values(this.state.units)) {
    for (const unit of systemUnits.space) {
      if (unit.owner !== playerName) {
        continue
      }
      const def = this._getUnitStats(unit.owner, unit.type)
      if (def?.abilities?.some(a =>
        a.startsWith('anti-fighter-barrage-') ||
        a.startsWith('space-cannon-') ||
        a.startsWith('bombardment-')
      )) {
        count++
      }
    }
    for (const planetUnits of Object.values(systemUnits.planets)) {
      for (const unit of planetUnits) {
        if (unit.owner !== playerName) {
          continue
        }
        const def = this._getUnitStats(unit.owner, unit.type)
        if (def?.abilities?.some(a =>
          a.startsWith('anti-fighter-barrage-') ||
          a.startsWith('space-cannon-') ||
          a.startsWith('bombardment-')
        )) {
          count++
        }
      }
    }
  }
  return count
}

Twilight.prototype._isNeighborWithAll = function(playerName) {
  const otherPlayers = this.players.all().filter(p => p.name !== playerName)
  return otherPlayers.every(other => this.areNeighbors(playerName, other.name))
}

Twilight.prototype._countMechSystems = function(playerName) {
  let systems = 0
  for (const systemUnits of Object.values(this.state.units)) {
    let hasMech = false
    for (const planetUnits of Object.values(systemUnits.planets)) {
      if (planetUnits.some(u => u.owner === playerName && u.type === 'mech')) {
        hasMech = true
        break
      }
    }
    if (hasMech) {
      systems++
    }
  }
  return systems
}

Twilight.prototype._countStructures = function(playerName) {
  let count = 0
  for (const systemUnits of Object.values(this.state.units)) {
    for (const planetUnits of Object.values(systemUnits.planets)) {
      count += planetUnits.filter(u => {
        if (u.owner !== playerName) {
          return false
        }
        const def = res.getUnit(u.type)
        return def?.category === 'structure'
      }).length
    }
  }
  return count
}

Twilight.prototype._countGravityRiftSystems = function(playerName) {
  let count = 0
  for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (!tile || tile.anomaly !== 'gravity-rift') {
      continue
    }

    const hasUnits = systemUnits.space.some(u => u.owner === playerName) ||
      Object.values(systemUnits.planets).some(pu => pu.some(u => u.owner === playerName))
    if (hasUnits) {
      count++
    }
  }
  return count
}


////////////////////////////////////////////////////////////////////////////////
// Exploration

Twilight.prototype._initExplorationDecks = function() {
  if (this.state.explorationDecks) {
    return
  }

  this.state.explorationDecks = {}
  for (const trait of ['cultural', 'hazardous', 'industrial', 'frontier']) {
    const cards = res.getExplorationCards(trait)
    this._shuffle(cards)
    this.state.explorationDecks[trait] = cards
  }
}

Twilight.prototype._drawExplorationCard = function(trait) {
  this._initExplorationDecks()

  const deck = this.state.explorationDecks[trait]
  if (!deck || deck.length === 0) {
    return null
  }

  return deck.pop()
}

Twilight.prototype._explorePlanet = function(planetId, ownerName) {
  // Only explore planets with traits (not home system planets or Mecatol Rex)
  const planet = res.getPlanet(planetId)
  if (!planet || !planet.trait) {
    return
  }

  // Only explore once per planet
  if (this.state.exploredPlanets[planetId]) {
    return
  }

  this.state.exploredPlanets[planetId] = true

  const player = this.players.byName(ownerName)

  // Draw exploration card(s) — Naaz-Rokha distant-suns draws extra with mech
  const bonusCards = this.factionAbilities.getExplorationBonus(player, planetId)
  const cards = []
  const mainCard = this._drawExplorationCard(planet.trait)
  if (mainCard) {
    cards.push(mainCard)
  }
  for (let i = 0; i < bonusCards; i++) {
    const extra = this._drawExplorationCard(planet.trait)
    if (extra) {
      cards.push(extra)
    }
  }

  let card
  if (cards.length === 0) {
    return
  }
  else if (cards.length === 1) {
    card = cards[0]
  }
  else {
    // Player chooses which card to keep
    const cardChoices = cards.map(c => c.name || c.id)
    const selection = this.actions.choose(player, cardChoices, {
      title: 'Choose exploration card to keep',
    })
    card = cards.find(c => (c.name || c.id) === selection[0]) || cards[0]
  }

  this.log.add({
    template: '{player} explores {planet}: {card}',
    args: { player: ownerName, planet: planetId, card: card.name },
  })

  // Ensure planet state exists
  if (!this.state.planets[planetId]) {
    this.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
  }

  // Resolve based on card type
  if (card.type === 'attach') {
    // Attach to planet — apply bonuses
    if (!this.state.planets[planetId].attachments) {
      this.state.planets[planetId].attachments = []
    }
    this.state.planets[planetId].attachments.push(card.id)

    this.log.add({
      template: '{card} attached to {planet}',
      args: { card: card.name, planet: planetId },
    })
  }
  else if (card.type === 'fragment') {
    // Give relic fragment to player
    if (!player.relicFragments) {
      player.relicFragments = []
    }
    player.relicFragments.push(card.fragmentType)

    this.log.add({
      template: '{player} gains a {type} relic fragment',
      args: { player: ownerName, type: card.fragmentType },
    })
  }
  else if (card.type === 'action') {
    // Resolve immediate effect
    if (card.resolve) {
      card.resolve(player)
    }
  }

  // Titans terragenesis: offer sleeper placement after exploration
  const systemId = this._findSystemForPlanet(planetId)
  if (systemId) {
    this.factionAbilities.afterExploration(player, planetId, systemId)
  }
}
