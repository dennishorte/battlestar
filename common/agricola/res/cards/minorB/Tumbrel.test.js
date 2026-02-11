const t = require('../../../testutil_v2.js')

describe('Tumbrel', () => {
  test('gives 2 food on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['tumbrel-b054'],
        wood: 1, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Tumbrel')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Meeting Place + 2 from Tumbrel
        minorImprovements: ['tumbrel-b054'],
      },
    })
  })

  test('gives food equal to stable count after sowing', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['tumbrel-b054'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
          stables: [{ row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        food: 2, // 2 stables
        minorImprovements: ['tumbrel-b054'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
          stables: [{ row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('gives no food after sowing with no stables', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['tumbrel-b054'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        food: 0,
        minorImprovements: ['tumbrel-b054'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
