const t = require('../../../testutil_v2.js')

describe('Bellfounder', () => {
  test('discards all clay for 3 food on return home', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 5,
      },
    })
    game.run()

    // Play all 4 actions
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Return home: Bellfounder triggers
    t.choose(game, '3 food')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 0,
        food: 5, // 0 + 2(DL) + 3(bellfounder)
        grain: 1,
        bonusPoints: 0,
      },
    })
  })

  test('discards all clay for 1 bonus point on return home', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 3,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.choose(game, '1 bonus point')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 0,
        food: 2, // only from Day Laborer
        grain: 1,
        bonusPoints: 1,
      },
    })
  })

  test('does not trigger with 0 clay', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // No prompt — clay is 0, game proceeds to next round

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['bellfounder-d107'],
        clay: 0,
        food: 2,
        grain: 1,
      },
    })
  })
})
