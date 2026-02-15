const t = require('../../../testutil_v2.js')

describe('Moral Crusader', () => {
  // Card text: "Immediately before the start of each round, if there are
  // goods on remaining round spaces that are promised to you, you get 1 food."
  // Uses onRoundStart hook. Card is 1+ players.

  test('gives 1 food when player has scheduled resources', () => {
    // Manservant schedules 3 food/round once in stone house.
    // At round 5 start: Manservant triggers → schedules food for rounds 6-14.
    // At round 6 start: Moral Crusader sees future scheduled goods → +1 food.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['moral-crusader-b106', 'manservant-b107'],
        roomType: 'stone',
        food: 10,
      },
    })
    game.run()

    // Complete round 5
    t.choose(game, 'Day Laborer')   // dennis (+2 food)
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Round 6 start: scheduled food(3) + MC(1)
    t.testBoard(game, {
      dennis: {
        food: 16,  // 10 + 2(DL) + 3(scheduled r6) + 1(MC)
        grain: 1,
        occupations: ['moral-crusader-b106', 'manservant-b107'],
        roomType: 'stone',
        scheduled: {
          food: { 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3, 13: 3, 14: 3 },
        },
      },
    })
  })

  test('does not trigger when no scheduled resources', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['moral-crusader-b106'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // only Day Laborer
        occupations: ['moral-crusader-b106'],
      },
    })
  })
})
