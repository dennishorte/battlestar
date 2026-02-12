const t = require('../../../testutil_v2.js')

describe('Beer Table', () => {
  test('pay 1 grain for 2 bonus points at field phase end', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-table-c029'],
        grain: 1,
        food: 4,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 6
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain → 2
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase → Beer Table triggers at field phase end
    t.choose(game, 'Pay 1 grain for 2 bonus points (others get 1 food)')

    // food: 4 + 2 (DL) = 6 - 4 (feed) = 2
    // grain: 1 + 1 (Grain Seeds) - 1 (Beer Table) = 1
    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,
        bonusPoints: 2,
        minorImprovements: ['beer-table-c029'],
      },
    })
  })
})
