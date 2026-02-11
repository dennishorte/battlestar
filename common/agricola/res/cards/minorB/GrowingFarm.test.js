const t = require('../../../testutil_v2.js')

describe('Growing Farm', () => {
  test('gives food equal to current round when played', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['growing-farm-b052'],
        clay: 2, reed: 1, // card cost
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    // Round 1: play Growing Farm → get 1 food (food = round number)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Growing Farm')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Growing Farm (round 1)
        wood: 3, // from Forest
        minorImprovements: ['growing-farm-b052'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
      },
    })
  })
})
