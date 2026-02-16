const t = require('../../../testutil_v2.js')

describe('Roastmaster', () => {
  // Traveling Players is a 4-player action space, so use numPlayers: 4
  test('moves 1 food to Fishing and gets cattle when using Traveling Players', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['roastmaster-e166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }], // pasture for cattle
        },
      },
    })
    game.run()

    // Traveling Players accumulates 1 food per round; round 2 (first replenish) = 1 food
    t.choose(game, 'Traveling Players')

    // Roastmaster triggers: move 1 food to Fishing, get cattle
    t.choose(game, 'Move 1 food to Fishing, get cattle')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 0, // 1 from Traveling Players - 1 moved to Fishing
        animals: { cattle: 1 },
        occupations: ['roastmaster-e166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], cattle: 1 }],
        },
      },
    })

    // Verify Fishing got the extra food
    expect(game.state.actionSpaces['fishing'].accumulated).toBe(2) // 1 normal + 1 moved
  })

  test('can skip Roastmaster offer', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['roastmaster-e166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // 1 from Traveling Players (round 2), nothing moved
        animals: {},
        occupations: ['roastmaster-e166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })
})
