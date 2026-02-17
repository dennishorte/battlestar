const t = require('../../../testutil_v2.js')

describe('Writing Chamber', () => {
  test('bonus points equal to negative points, max 7', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        // Default: 0 of all 7 categories = -7 from categories
        // Default: 2 rooms at (0,0) and (1,0), 13 unused spaces = -13
        // Total negative = -20, capped at 7 bonus
      },
    })
    game.run()

    // Score: categories(-7) + rooms(0) + family(6) + unused(-13) + bonus(7) = -7
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        score: -7,
      },
    })
  })

  test('fewer bonus points with fewer negatives', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        grain: 1,
        vegetables: 1,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] },
          ],
        },
        animals: { sheep: 1 },
      },
    })
    game.run()

    // Negatives: boar(-1) + cattle(-1) + unused spaces(9 × -1) = -11, capped at 7
    // Score: fields(+1) pastures(+1) grain(+1) veg(+1) sheep(+1) boar(-1) cattle(-1)
    //   rooms(0) family(6) unused(-9) bonus(7) = 7
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        grain: 1,
        vegetables: 1,
        farmyard: {
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 1 },
          ],
        },
        animals: { sheep: 1 },
        score: 7,
      },
    })
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

    // All categories covered, no unused spaces, no begging cards → 0 negatives
    // Score: fields(+3) pastures(+2) grain(+1) veg(+1) sheep(+1) boar(+1) cattle(+1)
    //   rooms(0) family(6) unused(0) bonus(0) = 16
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['writing-chamber-c031'],
        grain: 1,
        vegetables: 1,
        pet: 'cattle',
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
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }], sheep: 1 },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 1 },
          ],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
        score: 16,
      },
    })
  })
})
