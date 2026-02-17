const t = require('../../../testutil_v2.js')

describe('Agrarian Fences', () => {
  test('builds fences instead of sowing on Grain Utilization', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['agrarian-fences-b026'],
        grain: 1,
        wood: 4,
        farmyard: {
          fields: [{ row: 2, col: 2 }], // empty field → canSow = true
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // canSow = true, canBake = false → choices: 'Sow and/or Bake Bread', 'Build Fences instead of Sowing'
    t.choose(game, 'Build Fences instead of Sowing')

    // Build a 1-space pasture (4 fences, 4 wood)
    // After building, 0 wood → buildFences auto-exits
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        wood: 0, // 4 - 4 = 0
        grain: 1, // didn't sow
        minorImprovements: ['agrarian-fences-b026'],
        farmyard: {
          fields: [{ row: 2, col: 2 }],
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('builds fences instead of baking, then sows', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['agrarian-fences-b026'],
        grain: 1,
        wood: 4,
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 2, col: 2 }], // empty field → canSow = true
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // canSow = true, canBake = true → all 3 choices available
    t.choose(game, 'Build Fences instead of Baking')

    // Sow grain into field (only 1 field, auto-exits sow loop)
    t.action(game, 'sow-field', { row: 2, col: 2, cropType: 'grain' })

    // Build fences (0 wood after → auto-exits)
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        wood: 0, // 4 - 4 = 0
        grain: 0, // 1 sown
        minorImprovements: ['agrarian-fences-b026'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 2, col: 2, crop: 'grain', cropCount: 3 }], // 1 grain sown → 3 on field
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('can build fences when cannot sow or bake', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['agrarian-fences-b026'],
        wood: 4,
        // No grain, no baking improvement, no fields → can't sow or bake
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // Can't sow or bake, but can build fences → goes directly to buildFences
    // After building, 0 wood → auto-exits
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        wood: 0,
        minorImprovements: ['agrarian-fences-b026'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('can choose normal sow flow with Agrarian Fences', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['agrarian-fences-b026'],
        grain: 1,
        wood: 4,
        farmyard: {
          fields: [{ row: 2, col: 2 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Sow and/or Bake Bread')

    // Normal sow flow: sow grain into field (only 1 field, auto-exits)
    t.action(game, 'sow-field', { row: 2, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        wood: 4, // unchanged
        grain: 0, // sown
        minorImprovements: ['agrarian-fences-b026'],
        farmyard: {
          fields: [{ row: 2, col: 2, crop: 'grain', cropCount: 3 }],
          pastures: [], // no fences built
        },
      },
    })
  })
})
