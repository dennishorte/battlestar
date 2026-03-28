const t = require('../testutil')

// Helper: choose Reveal Turn, then pass on all acquire prompts
function revealAndPass(game) {
  t.choose(game, 'Reveal Turn')
  // Keep passing on acquire prompts until the game moves on
  while (game.waiting) {
    const title = game.waiting.selectors[0]?.title || ''
    if (title.includes('Acquire')) {
      t.choose(game, 'Pass')
    }
    else {
      break
    }
  }
}

describe('Dune Imperium: Uprising - Basic', () => {

  test('game creates without error', () => {
    const game = t.fixture()
    expect(game).toBeTruthy()
    expect(game.settings.game).toBe('Dune Imperium: Uprising')
  })

  test('game initializes and requests first input', () => {
    const game = t.fixture()
    game.run()
    expect(game.waiting).toBeTruthy()
  })

  test('2-player game has correct starting state', () => {
    const game = t.fixture({ numPlayers: 2 })
    game.run()

    t.testBoard(game, {
      round: 1,
      dennis: {
        water: 1,
        solari: 0,
        spice: 0,
        vp: 0,
        troopsInGarrison: 3,
        troopsInSupply: 9,
        spiesInSupply: 3,
        availableAgents: 2,
      },
      micah: {
        water: 1,
        solari: 0,
        spice: 0,
        vp: 0,
      },
    })
  })

  test('4-player game starts with 1 VP each', () => {
    const game = t.fixture({ numPlayers: 4 })
    game.run()

    t.testBoard(game, {
      dennis: { vp: 1 },
      micah: { vp: 1 },
      scott: { vp: 1 },
      eliya: { vp: 1 },
    })
  })

  test('setBoard can override player resources', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 5, spice: 3, water: 2 },
    })
    game.run()

    t.testBoard(game, {
      dennis: { solari: 5, spice: 3, water: 2 },
    })
  })

  test('setBoard can override game state', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
    })
    game.run()

    t.testBoard(game, {
      shieldWall: false,
    })
  })

  test('first input request is for first player', () => {
    const game = t.fixture()
    game.run()

    const selector = game.waiting.selectors[0]
    expect(selector.actor).toBe('dennis')
  })

  test('player turn choices include Agent Turn and Reveal Turn', () => {
    const game = t.fixture()
    game.run()

    const choices = t.currentChoices(game)
    expect(choices).toContain('Agent Turn')
    expect(choices).toContain('Reveal Turn')
  })

  test('both players can reveal to complete player turns phase', () => {
    const game = t.fixture()
    game.run()

    // Both players reveal and pass on acquiring
    revealAndPass(game) // dennis
    revealAndPass(game) // micah

    // Should now be in round 2
    t.testBoard(game, { round: 2 })
  })

  test('players start with 10-card decks and draw 5', () => {
    const game = t.fixture()
    game.run()

    // After round start, each player should have drawn 5 cards
    const dennisHand = game.zones.byId('dennis.hand')
    const micahHand = game.zones.byId('micah.hand')
    expect(dennisHand.cardlist().length).toBe(5)
    expect(micahHand.cardlist().length).toBe(5)
  })

})
