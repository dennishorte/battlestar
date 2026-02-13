const t = require('../../../testutil_v2.js')

describe('Social Benefits', () => {
  test('gives 1 wood and 1 clay when food is 0 after feeding', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['social-benefits-d076'],
        food: 1,   // 1 + 2(DL) + 1(Fish) = 4, exactly feeds 2 workers → 0 left
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions (4 total: 2 workers each)
    t.choose(game, 'Day Laborer')   // dennis (+2 food)
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis (+1 food)
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: dennis has 1 + 2 + 1 = 4 food, feeds 2 workers (4) → 0 food
    // Social Benefits fires: +1 wood, +1 clay

    t.testBoard(game, {
      dennis: {
        food: 0,
        wood: 1,
        clay: 1,
        minorImprovements: ['social-benefits-d076'],
      },
    })
  })

  test('does not fire when food remains after feeding', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['social-benefits-d076'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // dennis has 10 + 2 + 1 = 13 food, feeds 4 → 9 left
    // Social Benefits does NOT fire (food > 0)

    t.testBoard(game, {
      dennis: {
        food: 9,
        wood: 0,
        clay: 0,
        minorImprovements: ['social-benefits-d076'],
      },
    })
  })
})
