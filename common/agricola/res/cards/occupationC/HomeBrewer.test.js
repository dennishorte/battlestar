const t = require('../../../testutil_v2.js')

describe('Home Brewer', () => {
  // Card text: "After the field phase of each harvest, you can turn
  // exactly 1 grain into your choice of 3 food or 1 bonus point."

  test('converts 1 grain to 3 food after field phase', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['home-brewer-c110'],
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest → field phase → onFieldPhaseEnd: Home Brewer
    t.choose(game, 'Convert 1 grain to 3 food')

    // Feeding automatic: 10 + 2 (DL) + 3 (HB) - 1 (grain spent) = 14 food
    // Wait, grain spent doesn't affect food. food = 10 + 2 + 3 = 15, pay 4 = 11

    t.testBoard(game, {
      dennis: {
        occupations: ['home-brewer-c110'],
        grain: 2,
        food: 11,
      },
    })
  })

  test('converts 1 grain to 1 bonus point', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['home-brewer-c110'],
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Convert 1 grain to 1 bonus point')

    t.testBoard(game, {
      dennis: {
        occupations: ['home-brewer-c110'],
        grain: 2,
        food: 8,
        bonusPoints: 1,
      },
    })
  })
})
