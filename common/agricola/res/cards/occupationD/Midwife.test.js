const t = require('../../../testutil_v2.js')

describe('Midwife', () => {
  test('gives 1 grain when opponent uses Family Growth with 1st person', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['midwife-d160'],
        food: 20,
      },
      micah: {
        food: 20,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total for family growth
        },
      },
    })
    game.run()

    // Micah uses Basic Wish for Children as 1st person placed this round
    t.choose(game, 'Basic Wish for Children')
    // No minor improvements in hand -> auto-skipped

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        food: 20,
        grain: 1, // from Midwife
        occupations: ['midwife-d160'],
      },
      micah: {
        food: 20,
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not give grain when opponent uses Family Growth with 2nd person', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['midwife-d160'],
        food: 20,
      },
      micah: {
        food: 20,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
        },
      },
    })
    game.run()

    // Dennis goes first (not family growth)
    t.choose(game, 'Day Laborer')

    // Micah places 1st person on something else
    t.choose(game, 'Forest')

    // Dennis second turn
    t.choose(game, 'Clay Pit')

    // Micah's 2nd person uses Family Growth -> not 1st person, Midwife doesn't trigger
    t.choose(game, 'Basic Wish for Children')

    t.testBoard(game, {
      dennis: {
        food: 22, // 20 + 2 (Day Laborer)
        grain: 0, // Midwife did NOT trigger (micah used 2nd person)
        clay: 1, // from Clay Pit
        occupations: ['midwife-d160'],
      },
      micah: {
        food: 20,
        familyMembers: 3,
        wood: 3, // from Forest (accumulated 3 by round 6)
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger when card owner uses Family Growth', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['midwife-d160'],
        food: 20,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Dennis uses Family Growth as 1st person, but Midwife only triggers for opponents
    t.choose(game, 'Basic Wish for Children')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 20,
        grain: 0, // Midwife does NOT trigger for self
        familyMembers: 3,
        occupations: ['midwife-d160'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
