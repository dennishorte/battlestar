const t = require('../../../testutil_v2.js')

describe('New Purchase', () => {
  test('buy grain before harvest round', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['new-purchase-b070'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // NewPurchase triggers at round start — offer to buy crops
    t.choose(game, 'Buy 1 grain for 2 food')
    t.choose(game, 'Skip') // don't also buy vegetable

    // 4 actions in round 4
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Feeding: -4 food

    t.testBoard(game, {
      dennis: {
        food: 6, // 10 - 2(buy grain) + 2(DL) - 4(feed) = 6
        grain: 2, // 1(bought) + 1(Seeds)
        minorImprovements: ['new-purchase-b070'],
      },
    })
  })

  test('buy both grain and vegetable', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['new-purchase-b070'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Buy grain first, then also buy vegetable
    t.choose(game, 'Buy 1 grain for 2 food')
    t.choose(game, 'Buy 1 vegetable for 4 food')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 10 - 2(grain) - 4(veg) + 2(DL) - 4(feed) = 2
        grain: 2, // 1(bought) + 1(Seeds)
        vegetables: 1, // bought
        minorImprovements: ['new-purchase-b070'],
      },
    })
  })
})
