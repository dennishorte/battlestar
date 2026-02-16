const t = require('../../../testutil_v2.js')

describe('Acquirer', () => {
  test('pays food equal to family size to buy 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['acquirer-e102'],
        food: 5,
      },
    })
    game.run()

    // Round 2 starts — Acquirer fires (2 family members = 2 food cost)
    t.choose(game, '1 wood')

    t.testBoard(game, {
      dennis: {
        food: 3, // 5 - 2 (cost)
        wood: 1,
        occupations: ['acquirer-e102'],
      },
    })
  })

  test('can buy 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['acquirer-e102'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, '1 stone')

    t.testBoard(game, {
      dennis: {
        food: 1, // 3 - 2
        stone: 1,
        occupations: ['acquirer-e102'],
      },
    })
  })

  test('can buy 1 grain', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['acquirer-e102'],
        food: 4,
      },
    })
    game.run()

    t.choose(game, '1 grain')

    t.testBoard(game, {
      dennis: {
        food: 2, // 4 - 2
        grain: 1,
        occupations: ['acquirer-e102'],
      },
    })
  })

  test('can skip the purchase', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['acquirer-e102'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 5, // unchanged
        occupations: ['acquirer-e102'],
      },
    })
  })

  test('does not trigger when food < family size', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['acquirer-e102'],
        food: 1, // less than 2 (family size)
      },
    })
    game.run()

    // No Acquirer prompt — not enough food
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3, // 1 + 2 (Day Laborer)
        occupations: ['acquirer-e102'],
      },
    })
  })
})
