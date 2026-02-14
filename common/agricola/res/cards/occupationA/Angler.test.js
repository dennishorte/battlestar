const t = require('../../../testutil_v2.js')

describe('Angler', () => {
  test('onAction triggers when Fishing has 1 food (no improvements to play)', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['angler-a095'],
        food: 0,
      },
    })
    game.run()

    // Take Fishing action — 1 food <= 2, so Angler triggers
    // But no improvements are available, so buyImprovement returns immediately
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['angler-a095'],
        food: 1,
      },
    })
  })

  test('onAction does not trigger when Fishing has > 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 3 }],
      dennis: {
        occupations: ['angler-a095'],
        food: 0,
      },
    })
    game.run()

    // Take Fishing action — 3 food > 2, so Angler does NOT trigger
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['angler-a095'],
        food: 3,
      },
    })
  })

  test('onAction allows playing a minor improvement when Fishing has 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      dennis: {
        occupations: ['angler-a095'],
        hand: ['test-minor-1'],
        food: 0,
      },
    })
    game.run()

    // Take Fishing action — 2 food <= 2, so Angler triggers
    t.choose(game, 'Fishing')
    // Play the minor improvement (test minors have no cost)
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      dennis: {
        occupations: ['angler-a095'],
        minorImprovements: ['test-minor-1'],
        food: 2,
      },
    })
  })
})
