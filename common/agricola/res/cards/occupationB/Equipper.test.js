const t = require('../../../testutil_v2.js')

describe('Equipper', () => {
  // Card text: "Immediately after each time you use a wood accumulation
  // space, you can play a minor improvement."
  // Card is 1+ players.

  test('Forest triggers minor improvement offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // buyMinorImprovement presents card names directly
    t.choose(game, 'Test Minor 1')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })

  test('Forest minor improvement offer can be skipped', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Do not play a minor improvement')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        hand: ['test-minor-1'],
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('does not trigger on non-wood accumulation spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')
    // No minor improvement offer

    t.testBoard(game, {
      dennis: {
        clay: 1,
        hand: ['test-minor-1'],
        occupations: ['equipper-b131', 'test-occupation-1', 'test-occupation-2'],
      },
    })
  })
})
