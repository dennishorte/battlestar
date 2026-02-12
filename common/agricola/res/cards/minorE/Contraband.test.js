const t = require('../../../testutil_v2.js')

describe('Contraband', () => {
  test('pay 1 extra building resource for 3 food when building improvement', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['iron-hoe-e020'],  // costs { wood: 1 }
        minorImprovements: ['contraband-e054'],
        wood: 2,
      },
    })
    game.run()

    // Dennis plays Iron Hoe (costs 1 wood) via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Iron Hoe')
    // Contraband triggers — Iron Hoe cost has wood, pay 1 extra for 3 food
    t.choose(game, 'Pay 1 wood for 3 food')

    t.testBoard(game, {
      dennis: {
        food: 1 + 3,  // 1 (Meeting Place) + 3 (Contraband)
        wood: 0,       // 2 - 1 (Iron Hoe cost) - 1 (Contraband) = 0
        minorImprovements: ['contraband-e054', 'iron-hoe-e020'],
      },
    })
  })
})
