const t = require('../../../testutil_v2.js')

describe('Market Stall', () => {
  test('gives 1 vegetable when played (grain → vegetable exchange)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['market-stall-b008'],
        grain: 1, // card cost
      },
    })
    game.run()

    // Play Market Stall via Meeting Place → pays 1 grain, gets 1 vegetable
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Market Stall')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    // Market Stall has passLeft, so it moves to Micah after being played
    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        grain: 0, // paid 1 for card cost
        vegetables: 1, // from Market Stall onPlay
        wood: 3, // from Forest
      },
    })
  })
})
