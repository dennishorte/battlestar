const t = require('../../../testutil_v2.js')

describe('Hardware Store', () => {
  test('pay 2 food after Day Laborer for building materials', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hardware-store-c082'],
      },
    })
    game.run()

    // Dennis uses Day Laborer (gets 2 food) → Hardware Store triggers
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Pay 2 food for 1 wood, 1 clay, 1 reed, and 1 stone')

    t.testBoard(game, {
      dennis: {
        food: 0,  // 0 + 2 (Day Laborer) - 2 (Hardware Store) = 0
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        minorImprovements: ['hardware-store-c082'],
      },
    })
  })

  test('can skip the offer', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hardware-store-c082'],
      },
    })
    game.run()

    // Dennis uses Day Laborer → Skip Hardware Store
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 2,  // 0 + 2 (Day Laborer), no Hardware Store payment
        minorImprovements: ['hardware-store-c082'],
      },
    })
  })
})
