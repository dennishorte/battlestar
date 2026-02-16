const t = require('../../../testutil_v2.js')

describe('Bean Counter', () => {
  test('does not trigger on base action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bean-counter-d158'],
      },
    })
    game.run()

    // Day Laborer is a base action (getActionSpaceRound returns undefined), not a round card
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // only from Day Laborer, no Bean Counter trigger
        occupations: ['bean-counter-d158'],
      },
    })
  })

  test('accumulates on card for round-card actions without payout before 3', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bean-counter-d158'],
      },
    })
    game.run()

    // Grain Utilization is a round card (round 1). With no fields and no baking,
    // it auto-skips. Bean Counter accumulates 1 food on card but no payout (need 3).
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        // No food: Bean Counter accumulated 1 but needs 3 to pay out
        occupations: ['bean-counter-d158'],
      },
    })
  })

  test('gives 3 food after using 3 round-card action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bean-counter-d158'],
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
        food: 10,
      },
      micah: {
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
        food: 10,
      },
    })
    game.run()

    // Round 6: 3 workers each = 6 actions per round.
    // Dennis uses 3 round-card spaces to trigger Bean Counter payout.
    t.choose(game, 'Grain Utilization')  // dennis: round card use #1 (auto-skips sow/bake)
    t.choose(game, 'Forest')             // micah
    t.choose(game, 'Fencing')            // dennis: round card use #2 (auto-skips, no wood)
    t.choose(game, 'Day Laborer')        // micah
    t.choose(game, 'Western Quarry')     // dennis: round card use #3 -> Bean Counter pays 3 food
    t.choose(game, 'Clay Pit')           // micah

    t.testBoard(game, {
      dennis: {
        food: 13, // 10 starting + 3 from Bean Counter
        stone: 1, // from Western Quarry
        occupations: ['bean-counter-d158'],
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
