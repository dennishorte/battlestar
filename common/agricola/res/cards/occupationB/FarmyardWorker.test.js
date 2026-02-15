const t = require('../../../testutil_v2.js')

describe('Farmyard Worker', () => {
  // Card text: "At the end of each work phase in which you placed at least
  // 1 good on 1 of your farmyard spaces, you get 2 food."
  // Uses multiple hooks + onWorkPhaseEnd. Card is 3+ players.

  test('gives 2 food when built a room this phase', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['farmyard-worker-b140'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // Build a room via Farm Expansion
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    // Complete the round
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // scott
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Reed Bank')     // micah
    t.choose(game, 'Fishing')       // scott

    t.testBoard(game, {
      dennis: {
        food: 4,  // 2(DL) + 2(FW)
        occupations: ['farmyard-worker-b140'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('gives 2 food when sowed this phase', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['farmyard-worker-b140'],
        grain: 3,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Use Grain Utilization to sow
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    // Complete the round
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Reed Bank')    // micah
    t.choose(game, 'Fishing')      // scott

    t.testBoard(game, {
      dennis: {
        food: 4,  // 2(DL) + 2(FW for sowing)
        grain: 2,  // 3 - 1 sowed
        occupations: ['farmyard-worker-b140'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('does not trigger when no farmyard placement', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['farmyard-worker-b140'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // scott
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Reed Bank')     // micah
    t.choose(game, 'Fishing')       // scott

    t.testBoard(game, {
      dennis: {
        food: 2,  // only DL, no FW
        grain: 1,
        occupations: ['farmyard-worker-b140'],
      },
    })
  })
})
