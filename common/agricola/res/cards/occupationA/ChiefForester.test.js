const t = require('../../../testutil_v2.js')

describe('Chief Forester', () => {
  test('onAction offers sow action when using Forest (take-wood)', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }], // One empty field
        },
      },
    })
    game.run()

    // Take Forest action
    t.choose(game, 'Forest')
    // Chief Forester should offer sow action - use t.action to respond
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        wood: 3, // 3 from Forest accumulation
        grain: 0, // Used 1 grain to sow
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }], // 1 grain + 2 bonus
        },
      },
    })
  })

  test('onAction does not offer sow action for non-wood actions', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    // Take Day Laborer action (not a wood accumulation space)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        grain: 1, // Grain not used (no sow action offered)
        food: 2, // 2 food from Day Laborer
        farmyard: {
          fields: [{ row: 0, col: 2 }], // Field still empty
        },
      },
    })
  })

  test('onAction does not offer sow action if no empty fields', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        farmyard: {
          fields: [], // No fields
        },
      },
    })
    game.run()

    // Take Forest action
    t.choose(game, 'Forest')
    // No sow action should be offered (no empty fields)

    t.testBoard(game, {
      dennis: {
        occupations: ['chief-forester-a115'],
        wood: 3, // 3 from Forest accumulation
      },
    })
  })
})
