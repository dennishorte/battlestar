const t = require('../../../testutil_v2.js')

describe('Value Assets', () => {
  test('buy wood after harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['value-assets-b082'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // After harvest (feeding costs 4), ValueAssets offers to buy resource
    t.choose(game, 'Buy 1 wood for 1 food')

    t.testBoard(game, {
      dennis: {
        food: 7, // 10 + 2(DL) - 4(feed) - 1(buy wood) = 7
        wood: 1, // bought
        grain: 1, // from Seeds
        minorImprovements: ['value-assets-b082'],
      },
    })
  })

  test('buy stone after harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['value-assets-b082'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Buy 1 stone for 2 food')

    t.testBoard(game, {
      dennis: {
        food: 6, // 10 + 2(DL) - 4(feed) - 2(buy stone) = 6
        stone: 1,
        grain: 1,
        minorImprovements: ['value-assets-b082'],
      },
    })
  })
})
