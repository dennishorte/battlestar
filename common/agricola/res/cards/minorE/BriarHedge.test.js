const t = require('../../../testutil_v2.js')

describe('Briar Hedge', () => {
  test('reduces fence cost by edge fence count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['briar-hedge-e016'],
        pet: 'sheep',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], animals: { boar: 1 } },
            { spaces: [{ row: 0, col: 4 }], animals: { cattle: 1 } },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 5 fences, 3 edge → cost = 5 - 3 = 2
    expect(dennis.applyFenceCostModifiers(5, 3)).toBe(2)
    // All edge → free
    expect(dennis.applyFenceCostModifiers(4, 4)).toBe(0)
    // No edge → no discount
    expect(dennis.applyFenceCostModifiers(4, 0)).toBe(4)
  })

  test('edge pasture costs less wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Fencing'],
      dennis: {
        minorImprovements: ['briar-hedge-e016'],
        pet: 'sheep',
        wood: 3,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 4 }], animals: { boar: 1 } },
            { spaces: [{ row: 0, col: 3 }], animals: { cattle: 1 } },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Build a pasture at (1,4): connects to existing fence at (0,4)
    // 3 new fences: bottom, left (internal → 1 wood each), right (edge → free)
    // Total cost: 2 wood instead of 3
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 1, col: 4 }] })

    const dennis = game.players.byName('dennis')
    expect(dennis.wood).toBe(1) // 3 - 2 = 1 (edge fence was free)
  })
})
