const t = require('../../../testutil_v2.js')

describe('Writing Chamber', () => {
  test('bonus points equal to negative points, max 7', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        // Default: 0 of all 7 categories = -7 from categories
        // Default: 2 rooms at (0,0) and (1,0), 13 unused spaces = -13
        // Total negative = -20, capped at 7
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('writing-chamber-c031')
    expect(card.callHook('getEndGamePoints', dennis)).toBe(7)
  })

  test('fewer bonus points with fewer negatives', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        grain: 1,       // no longer -1 for grain
        vegetables: 1,  // no longer -1 for vegetables
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 },  // 2 fields → +1, no penalty
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] },  // 1 pasture → +1, no penalty
          ],
        },
        animals: { sheep: 1 },  // no longer -1 for sheep
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('writing-chamber-c031')
    // Negatives: boar(-1) + cattle(-1) + unused spaces
    // Grid: 2 rooms, 2 fields, 2 pasture spaces = 6 used, 9 unused = -9
    // Total = -2 - 9 = -11, capped at 7
    expect(card.callHook('getEndGamePoints', dennis)).toBe(7)
  })

  test('small number of negatives, below cap', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        grain: 1,
        vegetables: 1,
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 },
            { row: 0, col: 2 }, { row: 1, col: 2 },
          ],
          fields: [
            { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 3 }, { row: 1, col: 4 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('writing-chamber-c031')
    // All categories covered, no unused spaces, no begging cards
    // Negatives: 0
    expect(card.callHook('getEndGamePoints', dennis)).toBe(0)
  })
})
