const t = require('../../../testutil_v2.js')

describe('Pipe Smoker', () => {
  test('gives 2 wood at harvest start when player has a grain field', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pipe-smoker-e117'],
        food: 8,
        wood: 0,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest fires: onHarvestStart gives 2 wood, field harvests 1 grain
    t.testBoard(game, {
      round: 5,
      dennis: {
        wood: 2,
        food: 6, // 8 + 2 day laborer - 4 feeding
        clay: 1, // from Clay Pit
        grain: 1, // from field harvest
        occupations: ['pipe-smoker-e117'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
