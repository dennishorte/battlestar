const t = require('../../../testutil_v2.js')

describe('Homekeeper', () => {
  test('no bonus for wood house — cannot grow family with 2 rooms and 2 members', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }] }],
        },
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // With wood house, Homekeeper gives no bonus → capacity = 2 rooms = 2
    // Dennis has 2 family members → cannot grow family (needs capacity > familyMembers)
    // Basic Wish for Children should NOT be available
    expect(t.currentChoices(game)).not.toContain('Basic Wish for Children')
  })

  test('+1 capacity when clay room adjacent to field and pasture — can grow family', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }] }],
        },
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // With clay house, room at (1,0) is adjacent to field at (2,0) and pasture at (1,1)
    // Homekeeper gives +1 capacity → capacity = 3
    // Dennis has 2 family members → CAN grow family
    expect(t.currentChoices(game)).toContain('Basic Wish for Children')
  })

  test('no bonus when room not adjacent to both field and pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 2 }],
          pastures: [{ spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] }],
        },
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Clay house but no room adjacent to BOTH field and pasture
    // (0,0) is adjacent to pasture (not field), (1,0) is adjacent to pasture (not field)
    // Homekeeper gives no bonus → capacity = 2
    // Dennis has 2 family members → cannot grow family
    expect(t.currentChoices(game)).not.toContain('Basic Wish for Children')
  })
})
