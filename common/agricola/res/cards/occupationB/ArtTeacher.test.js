const t = require('../../../testutil_v2.js')

describe('Art Teacher', () => {
  // Card text: "When you play this card, you immediately get 1 wood and 1 reed.
  // Each time you pay an occupation cost, you can use food from the 'Traveling
  // Players' accumulation space."
  // Card is 4+ players.

  test('onPlay gives 1 wood and 1 reed', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['art-teacher-b155'],
        wood: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Art Teacher')

    t.testBoard(game, {
      dennis: {
        occupations: ['art-teacher-b155'],
        wood: 1,
        reed: 1,
      },
    })
  })

  test('can pay occupation cost using food from Traveling Players accumulation', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 3,  // round 3 so Traveling Players has food from accumulation
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['art-teacher-b155', 'test-occupation-1'],
        hand: ['test-occupation-2'],
        food: 0,  // no food in supply
      },
    })
    game.run()

    // At round 3, Traveling Players accumulates 1 food per round → 3 food
    // dennis has Art Teacher and 0 food, but TP has food
    // Occupation cost for 3rd occupation = 1 food, taken from TP
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 2')

    t.testBoard(game, {
      dennis: {
        occupations: ['art-teacher-b155', 'test-occupation-1', 'test-occupation-2'],
        food: 0,  // still 0 — food came from Traveling Players
      },
    })
  })
})
