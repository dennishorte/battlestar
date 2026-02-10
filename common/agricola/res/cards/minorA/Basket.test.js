const t = require('../../../testutil_v2.js')

describe('Basket', () => {
  test('offers wood for food exchange on Forest action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['basket-a056'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Exchange 2 wood for 3 food')

    t.testBoard(game, {
      dennis: {
        wood: 1,  // 3 from Forest - 2 exchanged
        food: 3,  // 3 from exchange
        minorImprovements: ['basket-a056'],
      },
    })
  })

  test('can skip the exchange', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['basket-a056'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3,  // 3 from Forest, kept
        minorImprovements: ['basket-a056'],
      },
    })
  })

  test('does not trigger on non-wood actions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['basket-a056'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // 2 from Day Laborer
        minorImprovements: ['basket-a056'],
      },
    })
  })
})
