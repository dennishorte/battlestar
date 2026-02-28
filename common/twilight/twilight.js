const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
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

// Floating Factory blockade: destroy space docks in space that are in systems
// with enemy ships and no friendly ships
// Jol-Nar Commander: after rolling dice for a unit ability, may reroll any misses
Twilight.prototype._offerUnitAbilityReroll = function(shooterName, missCombatValues) {
  if (missCombatValues.length === 0) {
    return 0
  }

  const shooterPlayer = this.players.byName(shooterName)
  if (!shooterPlayer) {
    return 0
  }
  if (shooterPlayer.faction?.id !== 'universities-of-jol-nar') {
    return 0
  }
  if (!shooterPlayer.isCommanderUnlocked()) {
    return 0
  }

  const choice = this.actions.choose(shooterPlayer, [`Reroll ${missCombatValues.length} dice`, 'Pass'], {
    title: 'Agnlan Oln: Reroll missed unit ability dice?',
  })

  if (choice[0] === 'Pass') {
    return 0
  }

  let additionalHits = 0
  for (const combatValue of missCombatValues) {
    const roll = Math.floor(this.random() * 10) + 1
    if (roll >= combatValue) {
      additionalHits++
    }
  }

  if (additionalHits > 0) {
    this.log.add({
      template: 'Agnlan Oln: {player} rerolls — {hits} additional hits',
      args: { player: shooterName, hits: additionalHits },
    })
  }

  return additionalHits
}

Twilight.prototype._checkFloatingFactoryBlockade = function() {
  for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    const spaceDocks = systemUnits.space.filter(u => u.type === 'space-dock')
    if (spaceDocks.length === 0) {
      continue
    }

    for (const dock of spaceDocks) {
      const friendlyShips = systemUnits.space.filter(
        u => u.owner === dock.owner && u.type !== 'space-dock' && res.getUnit(u.type)?.category === 'ship'
      )
      const enemyShips = systemUnits.space.filter(
        u => u.owner !== dock.owner && res.getUnit(u.type)?.category === 'ship'
      )

      if (enemyShips.length > 0 && friendlyShips.length === 0) {
        const idx = systemUnits.space.indexOf(dock)
        if (idx !== -1) {
          systemUnits.space.splice(idx, 1)
        }
        this.log.add({
          template: 'Floating Factory blockaded: {owner} space dock in system {system} is destroyed',
          args: { owner: dock.owner, system: systemId },
        })
      }
    }
  }
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


// Returns unit stats for a given player, applying faction unit overrides and
// any researched unit upgrades. Falls back to base stats if no override or
// upgrade is available.
Twilight.prototype._getUnitStats = function(playerName, unitType) {
  const base = res.getUnit(unitType)
  if (!base) {
    return null
  }

  const player = this.players.byName(playerName)
  if (!player) {
    return base
  }

  // Apply faction unit overrides (e.g., Saar Floating Factory I, Sardakk Exotrireme I)
  let effective = base
  if (player.faction?.unitOverrides?.[unitType]) {
    effective = { ...base, ...player.faction.unitOverrides[unitType] }
  }

  // Check if player has researched a unit upgrade for this type
  const techIds = player.getTechIds()
  const allTechs = [...res.getGenericTechnologies()]
  if (player.faction?.factionTechnologies) {
    allTechs.push(...player.faction.factionTechnologies)
  }

  const upgrade = allTechs.find(t => t.unitUpgrade === unitType && techIds.includes(t.id))
  if (!upgrade || !upgrade.stats) {
    return effective
  }

  // Merge upgrade stats over effective stats (override + base)
  return { ...effective, ...upgrade.stats }
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

  // Gamma wormhole tokens (from exploration cards)
  if (this.state.gammaWormholeTokens?.includes(String(systemId))) {
    if (!tileWormholes.includes('gamma')) {
      tileWormholes.push('gamma')
    }
  }

  // Ion Storm token
  const ionStorm = this.state.ionStormToken
  if (ionStorm && String(ionStorm.systemId) === String(systemId)) {
    if (!tileWormholes.includes(ionStorm.side)) {
      tileWormholes.push(ionStorm.side)
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

      // Gamma wormhole tokens on other system
      if (this.state.gammaWormholeTokens?.includes(String(otherId))) {
        if (!otherWormholes.includes('gamma')) {
          otherWormholes.push('gamma')
        }
      }

      // Ion Storm token on other system
      if (ionStorm && String(ionStorm.systemId) === String(otherId)) {
        if (!otherWormholes.includes(ionStorm.side)) {
          otherWormholes.push(ionStorm.side)
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
      event: 'round-start',
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
  this.log.add({ template: 'Strategy Phase', event: 'phase-start', args: { phase: 'strategy' } })
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
      // On the first strategy phase, each player picks their color before their first card
      if (round === 0 && this.state.round === 1) {
        this.chooseColor(player)
      }

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
        event: 'player-action',
      })
    }
  }

  // Place trade goods on unchosen strategy cards
  for (const cardId of this.state.availableStrategyCards) {
    this.state.strategyCardTradeGoods[cardId] = (this.state.strategyCardTradeGoods[cardId] || 0) + 1
  }

  // End of strategy phase triggers (e.g., Quantum Datahub Node)
  for (const player of this.players.all()) {
    this.factionAbilities.onStrategyPhaseEnd(player)
  }

  this.log.outdent()
}

Twilight.prototype.actionPhase = function() {
  this.state.phase = 'action'
  this.log.add({ template: 'Action Phase', event: 'phase-start', args: { phase: 'action' } })
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
    const choices = [
      { title: 'Tactical Action', subtitles: ['Activate a system, move ships, invade planets'] },
    ]
    if (this._hasAvailableComponentActions(player)) {
      choices.push({ title: 'Component Action', subtitles: ['Use a faction ability or technology'] })
    }
    if (!player.hasUsedStrategyCard()) {
      const unusedCards = player.strategyCards.filter(c => !c.used).map(c => c.id)
      choices.push({
        title: 'Strategic Action',
        subtitles: ['Resolve your strategy card\'s primary ability'],
        strategyCardIds: unusedCards,
      })
    }
    // Add action card option if player has action-timing cards
    const actionTimingCards = (player.actionCards || []).filter(c => c.timing === 'action')
    if (actionTimingCards.length > 0) {
      choices.push({ title: 'Play Action Card', subtitles: ['Play an action card from your hand'] })
    }
    choices.push({ title: 'Pass', subtitles: ['End your turns for this round'] })

    // Cannot pass until strategy card is used
    const availableChoices = player.hasUsedStrategyCard()
      ? choices
      : choices.filter(c => c.title !== 'Pass')

    const selection = this.actions.choose(player, availableChoices, {
      title: 'Choose Action',
    })

    const action = selection[0]

    this.log.add({
      template: '{player}: {action}',
      args: { player, action },
      event: 'player-turn',
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
        break
      case 'Component Action':
        this._componentAction(player)
        this.factionAbilities.afterComponentAction(player)
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
          event: 'player-action',
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
      const bonusChoices = [
        { title: 'Tactical Action', subtitles: ['Activate a system, move ships, invade planets'] },
      ]
      if (this._hasAvailableComponentActions(player)) {
        bonusChoices.push({ title: 'Component Action', subtitles: ['Use a faction ability or technology'] })
      }
      if (!player.hasUsedStrategyCard()) {
        const unusedCards = player.strategyCards.filter(c => !c.used).map(c => c.id)
        bonusChoices.push({
          title: 'Strategic Action',
          subtitles: ['Resolve your strategy card\'s primary ability'],
          strategyCardIds: unusedCards,
        })
      }
      const bonusActionCards = (player.actionCards || []).filter(c => c.timing === 'action')
      if (bonusActionCards.length > 0) {
        bonusChoices.push({ title: 'Play Action Card', subtitles: ['Play an action card from your hand'] })
      }
      bonusChoices.push({ title: 'Decline' })

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
            break
          case 'Component Action':
            this._componentAction(player)
            this.factionAbilities.afterComponentAction(player)
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
  this.log.add({ template: 'Status Phase', event: 'phase-start', args: { phase: 'status' } })
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
    let drawCount = player.hasTechnology('neural-motivator') ? 2 : 1
    // Slumberstate Computing: draw 1 additional per coexisting player
    const handler = this.factionAbilities._getPlayerHandler(player)
    if (handler?.getAdditionalActionCardDraw) {
      drawCount += handler.getAdditionalActionCardDraw(player, this.factionAbilities)
    }
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

    // Ready exhausted relics
    if (this.state.exhaustedRelics?.[player.name]) {
      this.state.exhaustedRelics[player.name] = []
    }
  }

  // Step 9: Return strategy cards
  for (const player of this.players.all()) {
    player.returnStrategyCard()
  }

  // Step 10: End-of-status-phase faction triggers (e.g., Arborec Bioplasmosis)
  for (const player of this._getPlayersInInitiativeOrder()) {
    this.factionAbilities.onStatusPhaseEnd(player)
  }

  // Step 10b: Crown of Emphidia — purge for +1 VP if controlling Tomb of Emphidia
  for (const player of this._getPlayersInInitiativeOrder()) {
    this._offerCrownOfEmphidiaStatusPhase(player)
  }

  this.log.outdent()
}

Twilight.prototype.agendaPhase = function() {
  this.state.phase = 'agenda'
  this.log.add({ template: 'Agenda Phase', event: 'phase-start', args: { phase: 'agenda' } })
  this.log.indent()

  // Maw of Worlds: purge + exhaust all planets to gain any 1 tech
  for (const player of this._getPlayersInInitiativeOrder()) {
    this._offerMawOfWorlds(player)
  }

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
    event: 'agenda',
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

  // Pre-voting abilities: predictions and PN plays (Nekro, Keleres Rider)
  this.factionAbilities.onAgendaVotingStart(agenda, outcomes)

  // Faction abilities modify agenda participation (Argent first, Nekro excluded, Keleres Rider excluded)
  const participation = this.factionAbilities.getAgendaParticipation(votingOrder)
  votingOrder = participation.order

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

    // Faction abilities before vote (e.g., Mahact Genetic Recombination)
    const preVote = this.factionAbilities.onBeforePlayerVote(player, outcomes)

    const availableInfluence = player.getTotalInfluence()
    const votingModifier = this.factionAbilities.getVotingModifier(player)

    let chosen
    if (preVote?.forcedOutcome) {
      // Player was forced to vote for a specific outcome
      chosen = preVote.forcedOutcome
    }
    else {
      const voteChoices = ['Abstain', ...outcomes]
      const selection = this.actions.choose(player, voteChoices, {
        title: `Vote on ${agenda.name} (${availableInfluence} influence available)`,
        noAutoRespond: true,
      })
      chosen = selection[0]
    }

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
      let inf = planet ? planet.influence : 0
      if (this.state.planets[pId]?.terraform) {
        inf += 1
      }
      const attachBonuses = this._getPlanetAttachmentBonuses(pId)
      inf += attachBonuses.influence
      return `${pId} (${inf})`
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
        let inf = planet.influence
        if (this.state.planets[planetId]?.terraform) {
          inf += 1
        }
        const attachBonuses = this._getPlanetAttachmentBonuses(planetId)
        inf += attachBonuses.influence
        totalInfluence += inf
        this.state.planets[planetId].exhausted = true
      }
    }

    totalInfluence += votingModifier

    // Hacan Commander (Gila the Silvertongue): spend TG for 2 extra votes each
    const tgVoteRate = this.factionAbilities.getTradeGoodVoteRate(player)
    if (tgVoteRate > 0 && player.tradeGoods > 0) {
      const maxTG = player.tradeGoods
      const tgChoices = []
      for (let n = 0; n <= maxTG; n++) {
        tgChoices.push(`Spend ${n} TG (+${n * tgVoteRate} votes)`)
      }
      const tgSel = this.actions.choose(player, tgChoices, {
        title: `Spend trade goods for extra votes? (${tgVoteRate} votes per TG)`,
      })
      const tgSpent = parseInt(tgSel[0].match(/\d+/)?.[0]) || 0
      if (tgSpent > 0) {
        player.spendTradeGoods(tgSpent)
        totalInfluence += tgSpent * tgVoteRate
      }
    }

    votes[chosen] = (votes[chosen] || 0) + totalInfluence
    playerVotes[player.name] = { outcome: chosen, count: totalInfluence }

    this.log.add({
      template: '{player} votes for {outcome} ({count} votes)',
      args: { player, outcome: chosen, count: totalInfluence },
    })
  }

  // Blood Pact: add bonus votes when holder and Empyrean vote for same outcome
  this.factionAbilities.applyVoteBonuses(votes, playerVotes)

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
    event: 'agenda-outcome',
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

  // Chaos Mapping: other players cannot activate asteroid fields with Saar ships
  if (this.factionAbilities.isSystemActivationBlocked(player.name, systemId)) {
    this.log.add({
      template: '{player} cannot activate system {system} (blocked by Chaos Mapping)',
      args: { player, system: systemId },
    })
    this.log.outdent()
    return
  }

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
    event: 'activate-system',
  })

  // Titans awaken: replace sleeper tokens with PDS
  this.factionAbilities.onSystemActivated(player.name, systemId)

  // Nullification Field: Xxcha can end the activating player's turn immediately
  if (this.state.nullificationFieldActive) {
    delete this.state.nullificationFieldActive
    this.log.outdent()
    return
  }

  // Mahact Commander (Il Na Viroset): reactivated a system with own token — end turn
  if (this.state.mahactReactivation) {
    delete this.state.mahactReactivation
    this.log.outdent()
    return
  }

  // Mahact Mech (Starlancer): opponent activated system with Mahact mech — end their turn
  if (this.state.mahactMechEndTurn) {
    delete this.state.mahactMechEndTurn
    this.log.outdent()
    return
  }

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

  // Dominus Orb: purge to move from systems with own command tokens
  this._offerDominusOrb(player)

  // Snapshot ion storm ships before movement (for flip detection)
  const ionStorm = this.state.ionStormToken
  let ionStormShipsBefore = 0
  if (ionStorm) {
    const ionUnits = this.state.units[ionStorm.systemId]
    ionStormShipsBefore = ionUnits ? ionUnits.space.filter(u => res.getUnit(u.type)?.category === 'ship').length : 0
  }

  // Step 2: Move ships
  this._movementStep(player, systemId)

  // Ion Storm: flip if ships moved into or out of the ion storm system
  if (ionStorm) {
    const ionUnits = this.state.units[ionStorm.systemId]
    const ionStormShipsAfter = ionUnits ? ionUnits.space.filter(u => res.getUnit(u.type)?.category === 'ship').length : 0
    const targetIsIonStorm = String(systemId) === String(ionStorm.systemId)
    if (targetIsIonStorm || ionStormShipsBefore !== ionStormShipsAfter) {
      this.state.ionStormToken.side = ionStorm.side === 'alpha' ? 'beta' : 'alpha'
      this.log.add({
        template: 'Ion Storm flips to {side} wormhole',
        args: { side: this.state.ionStormToken.side },
      })
    }
  }

  // Clear Dominus Orb flag after movement
  delete this.state._dominusOrbActive

  // Dark Energy Tap: explore frontier token in activated system if player has ships
  if (player.hasTechnology('dark-energy-tap')) {
    const hasShipsInSystem = this.state.units[systemId]?.space.some(u => u.owner === player.name)
    const deTile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (hasShipsInSystem && deTile && deTile.planets.length === 0) {
      this._exploreFrontier(systemId, player.name, 'Dark Energy Tap')
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

  // Clear temporary adjacency (Spatial Conduit Cylinder)
  delete this.state.temporaryAdjacency

  // Clear hegemonic trade swaps (Winnu)
  delete this.state.hegemonicTradeSwaps

  // Floating Factory blockade: destroy Saar space docks in systems with enemy ships and no friendly ships
  this._checkFloatingFactoryBlockade()

  // End-of-tactical-action faction triggers (e.g., Sardakk N'orr agent T'ro)
  this.factionAbilities.onTacticalActionEnd(player, systemId)

  // Crown of Emphidia: exhaust to explore a controlled planet after tactical action
  this._offerCrownOfEmphidiaAfterTactical(player)

  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Helper: find system ID for a planet

// Returns the planet list for a system, including dynamically placed planets (Mirage).
Twilight.prototype._getSystemPlanets = function(systemId) {
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  const planets = tile ? [...tile.planets] : []
  if (this.state.miragePlanet === String(systemId) && !planets.includes('mirage')) {
    planets.push('mirage')
  }
  return planets
}

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

Twilight.prototype._getAvailableResources = function(player) {
  let total = 0
  const canSpendFlexibly = this.factionAbilities.canSpendFlexibly(player)
  const controlledPlanets = player.getControlledPlanets()
  for (const pId of controlledPlanets) {
    if (!this.state.planets[pId]?.exhausted) {
      const planet = res.getPlanet(pId)
      if (planet) {
        total += planet.resources
        if (canSpendFlexibly) {
          total += planet.influence
        }
      }
    }
  }
  return total
}

Twilight.prototype._getInitiative = function(player) {
  // Gift of Prescience holder gets initiative 0
  if (this.state._giftOfPrescience?.holder === player.name) {
    return 0
  }

  // Naalu Telepathic: initiative 0 (always goes first)
  // But not when Gift of Prescience is active (Naalu loses Telepathic this round)
  if (this.factionAbilities._hasAbility(player, 'telepathic')) {
    if (!this.state._giftOfPrescience) {
      return 0
    }
  }

  const card = res.getStrategyCard(player.getStrategyCardId())
  return card ? card.number : 99
}

Twilight.prototype._getFleetLimit = function(player) {
  // Darktalon Treilla: no fleet limit this round
  if (this.state.noFleetLimit?.[player.name]) {
    return 999
  }

  let limit = player.commandTokens.fleet
  // Letnev Armada: +2 to fleet pool for non-fighter ships
  if (this.factionAbilities._hasAbility(player, 'armada')) {
    limit += 2
  }
  // Mahact Edict: captured command tokens count toward fleet pool
  limit += this.factionAbilities.getCapturedTokenFleetBonus(player)
  return limit
}


Twilight.prototype._getPlayersInInitiativeOrder = function() {
  const players = this.players.all()
  return [...players].sort((a, b) => {
    return this._getInitiative(a) - this._getInitiative(b)
  })
}


////////////////////////////////////////////////////////////////////////////////
// System file requires

require('./systems/initialization.js')(Twilight)
require('./systems/movement.js')(Twilight)
require('./systems/combat.js')(Twilight)
require('./systems/production.js')(Twilight)
require('./systems/strategyCards.js')(Twilight)
require('./systems/componentActions.js')(Twilight)
require('./systems/spaceCannon.js')(Twilight)
require('./systems/trade.js')(Twilight)
require('./systems/objectives.js')(Twilight)
require('./systems/actionCards.js')(Twilight)
require('./systems/leaders.js')(Twilight)
require('./systems/exploration.js')(Twilight)
require('./systems/relicAbilities.js')(Twilight)
