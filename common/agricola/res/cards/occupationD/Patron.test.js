const t = require('../../../testutil_v2.js')

describe('Patron', () => {
  test('gives 2 food before playing a subsequent occupation', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['patron-d152'],
        hand: ['test-occupation-1'],
        food: 1, // need 1 food to pass affordability gate (2nd occupation costs 1 food)
      },
    })
    game.run()

    // Dennis plays occupation via Lessons A
    // Affordability gate passes (1 food >= 1 cost)
    // Patron fires: +2 food (now 3), then pay 1 food cost = 2 food remaining
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // 1 initial + 2 from Patron - 1 cost
        occupations: ['patron-d152', 'test-occupation-1'],
      },
    })
  })
})
