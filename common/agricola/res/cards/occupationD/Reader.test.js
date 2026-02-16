const t = require('../../../testutil_v2.js')

describe('Reader', () => {
  test('activates room when reaching 6 occupations', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['reader-d085', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        hand: ['test-occupation-5'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // Dennis plays 6th occupation via Lessons A -> Reader activates (6 occupations)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 5')

    // Micah does something
    t.choose(game, 'Forest')

    // Dennis uses Basic Wish for Children (Reader provides virtual room for 3rd person)
    t.choose(game, 'Basic Wish for Children')

    // Micah second turn
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 19, // 20 - 1 (6th occupation cost via Lessons A)
        familyMembers: 3,
        occupations: ['reader-d085', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
      },
    })
  })

  test('does not activate room with fewer than 6 occupations', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['reader-d085', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        hand: ['test-occupation-4'],
        food: 1, // need 1 food to pay for 5th occupation
      },
    })
    game.run()

    // Play 5th occupation -> Reader doesn't activate (need 6)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 4')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['reader-d085', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
      },
    })

    // Verify room count is still 2 (no virtual room)
    const dennis = game.players.byName('dennis')
    expect(dennis.getRoomCount()).toBe(2)
  })
})
