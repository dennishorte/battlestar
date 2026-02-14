const t = require('../../../testutil_v2.js')

describe('Wood Slide Hammer', () => {
  test('renovate wood to stone directly with 2 stone discount', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-slide-hammer-c013'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],  // 5 rooms total
        },
        // Normal wood→stone: 5 stone + 1 reed
        // With WoodSlideHammer discount: 5 - 2 = 3 stone + 1 reed
        stone: 3,
        reed: 1,
      },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    // Game auto-selects stone (can't afford clay, can afford stone with discount)
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
        minorImprovements: ['wood-slide-hammer-c013'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('offers choice when both clay and stone are affordable', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-slide-hammer-c013'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
        },
        stone: 5,
        clay: 10,
        reed: 3,
      },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Renovate to Stone')

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
        stone: 2,   // 5 - 3 (5 rooms - 2 discount = 3 stone cost)
        clay: 10,
        reed: 2,    // 3 - 1
        minorImprovements: ['wood-slide-hammer-c013'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('does not apply with fewer than 5 rooms', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-slide-hammer-c013'],
        roomType: 'wood',
        // Default 2 rooms → WoodSlideHammer doesn't apply
        clay: 5,
        reed: 3,
      },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    // With only 2 rooms, WoodSlideHammer doesn't apply — normal wood→clay
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        clay: 3,   // 5 - 2 (2 rooms × 1 clay each)
        reed: 2,   // 3 - 1
        minorImprovements: ['wood-slide-hammer-c013'],
      },
    })
  })
})
