const t = require('../../../testutil_v2.js')

describe('Lazy Sowman', () => {
  test('onDeclineSow offers to place another person (even on occupied space)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lazy-sowman-a094'],
        grain: 1,
        food: 2,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: null, cropCount: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Done Sowing')   // decline sow → Lazy Sowman fires
    t.choose(game, 'Place another person')
    t.choose(game, 'Forest')        // can place on any space (e.g. Forest)
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['lazy-sowman-a094'],
        grain: 1,   // did not sow
        wood: 3,    // from Forest (bonus placement)
        food: 2,
        farmyard: { fields: [{ row: 0, col: 2 }] },  // empty field unchanged
      },
    })
  })

  test('onDeclineSow allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lazy-sowman-a094'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: null, cropCount: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Done Sowing')
    t.choose(game, 'Skip')
    t.choose(game, 'Clay Pit')  // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['lazy-sowman-a094'],
        grain: 1,
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
  })
})
