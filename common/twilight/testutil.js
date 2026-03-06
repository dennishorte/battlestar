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

// 3-player layout (seed: 'test_seed', factions: sol/hacan/letnev)
// Home systems: P1 at (0,-3), P2 at (3,0), P3 at (-3,3)
const DEFAULT_3P_SYSTEMS = {
  // Ring 1
  36: { q: -1, r:  0 },   // Arnor + Lor
  61: { q: -1, r:  1 },   // Ang
  70: { q:  0, r: -1 },   // Kraag + Siig
  30: { q:  0, r:  1 },   // Mellon + Zohbat
  64: { q:  1, r: -1 },   // Atlas (beta wormhole)
  72: { q:  1, r:  0 },   // Lisis + Velnor
  // Ring 2
  41: { q: -2, r:  0 },   // empty (gravity-rift)
  76: { q: -2, r:  1 },   // Rigel I + Rigel II + Rigel III
  34: { q: -2, r:  2 },   // Centauri + Gral
  45: { q: -1, r: -1 },   // empty (asteroid-field)
  66: { q: -1, r:  2 },   // Hope's End
  35: { q:  0, r: -2 },   // Bereg + Lirta IV
  59: { q:  0, r:  2 },   // Archon Vail
  33: { q:  1, r: -2 },   // Corneeq + Resculon
  29: { q:  1, r:  1 },   // Qucen'n + Rarron
  32: { q:  2, r: -2 },   // Dal Bootha + Xxehan
  20: { q:  2, r: -1 },   // Vefut II
  24: { q:  2, r:  0 },   // Mehar Xull
  // Ring 3
  42: { q: -3, r:  2 },   // empty (nebula)
  40: { q: -2, r:  3 },   // empty (beta wormhole)
  67: { q: -1, r: -2 },   // Cormund (gravity-rift)
  47: { q:  1, r: -3 },   // empty
  78: { q:  2, r:  1 },   // empty
  46: { q:  3, r: -1 },   // empty
}

// 4-player layout (seed: 'test_seed', factions: sol/hacan/letnev/sardakk)
// Home systems: P1 at (-1,-2), P2 at (3,-2), P3 at (1,2), P4 at (-3,2)
const DEFAULT_4P_SYSTEMS = {
  // Ring 1
  36: { q: -1, r:  0 },   // Arnor + Lor
  61: { q: -1, r:  1 },   // Ang
  70: { q:  0, r: -1 },   // Kraag + Siig
  30: { q:  0, r:  1 },   // Mellon + Zohbat
  64: { q:  1, r: -1 },   // Atlas (beta wormhole)
  72: { q:  1, r:  0 },   // Lisis + Velnor
  // Ring 2
  27: { q: -2, r:  0 },   // New Albion + Starpoint
  76: { q: -2, r:  1 },   // Rigel I + Rigel II + Rigel III
  34: { q: -2, r:  2 },   // Centauri + Gral
  62: { q: -1, r: -1 },   // Sem-Lore
  66: { q: -1, r:  2 },   // Hope's End
  35: { q:  0, r: -2 },   // Bereg + Lirta IV
  59: { q:  0, r:  2 },   // Archon Vail
  33: { q:  1, r: -2 },   // Corneeq + Resculon
  29: { q:  1, r:  1 },   // Qucen'n + Rarron
  32: { q:  2, r: -2 },   // Dal Bootha + Xxehan
  20: { q:  2, r: -1 },   // Vefut II
  24: { q:  2, r:  0 },   // Mehar Xull
  // Ring 3
  39: { q: -3, r:  0 },   // empty (alpha wormhole)
  43: { q: -3, r:  1 },   // empty (supernova)
  40: { q: -3, r:  3 },   // empty (beta wormhole)
  68: { q: -2, r: -1 },   // Everra (nebula)
  42: { q: -2, r:  3 },   // empty (nebula)
  78: { q: -1, r:  3 },   // empty
  82: { q:  0, r: -3 },   // Mallice (alpha, beta, gamma wormhole)
  46: { q:  0, r:  3 },   // empty
  22: { q:  1, r: -3 },   // Tar'Mann
  31: { q:  2, r: -3 },   // Lazar + Sakulag
  67: { q:  2, r:  1 },   // Cormund (gravity-rift)
  41: { q:  3, r: -3 },   // empty (gravity-rift)
  45: { q:  3, r: -1 },   // empty (asteroid-field)
  47: { q:  3, r:  0 },   // empty
}

// 5-player layout (seed: 'test_seed', factions: sol/hacan/letnev/sardakk/mentak)
// Home systems: P1 at (2,-3), P2 at (3,0), P3 at (0,3), P4 at (-3,3), P5 at (-2,-1)
const DEFAULT_5P_SYSTEMS = {
  // Ring 1
  36: { q: -1, r:  0 },   // Arnor + Lor
  61: { q: -1, r:  1 },   // Ang
  70: { q:  0, r: -1 },   // Kraag + Siig
  30: { q:  0, r:  1 },   // Mellon + Zohbat
  64: { q:  1, r: -1 },   // Atlas (beta wormhole)
  72: { q:  1, r:  0 },   // Lisis + Velnor
  // Ring 2
  27: { q: -2, r:  0 },   // New Albion + Starpoint
  76: { q: -2, r:  1 },   // Rigel I + Rigel II + Rigel III
  34: { q: -2, r:  2 },   // Centauri + Gral
  62: { q: -1, r: -1 },   // Sem-Lore
  66: { q: -1, r:  2 },   // Hope's End
  35: { q:  0, r: -2 },   // Bereg + Lirta IV
  59: { q:  0, r:  2 },   // Archon Vail
  33: { q:  1, r: -2 },   // Corneeq + Resculon
  29: { q:  1, r:  1 },   // Qucen'n + Rarron
  32: { q:  2, r: -2 },   // Dal Bootha + Xxehan
  20: { q:  2, r: -1 },   // Vefut II
  24: { q:  2, r:  0 },   // Mehar Xull
  // Ring 3
  43: { q: -3, r:  0 },   // empty (supernova)
  40: { q: -3, r:  1 },   // empty (beta wormhole)
  42: { q: -3, r:  2 },   // empty (nebula)
  78: { q: -2, r:  3 },   // empty
  39: { q: -1, r: -2 },   // empty (alpha wormhole)
  46: { q: -1, r:  3 },   // empty
  82: { q:  0, r: -3 },   // Mallice (alpha, beta, gamma wormhole)
  22: { q:  1, r: -3 },   // Tar'Mann
  67: { q:  1, r:  2 },   // Cormund (gravity-rift)
  47: { q:  2, r:  1 },   // empty
  31: { q:  3, r: -3 },   // Lazar + Sakulag
  41: { q:  3, r: -2 },   // empty (gravity-rift)
  45: { q:  3, r: -1 },   // empty (asteroid-field)
}

// 5-player hyperlane layout (seed: 'test_seed', factions: sol/hacan/letnev/sardakk/mentak)
// Home systems: P1 at (0,-3), P2 at (3,-3), P3 at (-3,0), P4 at (3,0), P5 at (-3,3)
const DEFAULT_5P_HYPERLANE_SYSTEMS = {
  // Ring 1
  34: { q: -1, r:  0 },   // Centauri + Gral
  47: { q: -1, r:  1 },   // empty
  20: { q:  0, r: -1 },   // Vefut II
  24: { q:  1, r: -1 },   // Mehar Xull
  76: { q:  1, r:  0 },   // Rigel I + Rigel II + Rigel III
  // Ring 2
  66: { q: -2, r:  0 },   // Hope's End
  45: { q: -2, r:  1 },   // empty (asteroid-field)
  78: { q: -2, r:  2 },   // empty
  32: { q: -1, r: -1 },   // Dal Bootha + Xxehan
  30: { q:  0, r: -2 },   // Mellon + Zohbat
  42: { q:  0, r:  2 },   // empty (nebula)
  61: { q:  1, r: -2 },   // Ang
  36: { q:  2, r: -2 },   // Arnor + Lor
  29: { q:  2, r: -1 },   // Qucen'n + Rarron
  27: { q:  2, r:  0 },   // New Albion + Starpoint
  // Ring 3
  41: { q: -3, r:  1 },   // empty (gravity-rift)
  46: { q: -3, r:  2 },   // empty
  33: { q: -2, r: -1 },   // Corneeq + Resculon
  40: { q: -2, r:  3 },   // empty (beta wormhole)
  72: { q: -1, r: -2 },   // Lisis + Velnor
  70: { q:  1, r: -3 },   // Kraag + Siig
  64: { q:  2, r: -3 },   // Atlas (beta wormhole)
  67: { q:  2, r:  1 },   // Cormund (gravity-rift)
  35: { q:  3, r: -2 },   // Bereg + Lirta IV
  59: { q:  3, r: -1 },   // Archon Vail
}

// 6-player layout (seed: 'test_seed', factions: sol/hacan/letnev/sardakk/mentak/naalu)
// Home systems: P1 at (0,-3), P2 at (3,-3), P3 at (3,0), P4 at (0,3), P5 at (-3,3), P6 at (-3,0)
const DEFAULT_6P_SYSTEMS = {
  // Ring 1
  36: { q: -1, r:  0 },   // Arnor + Lor
  61: { q: -1, r:  1 },   // Ang
  70: { q:  0, r: -1 },   // Kraag + Siig
  30: { q:  0, r:  1 },   // Mellon + Zohbat
  64: { q:  1, r: -1 },   // Atlas (beta wormhole)
  72: { q:  1, r:  0 },   // Lisis + Velnor
  // Ring 2
  27: { q: -2, r:  0 },   // New Albion + Starpoint
  76: { q: -2, r:  1 },   // Rigel I + Rigel II + Rigel III
  34: { q: -2, r:  2 },   // Centauri + Gral
  62: { q: -1, r: -1 },   // Sem-Lore
  66: { q: -1, r:  2 },   // Hope's End
  35: { q:  0, r: -2 },   // Bereg + Lirta IV
  59: { q:  0, r:  2 },   // Archon Vail
  33: { q:  1, r: -2 },   // Corneeq + Resculon
  29: { q:  1, r:  1 },   // Qucen'n + Rarron
  32: { q:  2, r: -2 },   // Dal Bootha + Xxehan
  20: { q:  2, r: -1 },   // Vefut II
  24: { q:  2, r:  0 },   // Mehar Xull
  // Ring 3
  39: { q: -3, r:  1 },   // empty (alpha wormhole)
  43: { q: -3, r:  2 },   // empty (supernova)
  68: { q: -2, r: -1 },   // Everra (nebula)
  40: { q: -2, r:  3 },   // empty (beta wormhole)
  79: { q: -1, r: -2 },   // empty (asteroid-field) (alpha wormhole)
  42: { q: -1, r:  3 },   // empty (nebula)
  41: { q:  1, r: -3 },   // empty (gravity-rift)
  78: { q:  1, r:  2 },   // empty
  45: { q:  2, r: -3 },   // empty (asteroid-field)
  46: { q:  2, r:  1 },   // empty
  47: { q:  3, r: -2 },   // empty
  67: { q:  3, r: -1 },   // Cormund (gravity-rift)
}

// Export for tests that need to reference the layout
TestUtil.DEFAULT_2P_SYSTEMS = DEFAULT_2P_SYSTEMS
TestUtil.DEFAULT_3P_SYSTEMS = DEFAULT_3P_SYSTEMS
TestUtil.DEFAULT_4P_SYSTEMS = DEFAULT_4P_SYSTEMS
TestUtil.DEFAULT_5P_SYSTEMS = DEFAULT_5P_SYSTEMS
TestUtil.DEFAULT_5P_HYPERLANE_SYSTEMS = DEFAULT_5P_HYPERLANE_SYSTEMS
TestUtil.DEFAULT_6P_SYSTEMS = DEFAULT_6P_SYSTEMS


/**
 * Replace non-home, non-mecatol systems with a deterministic layout.
 * Preserves hyperlane systems (used in 5-player hyperlane map).
 */
function _applyTestLayout(game, layout) {
  // Remove all non-home, non-mecatol, non-hyperlane systems
  for (const systemId of Object.keys(game.state.systems)) {
    if (game.state.systems[systemId]?.isHyperlane) {
      continue
    }
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
 * Return the sub-choices for a nested selector (e.g. 'Component Action' or 'Strategic Action').
 */
TestUtil.currentSubChoices = function(game, parentTitle) {
  const choices = game.waiting.selectors[0].choices
  const parent = choices.find(c => typeof c === 'object' && c.title === parentTitle)
  if (!parent || !parent.choices) {
    return []
  }
  return parent.choices.map(c => typeof c === 'object' ? c.title : c)
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
 *   deterministicLayout - Use fixed galaxy layout (default: true)
 *
 * Returns a game instance ready for setBoard + run.
 */
TestUtil.fixture = function(options = {}) {
  const deterministicLayout = options.deterministicLayout !== false

  const defaultFactions = [
    'federation-of-sol',
    'emirates-of-hacan',
    'barony-of-letnev',
    'sardakk-norr',
    'mentak-coalition',
    'naalu-collective',
  ]

  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: options.numPlayers || 2,
    players: [
      { _id: 'dennis_id', name: 'dennis' },
      { _id: 'micah_id', name: 'micah' },
      { _id: 'scott_id', name: 'scott' },
      { _id: 'eliya_id', name: 'eliya' },
      { _id: 'rachel_id', name: 'rachel' },
      { _id: 'tyler_id', name: 'tyler' },
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

    // Auto-assign colors so tests skip the color picker
    const testColors = ['#73bbfa', '#f77278', '#fcfc6f', '#70fa73', '#7274f7', '#f772f7', '#d8f772', '#f77278']
    for (let i = 0; i < game.players.all().length; i++) {
      game.players.all()[i].color = testColors[i % testColors.length]
    }

    // Apply deterministic galaxy layout
    if (deterministicLayout) {
      const layoutKey = options.mapLayout || options.numPlayers
      const defaultLayouts = {
        2: DEFAULT_2P_SYSTEMS,
        3: DEFAULT_3P_SYSTEMS,
        4: DEFAULT_4P_SYSTEMS,
        5: DEFAULT_5P_SYSTEMS,
        '5-hyperlane': DEFAULT_5P_HYPERLANE_SYSTEMS,
        6: DEFAULT_6P_SYSTEMS,
      }
      const layout = defaultLayouts[layoutKey]
      if (layout) {
        _applyTestLayout(game, layout)
      }
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
    if (state.objectiveDeckI !== undefined) {
      game.state.objectiveDeckI = [...state.objectiveDeckI]
    }
    if (state.objectiveDeckII !== undefined) {
      game.state.objectiveDeckII = [...state.objectiveDeckII]
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
    if (state.relicDeck !== undefined) {
      game.state.relicDeck = [...state.relicDeck]
    }
    if (state.relicsGained !== undefined) {
      game.state.relicsGained = {}
      for (const [name, relics] of Object.entries(state.relicsGained)) {
        game.state.relicsGained[name] = [...relics]
      }
    }
    if (state.activeLaws !== undefined) {
      game.state.activeLaws = state.activeLaws.map(spec => {
        if (typeof spec === 'string') {
          const card = res.getAgendaCard(spec)
          return card ? { ...card, resolvedOutcome: 'For' } : { id: spec, resolvedOutcome: 'For' }
        }
        return spec
      })
    }

    // Exploration token state
    if (state.gammaWormholeTokens !== undefined) {
      game.state.gammaWormholeTokens = [...state.gammaWormholeTokens]
    }
    if (state.ionStormToken !== undefined) {
      game.state.ionStormToken = state.ionStormToken ? { ...state.ionStormToken } : null
    }
    if (state.wormholeNexusActive !== undefined) {
      game.state.wormholeNexusActive = state.wormholeNexusActive
    }
    if (state.persistentCards !== undefined) {
      game.state.persistentCards = {}
      for (const [name, cards] of Object.entries(state.persistentCards)) {
        game.state.persistentCards[name] = [...cards]
      }
    }
    if (state.miragePlanet !== undefined) {
      game.state.miragePlanet = state.miragePlanet
      // Initialize mirage planet state and unit storage
      if (state.miragePlanet) {
        const mirageSystemId = String(state.miragePlanet)
        if (!game.state.planets['mirage']) {
          game.state.planets['mirage'] = { controller: null, exhausted: false, attachments: [] }
        }
        if (game.state.units[mirageSystemId] && !game.state.units[mirageSystemId].planets['mirage']) {
          game.state.units[mirageSystemId].planets['mirage'] = []
        }
      }
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
    if (state.eliminatedPlayers !== undefined) {
      game.state.eliminatedPlayers = [...state.eliminatedPlayers]
    }
    if (state.capturedCommandTokens !== undefined) {
      for (const [playerName, tokens] of Object.entries(state.capturedCommandTokens)) {
        game.state.capturedCommandTokens[playerName] = [...tokens]
      }
    }

    // Override galaxy layout (before unit placement)
    if (state.systems) {
      _applyTestLayout(game, state.systems)
    }

    // Place command tokens on systems
    if (state.systemTokens) {
      for (const [systemId, playerNames] of Object.entries(state.systemTokens)) {
        if (game.state.systems[systemId]) {
          game.state.systems[systemId].commandTokens = [...playerNames]
        }
      }
    }

    // Auto-assign colors so tests skip the color picker
    const testColors = ['#73bbfa', '#f77278', '#fcfc6f', '#70fa73', '#7274f7', '#f772f7', '#d8f772', '#f77278']
    for (let i = 0; i < game.players.all().length; i++) {
      game.players.all()[i].color = testColors[i % testColors.length]
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
                card = new BaseCard(game, { ...tech, id: cardId })
                game.cards.register(card)
              }
              techCards.push(card)
            }
          }
          techZone.initializeCards(techCards)
        }
      }

      // Exhausted Technologies
      if (playerState.exhaustedTechs) {
        if (!game.state.exhaustedTechs) {
          game.state.exhaustedTechs = {}
        }
        game.state.exhaustedTechs[player.name] = [...playerState.exhaustedTechs]
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
