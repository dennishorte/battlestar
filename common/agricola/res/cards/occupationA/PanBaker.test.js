const t = require('../../../testutil_v2.js')

describe('Pan Baker', () => {
  test('onAction grants 2 clay and 1 wood when using Grain Utilization', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'], // Auto-sets to round 1
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 0,
        wood: 0,
      },
    })
    game.run()

    // Take Grain Utilization action
    t.choose(game, 'Grain Utilization')
    // Skip sowing (no empty fields)
    // Skip baking (no grain)

    t.testBoard(game, {
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 2, // 2 from Pan Baker
        wood: 1, // 1 from Pan Baker
      },
    })
  })

  test('onAction does not grant resources for other actions', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 0,
        wood: 0,
      },
    })
    game.run()

    // Take Day Laborer action (not Grain Utilization)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 0, // No clay from Pan Baker
        wood: 0, // No wood from Pan Baker
        food: 2, // 2 food from Day Laborer
      },
    })
  })

  test('onAction grants resources even when skipping sowing and baking', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 0,
        wood: 0,
        farmyard: {
          fields: [], // No fields to sow
        },
      },
    })
    game.run()

    // Take Grain Utilization - no fields to sow, no grain to bake
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        occupations: ['pan-baker-a122'],
        clay: 2, // Still gets resources from Pan Baker
        wood: 1,
      },
    })
  })
})
