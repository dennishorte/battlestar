const { TwilightFactory } = require('./twilight.js')
const { BaseCard } = require('../lib/game/index.js')
const TestCommon = require('../lib/test_common.js')
const res = require('./res/index.js')


const TestUtil = { ...TestCommon }
module.exports = TestUtil


// ---------------------------------------------------------------------------
// Default deterministic galaxy layout for 2-player tests
// ---------------------------------------------------------------------------
//
// All positions use axial hex coordinates {q, r} with Mecatol Rex at (0,0).
// Home systems: P1 (dennis) at (0,-3), P2 (micah) at (0,3).
//
// Layout diagram (flat-top hexes, north up):
//
//               P1 home
//            [27]  [37]
//         [48]  [26]  [24]
//      [41]  [35]  [18]  [39]
//         [44]  [34]  [20]
//            [42]  [25]  [40]
//               [36]  [19]  [47]
//                  [38]
//               P2 home
//
// Key adjacencies:
//   P1 home (0,-3) → [27]
//   P2 home (0, 3) → [38, 36]
//   Mecatol  (0, 0) → [26, 20, 19, 25, 34, 35]
//
const DEFAULT_2P_SYSTEMS = {
  // Ring 1 — adjacent to Mecatol Rex (18)
  26: { q: 0, r: -1 },   // Lodor (alpha wormhole, planet: lodor)
  20: { q: 1, r: -1 },   // Vefut II (planet: vefut-ii)
  19: { q: 1, r: 0 },    // Wellon (planet: wellon)
  25: { q: 0, r: 1 },    // Quann (beta wormhole, planet: quann)
  34: { q: -1, r: 1 },   // Centauri + Gral
  35: { q: -1, r: 0 },   // Bereg + Lirta IV

  // Ring 2 — north (adjacent to P1 home)
  27: { q: 0, r: -2 },   // New Albion + Starpoint
  37: { q: 1, r: -2 },   // Arinam + Meer

  // Ring 2 — east
  24: { q: 2, r: -2 },   // Mehar Xull
  39: { q: 2, r: -1 },   // empty (alpha wormhole)
  40: { q: 2, r: 0 },    // empty (beta wormhole)
  47: { q: 1, r: 1 },    // empty

  // Ring 2 — south (adjacent to P2 home)
  38: { q: 0, r: 2 },    // Abyz + Fria
  36: { q: -1, r: 2 },   // Arnor + Lor

  // Ring 2 — west
  42: { q: -2, r: 2 },   // nebula
  44: { q: -2, r: 1 },   // asteroid field
  41: { q: -2, r: 0 },   // gravity rift
  48: { q: -1, r: -1 },  // empty
}

// Export for tests that need to reference the layout
TestUtil.DEFAULT_2P_SYSTEMS = DEFAULT_2P_SYSTEMS


/**
 * Replace non-home, non-mecatol systems with a deterministic layout.
 */
function _applyTestLayout(game, layout) {
  // Remove all non-home, non-mecatol systems
  for (const systemId of Object.keys(game.state.systems)) {
    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (tile && (tile.type === 'home' || tile.type === 'mecatol')) {
      continue
    }
    if (tile) {
      for (const planetId of tile.planets) {
        delete game.state.planets[planetId]
      }
    }
    delete game.state.systems[systemId]
    delete game.state.units[systemId]
  }

  // Add layout systems
  for (const [tileId, position] of Object.entries(layout)) {
    game.state.systems[tileId] = {
      tileId: Number(tileId),
      position,
      commandTokens: [],
    }
    game.state.units[tileId] = { space: [], planets: {} }
    const tile = res.getSystemTile(tileId) || res.getSystemTile(Number(tileId))
    if (tile) {
      for (const planetId of tile.planets) {
        game.state.units[tileId].planets[planetId] = []
        game.state.planets[planetId] = {
          controller: null,
          exhausted: false,
          attachments: [],
        }
      }
    }
  }
}


// Default starting values for testBoard assertions
const _COMMAND_TOKEN_DEFAULTS = { tactics: 3, strategy: 2, fleet: 3 }

const _PLAYER_DEFAULTS = {
  tradeGoods: 0,
  commodities: 0,
  victoryPoints: 0,
  strategyCard: null,
  passed: false,
}


/**
 * Return the current choice names from the waiting selector as plain strings.
 * Handles both plain string choices and { title, detail } objects.
 */
TestUtil.currentChoices = function(game) {
  const choices = game.waiting.selectors[0].choices
  return choices.map(c => typeof c === 'object' ? c.title : c)
}


/**
 * Respond to an action-type input request (e.g. activate-system, move-ships).
 * Shorthand for grabbing selectors[0] and calling respondToInputRequest.
 *
 * Usage:
 *   t.action(game, 'activate-system', { systemId: 'system-18' })
 *   t.action(game, 'move-ships', { movements: [...] })
 */
TestUtil.action = function(game, actionName, opts = {}) {
  const selector = game.waiting.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: actionName, ...opts },
  })
}


/**
 * Create a standard test fixture for Twilight Imperium.
 *
 * Options:
 *   numPlayers          - Number of players (default: 2)
 *   factions            - Array of faction IDs (default: auto-assigned)
 *   players             - Player list (default: dennis, micah, scott, ...)
 *   seed                - Random seed (default: 'test_seed')
 *   deterministicLayout - Use fixed galaxy layout (default: true for 2p)
 *
 * Returns a game instance ready for setBoard + run.
 */
TestUtil.fixture = function(options = {}) {
  const deterministicLayout = options.deterministicLayout !== false

  const defaultFactions = [
    'federation-of-sol',
    'emirates-of-hacan',
    'barony-of-letnev',
  ]

  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: options.numPlayers || 2,
    players: [
      { _id: 'dennis_id', name: 'dennis' },
      { _id: 'micah_id', name: 'micah' },
      { _id: 'scott_id', name: 'scott' },
    ],
    playerOptions: {
      shuffleSeats: false,
    },
    factions: options.factions || defaultFactions.slice(0, options.numPlayers || 2),
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = TwilightFactory(options, 'dennis')

  // Set up breakpoint for initialization
  game.testSetBreakpoint('initialization-complete', (game) => {
    game.state.skipInitialDraws = true

    // Apply deterministic galaxy layout for 2p tests
    if (deterministicLayout && options.numPlayers === 2) {
      _applyTestLayout(game, DEFAULT_2P_SYSTEMS)
    }
  })

  return game
}


/**
 * Set up game state in a declarative way. All fields are optional and
 * default to sensible starting values.
 *
 * Game-level fields:
 *   round              - Number. Round number (1+).
 *   phase              - 'strategy' | 'action' | 'status' | 'agenda'
 *   speaker            - Player name of the speaker
 *   custodiansRemoved  - Boolean, enables agenda phase
 *   laws               - Array of active law card IDs
 *   publicObjectives   - Array of revealed public objective IDs
 *
 * Per-player fields (keyed by player name):
 *   faction            - Faction ID (applied during initialization)
 *   units              - Object keyed by system ID → { space: [...types], planetName: [...types] }
 *   commandTokens      - { tactics, strategy, fleet }
 *   tradeGoods         - Number
 *   commodities        - Number
 *   technologies       - Array of tech IDs
 *   actionCards        - Array of action card IDs in hand
 *   secretObjectives   - Array of secret objective IDs
 *   scoredObjectives   - Array of scored objective IDs
 *   victoryPoints      - Number
 *   planets            - Object keyed by planet ID → { exhausted: bool }
 *   strategyCard       - Strategy card ID (for mid-action-phase tests)
 *   leaders            - { agent: 'ready'|'exhausted', commander: 'locked'|'unlocked', hero: 'locked'|'unlocked'|'purged' }
 *   relicFragments     - Array of fragment types (e.g. ['cultural', 'hazardous'])
 *
 * Game-level faction state:
 *   sleeperTokens      - Object: planetId → ownerName (Titans of Ul)
 *   capturedUnits      - Object: playerName → [{ type, originalOwner }] (Vuil'raith Cabal)
 *
 * Galaxy layout:
 *   systems            - Object: tileId → { q, r } to override the galaxy layout
 */
TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    // Skip initial draws unless explicitly enabled
    if (state.enableInitialDraws) {
      game.state.skipInitialDraws = false
    }

    // Apply game-level state
    if (state.round !== undefined) {
      game.state.round = state.round
    }
    if (state.phase !== undefined) {
      game.state.phase = state.phase
    }
    if (state.speaker !== undefined) {
      game.state.speaker = state.speaker
    }
    if (state.custodiansRemoved !== undefined) {
      game.state.custodiansRemoved = state.custodiansRemoved
    }
    if (state.agendaDeck !== undefined) {
      game.state.agendaDeck = state.agendaDeck.map(id => res.getAgendaCard(id))
    }
    if (state.revealedObjectives !== undefined) {
      game.state.revealedObjectives = [...state.revealedObjectives]
    }
    if (state.explorationDecks !== undefined) {
      game.state.explorationDecks = {}
      for (const [trait, cardIds] of Object.entries(state.explorationDecks)) {
        game.state.explorationDecks[trait] = cardIds.map(id => {
          const card = res.getExplorationCard(id)
          return card || { id, name: id, trait, type: 'action' }
        })
      }
    }
    if (state.exploredPlanets !== undefined) {
      game.state.exploredPlanets = { ...state.exploredPlanets }
    }

    // Faction-specific game state
    if (state.sleeperTokens !== undefined) {
      Object.assign(game.state.sleeperTokens, state.sleeperTokens)
    }
    if (state.capturedUnits !== undefined) {
      for (const [playerName, units] of Object.entries(state.capturedUnits)) {
        game.state.capturedUnits[playerName] = units.map(u => ({ ...u }))
      }
    }

    // Override galaxy layout (before unit placement)
    if (state.systems) {
      _applyTestLayout(game, state.systems)
    }

    // Apply per-player state
    for (const player of game.players.all()) {
      const playerState = state[player.name]
      if (!playerState) {
        continue
      }

      // Command tokens
      if (playerState.commandTokens) {
        player.setCommandTokens(playerState.commandTokens)
      }

      // Resources
      if (playerState.tradeGoods !== undefined) {
        player.tradeGoods = playerState.tradeGoods
      }
      if (playerState.commodities !== undefined) {
        player.commodities = playerState.commodities
      }

      // Victory points
      if (playerState.victoryPoints !== undefined) {
        player.victoryPoints = playerState.victoryPoints
      }

      // Strategy card(s)
      if (playerState.strategyCard) {
        const cards = Array.isArray(playerState.strategyCard)
          ? playerState.strategyCard
          : [playerState.strategyCard]
        for (const cardId of cards) {
          player.pickStrategyCard(cardId)
        }
      }

      // Leaders
      if (playerState.leaders) {
        Object.assign(player.leaders, playerState.leaders)
      }

      // Technologies
      if (playerState.technologies) {
        const techZone = game.zones.byPlayer(player, 'technologies')
        if (techZone) {
          // Reset zone and re-initialize with specified techs
          techZone.reset()
          const techCards = []
          for (const techId of playerState.technologies) {
            const tech = res.getTechnology(techId)
            if (tech) {
              const cardId = `${player.name}-${techId}`
              let card
              try {
                card = game.cards.byId(cardId)
              }
              catch { /* not registered yet */ }
              if (!card) {
                card = new BaseCard(game, { id: cardId, ...tech })
                game.cards.register(card)
              }
              techCards.push(card)
            }
          }
          techZone.initializeCards(techCards)
        }
      }

      // Units
      if (playerState.units) {
        // Clear all existing units for this player
        for (const systemId of Object.keys(game.state.units)) {
          const systemUnits = game.state.units[systemId]
          systemUnits.space = systemUnits.space.filter(u => u.owner !== player.name)
          for (const planetId of Object.keys(systemUnits.planets)) {
            systemUnits.planets[planetId] = systemUnits.planets[planetId]
              .filter(u => u.owner !== player.name)
          }
        }

        // Place specified units
        for (const [systemId, locations] of Object.entries(playerState.units)) {
          // Ensure system exists in units state
          if (!game.state.units[systemId]) {
            game.state.units[systemId] = { space: [], planets: {} }
          }

          for (const [location, unitTypes] of Object.entries(locations)) {
            for (const unitType of unitTypes) {
              game._addUnit(systemId, location, unitType, player.name)
            }
          }
        }
      }

      // Planet control
      if (playerState.planets) {
        for (const [planetId, planetState] of Object.entries(playerState.planets)) {
          if (!game.state.planets[planetId]) {
            game.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
          }
          game.state.planets[planetId].controller = player.name
          if (planetState.exhausted !== undefined) {
            game.state.planets[planetId].exhausted = planetState.exhausted
          }
        }
      }

      // Action cards in hand
      if (playerState.actionCards !== undefined) {
        player.actionCards = playerState.actionCards.map(id => {
          const card = res.getActionCard(id)
          return card ? { ...card, deckIndex: 0 } : { id, name: id, timing: 'action', deckIndex: 0 }
        })
      }

      // Secret objectives
      if (playerState.secretObjectives !== undefined) {
        player.secretObjectives = [...playerState.secretObjectives]
      }

      // Scored objectives
      if (playerState.scoredObjectives !== undefined) {
        if (!game.state.scoredObjectives[player.name]) {
          game.state.scoredObjectives[player.name] = []
        }
        game.state.scoredObjectives[player.name] = [...playerState.scoredObjectives]
      }

      // Promissory notes
      if (playerState.promissoryNotes !== undefined) {
        player.promissoryNotes = []
        for (const noteSpec of playerState.promissoryNotes) {
          if (typeof noteSpec === 'string') {
            // Simple ID — assume owned by this player
            player.addPromissoryNote(noteSpec, player.name)
          }
          else {
            // { id, owner } object
            player.addPromissoryNote(noteSpec.id, noteSpec.owner)
          }
        }
      }

      // Relic fragments (Naaz-Rokha)
      if (playerState.relicFragments !== undefined) {
        player.relicFragments = [...playerState.relicFragments]
      }
    }
  })
}


/**
 * Declarative assertions against game state.
 * Checks all specified fields. Uses defaults for unspecified fields.
 * Collects all errors and reports them together.
 *
 * Same fields as setBoard. Example:
 *   t.testBoard(game, {
 *     dennis: {
 *       commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
 *       tradeGoods: 0,
 *       units: {
 *         'system-18': { space: ['carrier', 'fighter', 'fighter'] },
 *       },
 *     },
 *   })
 */
TestUtil.testBoard = function(game, expected) {
  const errors = []

  function check(path, actual, expected) {
    if (typeof expected === 'object' && expected !== null && !Array.isArray(expected)) {
      for (const [key, value] of Object.entries(expected)) {
        check(`${path}.${key}`, actual?.[key], value)
      }
    }
    else if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) {
        errors.push(`${path}: expected array ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
        return
      }
      if (actual.length !== expected.length) {
        errors.push(`${path}: expected length ${expected.length}, got ${actual.length} (${JSON.stringify(actual)})`)
        return
      }
      // For unit arrays, sort both for comparison
      const sortedExpected = [...expected].sort()
      const sortedActual = [...actual].sort()
      for (let i = 0; i < sortedExpected.length; i++) {
        if (sortedActual[i] !== sortedExpected[i]) {
          errors.push(`${path}: expected ${JSON.stringify(expected.sort())}, got ${JSON.stringify(actual.sort())}`)
          return
        }
      }
    }
    else {
      if (actual !== expected) {
        errors.push(`${path}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    }
  }

  // Game-level assertions
  if (expected.round !== undefined) {
    check('round', game.state.round, expected.round)
  }
  if (expected.phase !== undefined) {
    check('phase', game.state.phase, expected.phase)
  }
  if (expected.speaker !== undefined) {
    check('speaker', game.state.speaker, expected.speaker)
  }
  if (expected.custodiansRemoved !== undefined) {
    check('custodiansRemoved', game.state.custodiansRemoved, expected.custodiansRemoved)
  }

  // Per-player assertions
  for (const player of game.players.all()) {
    const playerExpected = expected[player.name]
    if (!playerExpected) {
      continue
    }

    const prefix = player.name

    // Command tokens
    if (playerExpected.commandTokens) {
      check(`${prefix}.commandTokens`, player.commandTokens, playerExpected.commandTokens)
    }

    // Resources
    if (playerExpected.tradeGoods !== undefined) {
      check(`${prefix}.tradeGoods`, player.tradeGoods, playerExpected.tradeGoods)
    }
    if (playerExpected.commodities !== undefined) {
      check(`${prefix}.commodities`, player.commodities, playerExpected.commodities)
    }
    if (playerExpected.victoryPoints !== undefined) {
      check(`${prefix}.victoryPoints`, player.victoryPoints, playerExpected.victoryPoints)
    }

    // Strategy card
    if (playerExpected.strategyCard !== undefined) {
      check(`${prefix}.strategyCard`, player.getStrategyCardId(), playerExpected.strategyCard)
    }

    // Passed
    if (playerExpected.passed !== undefined) {
      check(`${prefix}.passed`, player.hasPassed(), playerExpected.passed)
    }

    // Units
    if (playerExpected.units) {
      for (const [systemId, locations] of Object.entries(playerExpected.units)) {
        const systemUnits = game.state.units[systemId]
        if (!systemUnits) {
          errors.push(`${prefix}.units.${systemId}: system not found in game state`)
          continue
        }

        for (const [location, expectedTypes] of Object.entries(locations)) {
          let actualUnits
          if (location === 'space') {
            actualUnits = systemUnits.space.filter(u => u.owner === player.name)
          }
          else {
            actualUnits = (systemUnits.planets[location] || []).filter(u => u.owner === player.name)
          }

          const actualTypes = actualUnits.map(u => u.type)
          check(`${prefix}.units.${systemId}.${location}`, actualTypes, expectedTypes)
        }
      }
    }

    // Planet control
    if (playerExpected.planets) {
      for (const [planetId, expectedState] of Object.entries(playerExpected.planets)) {
        const actualState = game.state.planets[planetId]
        if (!actualState) {
          errors.push(`${prefix}.planets.${planetId}: planet not found in game state`)
          continue
        }
        check(`${prefix}.planets.${planetId}.controller`, actualState.controller, player.name)
        if (expectedState.exhausted !== undefined) {
          check(`${prefix}.planets.${planetId}.exhausted`, actualState.exhausted, expectedState.exhausted)
        }
      }
    }

    // Technologies
    if (playerExpected.technologies) {
      const actualTechs = player.getTechnologies()
        .map(id => id.replace(`${player.name}-`, ''))  // strip player prefix
      check(`${prefix}.technologies`, actualTechs, playerExpected.technologies)
    }

    // Leaders
    if (playerExpected.leaders) {
      check(`${prefix}.leaders`, player.leaders, playerExpected.leaders)
    }
  }

  if (errors.length > 0) {
    throw new Error(`testBoard failures:\n  ${errors.join('\n  ')}`)
  }
}
