const t = require('../../../testutil_v2.js')

describe('Seed Seller', () => {
  test('gives 1 grain on play', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['seed-seller-d141'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Seed Seller')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['seed-seller-d141'],
      },
    })
  })

  test('gives 1 additional grain when using Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-seller-d141'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 2,
        occupations: ['seed-seller-d141'],
      },
    })
  })
})
