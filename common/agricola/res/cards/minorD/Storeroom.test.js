const t = require('../../../testutil_v2.js')

describe('Storeroom', () => {
  test('scores 0.5 VP per grain+vegetable pair (rounded up)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['storeroom-d031'],
        grain: 3,
        vegetables: 2,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    // Total grain: 3 supply + 2 fields = 5, total veg: 2 supply + 1 fields = 3
    // Pairs: min(5,3) = 3, Points: ceil(3/2) = 2, plus vps: 1
    t.testBoard(game, {
      dennis: {
        score: -2,
        grain: 3,
        vegetables: 2,
        minorImprovements: ['storeroom-d031'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('scores 0 VP when missing one crop type', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['storeroom-d031'],
        grain: 5,
      },
    })
    game.run()

    // 0 vegetables → 0 pairs → 0 endgame points, but still vps: 1
    t.testBoard(game, {
      dennis: {
        score: -10,
        grain: 5,
        minorImprovements: ['storeroom-d031'],
      },
    })
  })
})
