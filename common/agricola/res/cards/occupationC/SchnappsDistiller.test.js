const t = require('../../../testutil_v2.js')

describe('Schnapps Distiller', () => {
  // Card text: "In the feeding phase of each harvest, you can turn exactly
  // 1 vegetable into 5 food."

  test('converts 1 vegetable to 5 food during feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['schnapps-distiller-c109'],
        vegetables: 1,
        food: 0,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Harvest → feeding → onFeedingPhase: Schnapps Distiller
    t.choose(game, 'Convert 1 vegetable to 5 food')

    // Auto-feed: 2 (DL) + 5 (SD) = 7 food, pay 4 → 3

    t.testBoard(game, {
      dennis: {
        occupations: ['schnapps-distiller-c109'],
        vegetables: 0,
        food: 3,
        grain: 1,
      },
    })
  })
})
