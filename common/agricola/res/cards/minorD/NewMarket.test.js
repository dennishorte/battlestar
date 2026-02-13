const t = require('../../../testutil_v2.js')

describe('New Market', () => {
  test('gives 1 food when using round action space in rounds 8-11', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['new-market-d055'],
        food: 100,
      },
      micah: { food: 100 },
    })
    game.run()

    // Round 8: take Vegetable Seeds (stage 3 round card → triggers NewMarket)
    t.choose(game, 'Vegetable Seeds')  // dennis: round card → +1 food from NewMarket
    t.choose(game, 'Forest')           // micah
    t.choose(game, 'Day Laborer')      // dennis: base action, no NewMarket
    t.choose(game, 'Clay Pit')         // micah

    t.testBoard(game, {
      dennis: {
        vegetables: 1,  // from Vegetable Seeds
        food: 103,      // 100 + 1 (NewMarket) + 2 (Day Laborer)
        minorImprovements: ['new-market-d055'],
      },
    })
  })
})
