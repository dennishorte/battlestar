const t = require('../../../testutil_v2.js')

describe('Weakling', () => {
  // Card text: "Each time it is your turn in the work phase, if there are
  // 1 or more accumulation spaces with 5+ goods on them and you do not
  // use any of them, you get 1 vegetable."
  // Uses afterPlayerAction hook. Card is 4+ players.

  test('gives 1 vegetable when skipping a 5+ accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['weakling-b161'],
      },
    })
    game.run()

    // dennis takes Day Laborer (not an accumulation space with 5+ goods)
    // Forest has 6 wood (5+) → Weakling triggers
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['weakling-b161'],
        food: 2,        // from Day Laborer
        vegetables: 1,  // from Weakling
      },
    })
  })

  test('does not trigger when player uses the 5+ accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['weakling-b161'],
      },
    })
    game.run()

    // dennis takes Forest (the 5+ accumulation space) → no Weakling
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['weakling-b161'],
        wood: 6,        // from Forest
        vegetables: 0,  // Weakling does NOT trigger
      },
    })
  })

  test('does not trigger when no accumulation spaces have 5+ goods', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['weakling-b161'],
      },
    })
    game.run()

    // Round 1: all accumulation spaces have low amounts (3 wood, 1 clay, etc.)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['weakling-b161'],
        food: 2,
        vegetables: 0,  // no 5+ accumulation spaces
      },
    })
  })
})
