const t = require('../../../testutil_v2.js')

describe('Schnapps Distillery', () => {
  test('convert 1 vegetable into 5 food during feeding phase', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['schnapps-distillery-c059'],
        vegetables: 1,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: feeding phase → Schnapps Distillery offers
    t.choose(game, 'Convert 1 vegetable into 5 food')

    // food: 0 + 2 (DL) + 5 (SD) = 7 - 4 (feed) = 3
    // vegetables: 1 - 1 (SD) = 0
    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 1,  // from Grain Seeds
        minorImprovements: ['schnapps-distillery-c059'],
      },
    })
  })

  test('scores bonus points for 5th and 6th vegetable', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['schnapps-distillery-c059'],
        vegetables: 6,
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -5, // +4 (veg) +6 (family) +2 (card vps) +2 (endgame bonus) -6 (missing grain/fields/pastures/sheep/boar/cattle) -13 (empty spaces)
        vegetables: 6,
        minorImprovements: ['schnapps-distillery-c059'],
      },
    })
  })
})
