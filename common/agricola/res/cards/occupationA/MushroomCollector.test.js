const t = require('../../../testutil_v2.js')

describe('Mushroom Collector', () => {
  test('onAction offers wood for food exchange after Forest action', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Forest'],
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 1, // Need at least 1 wood to exchange
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // After taking wood, Mushroom Collector should offer exchange
    t.choose(game, 'Exchange 1 wood for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 3, // Started with 1, took 3 from Forest = 4, exchanged 1 = 3 (exchanged wood goes back on space)
        food: 2, // 0 + 2 from exchange
      },
    })
  })

  test('can skip the exchange', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Forest'],
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 1,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 4, // 3 from Forest + 1 already had
        food: 0,
      },
    })
  })

  test('does not trigger if player has no wood', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Forest'],
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')

    // Should not offer exchange (no wood to exchange)
    t.testBoard(game, {
      dennis: {
        occupations: ['mushroom-collector-a108'],
        wood: 3, // 3 from Forest
        food: 0,
      },
    })
  })
})
