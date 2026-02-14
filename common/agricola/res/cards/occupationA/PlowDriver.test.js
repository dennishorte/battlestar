const t = require('../../../testutil_v2.js')

describe('Plow Driver', () => {
  test('onRoundStart offers plow for 1 food when player has stone house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 2,
      },
    })
    game.run()

    // Round 2 starts - Plow Driver onRoundStart fires immediately
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '0,1')  // Plow field at row 0, col 1

    t.testBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 1, // 2 - 1 paid for plow
        farmyard: { fields: [{row: 0, col: 1}] },
      },
    })
  })

  test('onRoundStart allows skipping the plow offer', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 2,
      },
    })
    game.run()

    // Round 2 starts - Plow Driver fires, skip it
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 2, // Unchanged
        farmyard: { fields: [] },
      },
    })
  })

  test('onRoundStart does not trigger when player has wood house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'wood',
        food: 2,
      },
    })
    game.run()

    // Round 2 starts - Plow Driver should NOT trigger (wood house)
    // Game proceeds directly to work phase
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'wood',
        food: 4, // 2 + 2 from Day Laborer
      },
    })
  })

  test('onRoundStart does not trigger when player cannot afford 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 0,
      },
    })
    game.run()

    // Round 2 starts - Plow Driver should NOT trigger (0 food)
    // Game proceeds directly to work phase
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['plow-driver-a090'],
        roomType: 'stone',
        food: 2, // 0 + 2 from Day Laborer
      },
    })
  })
})
