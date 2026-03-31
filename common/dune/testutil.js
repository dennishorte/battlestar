const TestCommon = require('../lib/test_common.js')
const { DuneFactory } = require('./dune.js')

const TestUtil = { ...TestCommon }
module.exports = TestUtil


TestUtil.fixture = function(options = {}) {
  const players = options.players || [
    { _id: 'dennis_id', name: 'dennis' },
    { _id: 'micah_id', name: 'micah' },
    { _id: 'scott_id', name: 'scott' },
    { _id: 'eliya_id', name: 'eliya' },
  ]

  const numPlayers = options.numPlayers || 2
  const activePlayers = players.slice(0, numPlayers)

  const game = DuneFactory({
    game: 'Dune Imperium: Uprising',
    name: options.name || 'test_game',
    seed: options.seed || 'test_seed',
    players: activePlayers,
    numPlayers,
    shuffleSeats: false,
    useCHOAM: options.useCHOAM || false,
    useRiseOfIx: options.useRiseOfIx || false,
    useImmortality: options.useImmortality || false,
    useBloodlines: options.useBloodlines || false,
    ...options,
  }, options.viewer || 'dennis')

  // Pre-assign colors so chooseColor is a no-op in tests
  const defaultColors = ['#d42e35', '#73bbfa', '#2ebd32', '#e8811c']
  game.testSetBreakpoint('initialization-complete', (game) => {
    game.players.all().forEach((p, i) => {
      if (!p.color) {
        p.color = defaultColors[i]
      }
    })
  })

  return game
}


TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    // Game-level state
    if (state.round !== undefined) {
      game.state.round = state.round
    }
    if (state.phase !== undefined) {
      game.state.phase = state.phase
    }
    if (state.shieldWall !== undefined) {
      game.state.shieldWall = state.shieldWall
    }
    if (state.firstPlayerIndex !== undefined) {
      game.state.firstPlayerIndex = state.firstPlayerIndex
    }

    if (state.controlMarkers) {
      Object.assign(game.state.controlMarkers, state.controlMarkers)
    }

    if (state.alliances) {
      Object.assign(game.state.alliances, state.alliances)
    }

    if (state.bonusSpice) {
      Object.assign(game.state.bonusSpice, state.bonusSpice)
    }

    if (state.spyPosts) {
      for (const [postId, players] of Object.entries(state.spyPosts)) {
        game.state.spyPosts[postId] = [...players]
      }
    }

    if (state.boardSpaces) {
      Object.assign(game.state.boardSpaces, state.boardSpaces)
    }

    if (state.makerHooks) {
      Object.assign(game.state.makerHooks, state.makerHooks)
    }

    // Conflict state
    if (state.conflict) {
      const c = state.conflict
      if (c.deployedTroops) {
        Object.assign(game.state.conflict.deployedTroops, c.deployedTroops)
      }
      if (c.deployedSandworms) {
        Object.assign(game.state.conflict.deployedSandworms, c.deployedSandworms)
      }
      if (c.wonCards) {
        game.state.conflict.wonCards = c.wonCards
      }
    }

    // Objectives (per-player)
    if (state.objectives) {
      Object.assign(game.state.objectives, state.objectives)
    }

    // Leaders (per-player)
    if (state.leaders) {
      Object.assign(game.state.leaders, state.leaders)
    }

    // Conflict card: put a card matching the filter on top of the conflict deck
    if (state.conflictCard) {
      const deck = game.zones.byId('common.conflictDeck')
      const cards = deck.cardlist()
      const filter = state.conflictCard
      const card = cards.find(c => {
        if (typeof filter === 'string') {
          return c.name === filter
        }
        if (filter.location) {
          return c.definition?.location === filter.location
        }
        if (filter.tier) {
          return c.definition?.tier === filter.tier
        }
        return false
      })
      if (card) {
        card.moveTo(deck, 0)
      }
    }

    // Per-player state
    for (const playerName of ['dennis', 'micah', 'scott', 'eliya']) {
      if (state[playerName]) {
        applyPlayerState(game, playerName, state[playerName])
      }
    }
  })
}


function applyPlayerState(game, name, state) {
  const player = game.players.byName(name)
  if (!player) {
    return
  }

  // Resources
  const resources = ['solari', 'spice', 'water', 'vp']
  for (const resource of resources) {
    if (state[resource] !== undefined) {
      player.setCounter(resource, state[resource], { silent: true })
    }
  }

  // Agents
  if (state.agents !== undefined) {
    player.setCounter('agents', state.agents, { silent: true })
  }
  if (state.hasSwordmaster !== undefined) {
    player.setCounter('hasSwordmaster', state.hasSwordmaster ? 1 : 0, { silent: true })
  }

  // Troops
  if (state.troopsInGarrison !== undefined) {
    player.setCounter('troopsInGarrison', state.troopsInGarrison, { silent: true })
  }
  if (state.troopsInSupply !== undefined) {
    player.setCounter('troopsInSupply', state.troopsInSupply, { silent: true })
  }

  // Spies
  if (state.spiesInSupply !== undefined) {
    player.setCounter('spiesInSupply', state.spiesInSupply, { silent: true })
  }

  // Faction influence
  if (state.influence) {
    for (const [faction, value] of Object.entries(state.influence)) {
      player.setCounter(`influence_${faction}`, value, { silent: true })
    }
  }

  // High Council
  if (state.hasHighCouncil !== undefined) {
    player.setCounter('hasHighCouncil', state.hasHighCouncil ? 1 : 0, { silent: true })
  }

  // Intrigue cards: move named cards from intrigue deck to player's intrigue zone
  if (state.intrigue) {
    const intrigueDeck = game.zones.byId('common.intrigueDeck')
    const playerIntrigue = game.zones.byId(`${name}.intrigue`)
    for (const cardName of state.intrigue) {
      const card = intrigueDeck.cardlist().find(c => c.name === cardName)
      if (card) {
        card.moveTo(playerIntrigue)
      }
    }
  }

  // Contracts: move named cards from contract deck/market to player's contracts zone
  if (state.contracts) {
    const contractDeck = game.zones.byId('common.contractDeck')
    const contractMarket = game.zones.byId('common.contractMarket')
    const playerContracts = game.zones.byId(`${name}.contracts`)
    for (const cardName of state.contracts) {
      const allContracts = [...contractMarket.cardlist(), ...contractDeck.cardlist()]
      const card = allContracts.find(c => c.name === cardName)
      if (card) {
        card.moveTo(playerContracts)
      }
    }
  }
}


TestUtil.testBoard = function(game, expected) {
  const errors = []

  // Game-level assertions
  if (expected.round !== undefined) {
    assertEq(errors, 'round', game.state.round, expected.round)
  }
  if (expected.phase !== undefined) {
    assertEq(errors, 'phase', game.state.phase, expected.phase)
  }
  if (expected.shieldWall !== undefined) {
    assertEq(errors, 'shieldWall', game.state.shieldWall, expected.shieldWall)
  }

  if (expected.controlMarkers) {
    for (const [loc, owner] of Object.entries(expected.controlMarkers)) {
      assertEq(errors, `controlMarkers.${loc}`, game.state.controlMarkers[loc], owner)
    }
  }

  // Conflict state assertions
  if (expected.conflict) {
    const c = expected.conflict
    if (c.deployedTroops) {
      for (const [name, count] of Object.entries(c.deployedTroops)) {
        assertEq(errors, `conflict.deployedTroops.${name}`, game.state.conflict.deployedTroops[name] || 0, count)
      }
    }
    if (c.deployedSandworms) {
      for (const [name, count] of Object.entries(c.deployedSandworms)) {
        assertEq(errors, `conflict.deployedSandworms.${name}`, game.state.conflict.deployedSandworms[name] || 0, count)
      }
    }
  }

  // Per-player assertions
  for (const playerName of ['dennis', 'micah', 'scott', 'eliya']) {
    if (!expected[playerName]) {
      continue
    }

    const player = game.players.byName(playerName)
    const exp = expected[playerName]

    // Resources
    for (const resource of ['solari', 'spice', 'water', 'vp']) {
      if (exp[resource] !== undefined) {
        assertEq(errors, `${playerName}.${resource}`, player.getCounter(resource), exp[resource])
      }
    }

    // Troops
    if (exp.troopsInGarrison !== undefined) {
      assertEq(errors, `${playerName}.troopsInGarrison`, player.troopsInGarrison, exp.troopsInGarrison)
    }
    if (exp.troopsInSupply !== undefined) {
      assertEq(errors, `${playerName}.troopsInSupply`, player.troopsInSupply, exp.troopsInSupply)
    }

    // Spies
    if (exp.spiesInSupply !== undefined) {
      assertEq(errors, `${playerName}.spiesInSupply`, player.spiesInSupply, exp.spiesInSupply)
    }

    // Faction influence
    if (exp.influence) {
      for (const [faction, value] of Object.entries(exp.influence)) {
        assertEq(errors, `${playerName}.influence.${faction}`, player.getInfluence(faction), value)
      }
    }

    // Agents
    if (exp.availableAgents !== undefined) {
      assertEq(errors, `${playerName}.availableAgents`, player.availableAgents, exp.availableAgents)
    }
  }

  if (errors.length > 0) {
    throw new Error('testBoard failures:\n' + errors.join('\n'))
  }
}


function assertEq(errors, label, actual, expected) {
  if (actual !== expected) {
    errors.push(`  ${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}


TestUtil.currentChoices = function(game) {
  if (!game.waiting) {
    return []
  }
  const selector = game.waiting.selectors[0]
  if (!selector || !selector.choices) {
    return []
  }
  return selector.choices.map(c => typeof c === 'object' ? c.title : String(c))
}
