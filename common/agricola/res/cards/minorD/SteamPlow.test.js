const t = require('../../../testutil_v2.js')

describe('Steam Plow', () => {
  test('pay 2 wood and 1 food to plow after returning home', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['steam-plow-d018'],
        wood: 3,
        food: 2,
      },
    })
    game.run()

    // Play round 2 actions (4 total: 2 per player)
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 4
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Return home phase → Steam Plow triggers
    t.choose(game, 'Pay 2 wood and 1 food to plow 1 field')
    t.choose(game, '2,0')  // plow location

    t.testBoard(game, {
      dennis: {
        wood: 1,    // 3 - 2 = 1
        food: 3,    // 2 + 2 (DL) - 1 (Steam Plow) = 3
        grain: 1,   // Grain Seeds
        minorImprovements: ['steam-plow-d018'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
