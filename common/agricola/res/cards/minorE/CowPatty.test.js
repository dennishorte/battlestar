const t = require('../../../testutil_v2.js')

describe('Cow Patty', () => {
  test('+1 crop when sowing on field adjacent to pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cow-patty-e071'],
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 2 }],
          pastures: [
            { spaces: [{ row: 2, col: 3 }], cattle: 1 },
          ],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        grain: 1,
        animals: { cattle: 1 },
        minorImprovements: ['cow-patty-e071'],
        farmyard: {
          fields: [{ row: 2, col: 2, crop: 'grain', cropCount: 4 }],
          pastures: [{ spaces: [{ row: 2, col: 3 }], cattle: 1 }],
        },
      },
    })
  })

  test('normal sow amount on field not adjacent to pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cow-patty-e071'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 2, col: 3 }], cattle: 1 },
          ],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        grain: 1,
        animals: { cattle: 1 },
        minorImprovements: ['cow-patty-e071'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
          pastures: [{ spaces: [{ row: 2, col: 3 }], cattle: 1 }],
        },
      },
    })
  })
})
