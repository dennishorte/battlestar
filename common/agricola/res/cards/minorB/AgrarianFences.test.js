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

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0) // 4 - 4 = 0
    expect(dennis.grain).toBe(1) // didn't sow
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

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0) // 4 - 4 = 0
    expect(dennis.grain).toBe(0) // 1 sown
    // Field should be sown with grain
    const fieldSpace = dennis.farmyard.grid[2][2]
    expect(fieldSpace.crop).toBe('grain')
    expect(fieldSpace.cropCount).toBe(3) // 1 grain sown → 3 on field
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

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0)
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

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(0) // no fences built
    expect(dennis.grain).toBe(0) // sown
    expect(dennis.wood).toBe(4) // unchanged
  })
})
