const t = require('../../../testutil_v2.js')

describe('Bargain Hunter', () => {
  test('places 1 food on Traveling Players and plays a minor improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bargain-hunter-e152'],
        food: 3,
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // Round 2 starts — onRoundStart fires for dennis
    // BargainHunter: place 1 food and play minor
    t.choose(game, 'Place 1 food and play minor')
    // buyMinorImprovement: choose a minor from hand (plain name, no ID)
    t.choose(game, 'Test Minor 1')

    t.testBoard(game, {
      dennis: {
        food: 2,  // 3 - 1 (placed on TP)
        occupations: ['bargain-hunter-e152'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })

  test('can skip the bargain hunter offer', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bargain-hunter-e152'],
        food: 3,
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // Skip BargainHunter
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3,  // unchanged
        hand: ['test-minor-1'],
        occupations: ['bargain-hunter-e152'],
      },
    })
  })

  test('does not trigger without food', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bargain-hunter-e152'],
        food: 0,
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // No food — BargainHunter does not fire, straight to action choice
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,  // 0 + 2 (DL)
        hand: ['test-minor-1'],
        occupations: ['bargain-hunter-e152'],
      },
    })
  })
})
