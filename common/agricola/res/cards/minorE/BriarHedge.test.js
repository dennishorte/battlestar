const t = require('../../../testutil_v2.js')

describe('Briar Hedge', () => {
  test('edge fences are free — bottom-row pasture pays only for internal fences', () => {
    // Build a 2-space pasture at bottom row (2,3)+(2,4) adjacent to existing (1,3)+(1,4)
    // 4 new fences: left (internal → 1 wood), bottom×2 + right (edge → free)
    // Without Briar Hedge: 4 wood. With Briar Hedge: 1 wood.
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Fencing'],
      dennis: {
        minorImprovements: ['briar-hedge-e016'],
        pet: 'sheep',
        wood: 4,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], animals: { boar: 1 } },
            { spaces: [{ row: 0, col: 4 }], animals: { cattle: 1 } },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['briar-hedge-e016'],
        pet: 'sheep',
        animals: { sheep: 1, boar: 1, cattle: 1 },
        wood: 3, // 4 - 1 internal fence (3 edge fences free)
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], boar: 1 },
            { spaces: [{ row: 0, col: 4 }], cattle: 1 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
    })
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

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['briar-hedge-e016'],
        pet: 'sheep',
        animals: { sheep: 1, boar: 1, cattle: 1 },
        wood: 1, // 3 - 2 = 1 (edge fence was free)
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], cattle: 1 },
            { spaces: [{ row: 0, col: 4 }], boar: 1 },
            { spaces: [{ row: 1, col: 4 }] },
          ],
        },
      },
    })
  })
})
