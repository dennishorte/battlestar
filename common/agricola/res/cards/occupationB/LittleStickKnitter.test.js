const t = require('../../../testutil_v2.js')

describe('Little Stick Knitter', () => {
  // Card text: "From Round 5 on, each time you use the 'Sheep Market'
  // accumulation space, you can also take a 'Family Growth with Room
  // Only' action."
  // Card is 1+ players.

  test('Sheep Market in round 5+ allows Family Growth with Room', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['little-stick-knitter-b092'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Round 5 (5 round cards): take Sheep Market
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        pet: 'sheep',
        animals: { sheep: 1 },
        occupations: ['little-stick-knitter-b092'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('Sheep Market before round 5 does not offer family growth', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['little-stick-knitter-b092'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Round 1 (only 1 round card): take Sheep Market
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,  // no growth
        pet: 'sheep',
        animals: { sheep: 1 },
        occupations: ['little-stick-knitter-b092'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('Sheep Market in round 5+ without extra room does not offer family growth', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['little-stick-knitter-b092'],
        // Default 2 rooms, 2 family members — no spare room
      },
    })
    game.run()

    // Round 5: take Sheep Market but no extra room available
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,  // no growth
        pet: 'sheep',
        animals: { sheep: 1 },
        occupations: ['little-stick-knitter-b092'],
      },
    })
  })
})
