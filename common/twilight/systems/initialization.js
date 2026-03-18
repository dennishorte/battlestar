const res = require('../res/index.js')
const { BaseCard } = require('../../lib/game/index.js')
const miltyDraft = require('../milty-draft/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  Twilight.prototype.initialize = function() {
  // Expose res module so objectives/abilities can access game data via game.res
    this.res = res

    this._initializeState()
    this._initializeZones()

    if (this.settings.miltyDraft) {
      this._miltyDraftPhase()
    }

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
    this.state.eliminatedPlayers = []       // [playerName, ...] — players eliminated from the game
    this.state.capturedUnits = {}         // { playerName: [{ type, originalOwner }] } — Vuil'raith Cabal
    this.state.capturedCommandTokens = {} // { playerName: [otherPlayerName, ...] } — Mahact Gene-Sorcerers
    this.state.nekroPrediction = null     // { playerName, outcome } — Nekro Virus agenda prediction
    this.state.assimilatorTokens = {}    // { x: { techId, ownerName }, y: { techId, ownerName } } — Nekro Valefar Assimilators
    this.state.creussWormholeToken = null  // systemId where Creuss wormhole token is placed
    this.state.gammaWormholeTokens = []    // systemIds with gamma wormhole tokens (from exploration)
    this.state.ionStormToken = null         // { systemId, side: 'alpha'|'beta' } or null
    this.state.persistentCards = {}         // playerName → [cardId, ...] (e.g., Enigmatic Device)
    this.state.wormholeNexusActive = false  // Rule 100: Wormhole Nexus flips to active when units enter or Mallice controlled
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
    if (this.state.miltyDraftSlices) {
      return this._initializeGalaxyFromMiltyDraft()
    }

    if (this.settings.mapGenerator) {
      return this._initializeGalaxyFromGenerator()
    }

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

    this._initializeSystemUnits()
  }

  Twilight.prototype._initializeGalaxyFromGenerator = function() {
    const MapGenerator = require('../map-generator/MapGenerator')
    const players = this.players.all()
    const factionIds = players.map(p => p.factionId)

    // Build generator settings from game settings
    const genSettings = {
      numPlayers: players.length,
      races: factionIds,
      usePok: true,
      seed: this.settings.seed || this.settings.name,
      ...(typeof this.settings.mapGenerator === 'object' ? this.settings.mapGenerator : {}),
    }

    const result = MapGenerator.generate(genSettings)
    const systems = MapGenerator.toGameSystems(result)

    // Copy systems into game state
    for (const [id, system] of Object.entries(systems)) {
      this.state.systems[id] = system
    }

    this._initializeSystemUnits()
  }

  Twilight.prototype._initializeSystemUnits = function() {
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
      const homeIdx = this.state.miltyDraftPositions
        ? this.state.miltyDraftPositions[player.name] - 1
        : i
      const bonus = layout.homePositions[homeIdx].bonusTradeGoods
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

  Twilight.prototype._miltyDraftPhase = function() {
    const opts = this.settings.miltyDraft
    const players = this.players.all()
    const numSlices = opts.numSlices || players.length + 1
    const numFactions = opts.numFactions || players.length + 2

    // Generate slices
    const slices = miltyDraft.generateSlices(this._shuffle.bind(this), numSlices)

    // Generate faction pool
    const allFactions = [...res.getAllFactionIds()]
    this._shuffle(allFactions)
    const factionPool = allFactions.slice(0, numFactions)

    // Build draft state
    const playerNames = players.map(p => p.name)
    const draftState = miltyDraft.createDraftState({ slices, factionPool, playerNames })
    this.state.miltyDraft = draftState

    // Run draft loop
    while (!miltyDraft.isDraftComplete(draftState)) {
      const currentName = miltyDraft.getCurrentPlayer(draftState)
      const player = this.players.byName(currentName)
      const categories = miltyDraft.getAvailableCategories(draftState, currentName)

      // Build choices: "category: option" for each available combo
      const choices = []
      const choiceMap = []
      for (const category of categories) {
        const options = miltyDraft.getAvailableOptions(draftState, category)
        for (const option of options) {
          let label
          if (category === 'slice') {
            const slice = slices[option]
            const tileNames = slice.tiles.map(id => {
              const tile = res.getSystemTile(id)
              if (!tile || tile.planets.length === 0) {
                return `Tile ${id}`
              }
              return tile.planets.map(pid => {
                const planet = res.getPlanet(pid)
                return planet ? planet.name : pid
              }).join('/')
            }).join(', ')
            label = `Slice ${option + 1}: ${tileNames} (${slice.stats.optimalTotal} optimal)`
          }
          else if (category === 'faction') {
            const faction = res.getFaction(option)
            label = `Faction: ${faction ? faction.name : option}`
          }
          else {
            label = `Speaker Position: ${option}`
          }
          choices.push(label)
          choiceMap.push({ category, value: option })
        }
      }

      const selection = this.actions.choose(player, choices, {
        title: 'Milty Draft',
        noAutoRespond: true,
      })
      const chosenLabel = selection[0]
      const chosenIndex = choices.indexOf(chosenLabel)
      const { category, value } = choiceMap[chosenIndex]

      miltyDraft.applyPick(draftState, currentName, category, value)

      this.log.add({
        template: '{player} drafts {pick}',
        args: { player, pick: chosenLabel },
      })
    }

    // Apply draft results
    // Assign factions in current player order
    const factionAssignments = players.map(p => draftState.playerState[p.name].faction)
    this.settings.factions = factionAssignments

    // Set speaker to the player who drafted position 1
    for (const [name, ps] of Object.entries(draftState.playerState)) {
      if (ps.position === 1) {
        this.state.speaker = name
        break
      }
    }

    // Store slice assignments and position-to-home mapping for galaxy init
    const sliceAssignments = {}
    const positionAssignments = {}
    for (const player of players) {
      const ps = draftState.playerState[player.name]
      sliceAssignments[player.name] = slices[ps.slice]
      positionAssignments[player.name] = ps.position // 1-indexed speaker position
    }
    this.state.miltyDraftSlices = sliceAssignments
    this.state.miltyDraftPositions = positionAssignments
  }

  Twilight.prototype._initializeGalaxyFromMiltyDraft = function() {
    const players = this.players.all()
    const playerCount = players.length
    const layoutKey = this.settings?.mapLayout || playerCount
    const layout = res.getLayout(layoutKey)

    // Place Mecatol Rex
    this.state.systems[18] = {
      tileId: 18,
      position: layout.mecatol,
      commandTokens: [],
    }

    // Place home systems using drafted speaker positions
    // Position 1 → homePositions[0], Position 2 → homePositions[1], etc.
    const positions = this.state.miltyDraftPositions
    const playerHomeIndex = {} // playerName → index into homePositions

    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      const draftedPos = positions[player.name] // 1-indexed
      const homeIdx = draftedPos - 1
      playerHomeIndex[player.name] = homeIdx

      const faction = player.faction
      const homeSystemId = faction.homeSystem
      const position = layout.homePositions[homeIdx]

      if (this.factionAbilities._hasAbility(player, 'creuss-gate')) {
        this.state.systems['creuss-gate'] = {
          tileId: 'creuss-gate',
          position,
          commandTokens: [],
        }
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

    // Compute slice positions for each player
    // Each home gets 5 closest non-home, non-mecatol positions (greedy assignment)
    const homeSet = new Set(layout.homePositions.map(h => `${h.q},${h.r}`))
    const allPositions = [
      ...layout.ring1,
      ...layout.ring2,
      ...(layout.outerPositions || []),
    ].filter(p => !homeSet.has(`${p.q},${p.r}`) && !(p.q === 0 && p.r === 0))

    const assigned = new Set()
    const slicePositions = [] // per-player: array of 5 positions

    for (let i = 0; i < players.length; i++) {
      const home = layout.homePositions[playerHomeIndex[players[i].name]]
      const available = allPositions
        .filter(p => !assigned.has(`${p.q},${p.r}`))
        .map(p => ({
          ...p,
          dist: res.getHexDistance(p, home),
          ring: res.getHexDistance(p, layout.mecatol),
        }))
        .sort((a, b) => a.dist - b.dist || a.ring - b.ring)

      const positions = available.slice(0, 5)
      for (const p of positions) {
        assigned.add(`${p.q},${p.r}`)
      }
      slicePositions.push(positions)
    }

    // Place slice tiles at computed positions
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      const sliceData = this.state.miltyDraftSlices[player.name]
      if (!sliceData) {
        continue
      }

      const positions = slicePositions[i]
      for (let j = 0; j < Math.min(sliceData.tiles.length, positions.length); j++) {
        const tileId = sliceData.tiles[j]
        this.state.systems[tileId] = {
          tileId,
          position: { q: positions[j].q, r: positions[j].r },
          commandTokens: [],
        }
      }
    }

    // Fill remaining empty positions with leftover blue/red tiles
    const usedTiles = new Set(Object.keys(this.state.systems).map(k => isNaN(k) ? k : Number(k)))
    const remainingPositions = allPositions.filter(p => !assigned.has(`${p.q},${p.r}`))

    if (remainingPositions.length > 0) {
      const blueTiles = res.getBlueTiles().map(t => t.id).filter(id => !usedTiles.has(id))
      const redTiles = res.getRedTiles().map(t => t.id).filter(id => !usedTiles.has(id))
      this._shuffle(blueTiles)
      this._shuffle(redTiles)

      const fillerTiles = [...blueTiles, ...redTiles]
      for (let i = 0; i < Math.min(remainingPositions.length, fillerTiles.length); i++) {
        const tileId = fillerTiles[i]
        const pos = remainingPositions[i]
        this.state.systems[tileId] = {
          tileId,
          position: pos,
          commandTokens: [],
        }
      }
    }

    this._initializeSystemUnits()
  }

} // module.exports
