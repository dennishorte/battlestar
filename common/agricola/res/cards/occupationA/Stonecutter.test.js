const t = require('../../../testutil_v2.js')

describe('Stonecutter', () => {
  test('modifyAnyCost reduces stone cost by 1 for room building', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['stonecutter-a143'],
        roomType: 'stone',
        stone: 4, // 5 base cost - 1 Stonecutter = 4 needed
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['stonecutter-a143'],
        stone: 0, // 4 - 4 (5 base - 1 Stonecutter discount)
        reed: 0, // 2 - 2
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('modifyAnyCost reduces stone cost by 1 for renovation', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['stonecutter-a143'],
        roomType: 'clay',
        // Renovation clay→stone: 1 stone per room × 2 rooms + 1 reed = 2 stone + 1 reed
        // After Stonecutter: 1 stone + 1 reed
        stone: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Renovation happens, then improvement is auto-skipped (no affordable improvements)

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['stonecutter-a143'],
        stone: 0, // 1 - 1
        reed: 0, // 1 - 1
        roomType: 'stone',
        score: dennis.calculateScore(),
      },
    })
  })

  test('modifyAnyCost does not affect costs without stone', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['stonecutter-a143'],
        roomType: 'wood',
        wood: 5, // Wood room: 5 wood + 2 reed (no stone, no discount)
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['stonecutter-a143'],
        wood: 0, // 5 - 5
        reed: 0, // 2 - 2
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })
})
