const t = require('../../../testutil_v2.js')

describe('Muck Rake', () => {
  test('1 bonus point per animal type in exactly 1 unfenced stable', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
      },
    })
    game.run()

    // 1 sheep in 1 stable, 1 boar in 1 stable, 1 cattle in 1 stable = 3 bonus points
    // Score: fields(-1) pastures(-1) grain(-1) veg(-1) sheep(+1) boar(+1) cattle(+1)
    //   rooms(0) family(6) unused(-10) fencedStables(0) bonus(3) = -2
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
        score: -2,
      },
    })
  })

  test('no points if 2 stables hold same animal type', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 2, cattle: 1 },
      },
    })
    game.run()

    // 2 stables with sheep (not exactly 1) → 0 for sheep; 1 for cattle; 0 for boar = 1 bonus
    // Score: fields(-1) pastures(-1) grain(-1) veg(-1) sheep(+1) boar(-1) cattle(+1)
    //   rooms(0) family(6) unused(-10) fencedStables(0) bonus(1) = -6
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 2, cattle: 1 },
        score: -6,
      },
    })
  })
})
