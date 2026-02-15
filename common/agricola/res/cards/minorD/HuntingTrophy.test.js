const t = require('../../../testutil_v2.js')

describe('Hunting Trophy', () => {
  test('Farm Redevelopment: first 3 fence wood free', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 14,
      dennis: {
        minorImprovements: ['hunting-trophy-d082'],
        wood: 1, // only 1 wood: 4 fences need 4 wood, but 3 free → 1 wood
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // Dennis takes Farm Redevelopment
    t.choose(game, 'Farm Redevelopment')
    t.choose(game, 'Build Fences')
    // Build a 1-space pasture at (0,2) — needs 4 fences
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 2 }] })
    // Auto-exits fencing loop: 0 wood left, 0 free fences remaining

    // Check mid-round — don't need to finish the turn
    t.testBoard(game, {
      dennis: {
        wood: 0, // 1 - 1 = 0 (4 fences needed, 3 free, pay 1)
        food: 20,
        minorImprovements: ['hunting-trophy-d082'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
    })
  })

  test('House Redevelopment: improvement costs 1 stone less', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['hunting-trophy-d082'],
        // Renovation: wood→clay needs 2 clay + 1 reed (2 rooms)
        clay: 2, reed: 1,
        // Joinery costs 2 wood + 2 stone normally, with 1 stone discount → 2 wood + 1 stone
        wood: 2, stone: 1,
      },
    })
    game.run()

    // Dennis takes House Redevelopment
    t.choose(game, 'House Redevelopment')
    // Renovation: wood → clay (auto if only option)
    // Buy Joinery (2 wood + 2 stone → choose discount → multiple building resources)
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    // Multiple building resources (wood + stone) → choose which to reduce
    t.choose(game, 'Reduce stone by 1')

    t.testBoard(game, {
      dennis: {
        clay: 0, reed: 0,  // paid for renovation
        wood: 0, stone: 0, // 2 wood + 1 stone (after discount)
        roomType: 'clay',
        minorImprovements: ['hunting-trophy-d082'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('House Redevelopment: single building resource auto-discounted', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['hunting-trophy-d082'],
        // Renovation: wood→clay needs 2 clay + 1 reed (2 rooms)
        clay: 3, reed: 1,
        // Fireplace costs 2 clay → with 1 discount → 1 clay
        // After renovation, have 1 clay left (3 - 2 = 1)
      },
    })
    game.run()

    // Dennis takes House Redevelopment
    t.choose(game, 'House Redevelopment')
    // Renovation: wood → clay
    // Buy Fireplace (2 clay → auto-discount to 1 clay, only one building resource)
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        clay: 0, reed: 0, // 3 - 2 (renovation) - 1 (fireplace discounted) = 0
        roomType: 'clay',
        minorImprovements: ['hunting-trophy-d082'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
