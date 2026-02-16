const t = require('../../../testutil_v2.js')

describe('Hide Farmer', () => {
  test('pays food to cover unused spaces during scoring', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['hide-farmer-d132'],
        food: 3,
      },
    })
    game.run()

    // Score calculation:
    // fields: 0 = -1, pastures: 0 = -1, grain: 0 = -1, veg: 0 = -1
    // sheep: 0 = -1, boar: 0 = -1, cattle: 0 = -1
    // Categories subtotal = -7
    // Rooms: 2 wood = 0
    // Family: 2 * 3 = 6
    // Unused spaces: 13 * -1 = -13
    // Hide Farmer: pays 3 food, +3 bonus points
    // Total = -7 + 0 + 6 - 13 + 3 = -11
    t.testBoard(game, {
      dennis: {
        score: -11,
        occupations: ['hide-farmer-d132'],
        food: 3,
      },
    })
  })

  test('gives 0 bonus when player has no food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['hide-farmer-d132'],
        food: 0,
      },
    })
    game.run()

    // Score calculation:
    // Categories subtotal = -7
    // Rooms: 0, Family: 6, Unused: -13
    // Hide Farmer: 0 food -> 0 bonus
    // Total = -7 + 0 + 6 - 13 + 0 = -14
    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['hide-farmer-d132'],
      },
    })
  })

  test('limited by number of unused spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['hide-farmer-d132'],
        food: 20,
        farmyard: {
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
          ],
        },
      },
    })
    game.run()

    // Farmyard: 2 rooms + 12 fields = 14 used. 1 unused (2,4).
    // Score calculation:
    // fields: 12 = 4 (max), pastures: 0 = -1, grain: 0 = -1, veg: 0 = -1
    // sheep: 0 = -1, boar: 0 = -1, cattle: 0 = -1
    // Categories = 4 + 6*(-1) = -2
    // Rooms: 2 wood = 0
    // Family: 2 * 3 = 6
    // Unused spaces: 1 * -1 = -1
    // Hide Farmer: min(20, 1) = 1 -> pays 1 food, +1 bonus
    // Total = -2 + 0 + 6 - 1 + 1 = 4
    t.testBoard(game, {
      dennis: {
        score: 4,
        occupations: ['hide-farmer-d132'],
        food: 20,
        farmyard: {
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
          ],
        },
      },
    })
  })

  test('gives 0 bonus when no unused spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['hide-farmer-d132'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    // Farmyard: 2 rooms + 13 fields = 15 used. 0 unused.
    // fields: 13 = 4 (max), pastures: 0 = -1, grain: 0 = -1, veg: 0 = -1
    // sheep: 0 = -1, boar: 0 = -1, cattle: 0 = -1
    // Categories = 4 + 6*(-1) = -2
    // Rooms: 0, Family: 6, Unused: 0
    // Hide Farmer: 0 unused -> 0 bonus
    // Total = -2 + 0 + 6 + 0 + 0 = 4
    t.testBoard(game, {
      dennis: {
        score: 4,
        occupations: ['hide-farmer-d132'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
  })
})
