const t = require('../../../testutil_v2.js')

describe('Bonehead', () => {
  test('onPlay places 6 wood on card and gives 2 wood (1 from onPlay + 1 from onPlayOccupation)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bonehead-d118'],
      },
    })
    game.run()

    // Play Bonehead via Lessons A
    // onPlay: sets 6 wood, gives 1 -> card has 5, player has 1
    // onPlayOccupation fires on all active cards (Bonehead is now active): gives 1 more -> card has 4, player has 2
    t.choose(game, 'Lessons A')
    t.choose(game, 'Bonehead')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        occupations: ['bonehead-d118'],
      },
    })

    // Verify card state
    expect(game.cardState('bonehead-d118').wood).toBe(4)
  })

  test('playing another occupation gives 1 more wood from card', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bonehead-d118'],
        hand: ['test-occupation-1'],
        food: 1, // to pay for 2nd occupation
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('bonehead-d118').wood = 5
    })
    game.run()

    // Play another occupation -> onPlayOccupation fires on Bonehead -> 1 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        occupations: ['bonehead-d118', 'test-occupation-1'],
      },
    })

    expect(game.cardState('bonehead-d118').wood).toBe(4)
  })

  test('building a minor improvement gives 1 wood from card', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bonehead-d118', 'test-occupation-1'],
        hand: ['test-minor-1'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('bonehead-d118').wood = 3
    })
    game.run()

    // Play minor improvement via Meeting Place -> onBuildImprovement fires -> 1 wood
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        food: 1, // from Meeting Place
        occupations: ['bonehead-d118', 'test-occupation-1'],
        minorImprovements: ['test-minor-1'],
      },
    })

    expect(game.cardState('bonehead-d118').wood).toBe(2)
  })

  test('no wood when card is depleted', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bonehead-d118'],
        hand: ['test-occupation-1'],
        food: 1,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('bonehead-d118').wood = 0
    })
    game.run()

    // Play occupation -> onPlayOccupation fires but card has 0 wood -> no bonus
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        occupations: ['bonehead-d118', 'test-occupation-1'],
      },
    })

    expect(game.cardState('bonehead-d118').wood).toBe(0)
  })
})
