const t = require('../../../testutil_v2.js')

describe('Plowman', () => {
  test('onPlay schedules plowman events at +4, +7, +10', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['plowman-d091'],
      },
    })
    game.run()

    // Play Plowman via Lessons A (first occupation is free)
    // Default round is 2, so events at 6, 9, 12
    t.choose(game, 'Lessons A')
    t.choose(game, 'Plowman')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['plowman-d091'],
        scheduled: { plowman: [6, 9, 12] },
      },
    })
  })

  test('onRoundStart offers plow for food at scheduled round', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plowman-d091'],
        food: 1,
        scheduled: { plowman: [6, 9, 12] },
      },
    })
    game.run()

    // Round 6 start: Plowman onRoundStart fires -> offers plow for 1 food
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '2,0') // plow field location

    // 4 actions to complete round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['plowman-d091'],
        food: 2, // 1 - 1 (plow cost) + 2 (Day Laborer)
        clay: 1,
        scheduled: { plowman: [6, 9, 12] }, // entries not consumed
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not offer plow when no food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plowman-d091'],
        // food defaults to 0
        scheduled: { plowman: [6, 9, 12] },
      },
    })
    game.run()

    // Round 6 start: Plowman does not fire (no food)
    // First choice is an action space, not a plow offer
    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        occupations: ['plowman-d091'],
        scheduled: { plowman: [6, 9, 12] },
      },
    })
  })
})
