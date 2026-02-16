const t = require('../../../testutil_v2.js')

describe('Plow Builder', () => {
  test('allows building Joinery on Major Improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-builder-e091'],
        wood: 2, stone: 2, // Joinery cost
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0, stone: 0,
        occupations: ['plow-builder-e091'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('offers plow for food when using Joinery during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-builder-e091'],
        majorImprovements: ['joinery'], // Joinery: wood -> 2 food during harvest
        wood: 1,
        food: 2, // needs 4 for 2 people. 2 food + 2 from joinery = 4 exactly
        familyMembers: 2,
      },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')          // plow field location
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: field phase (no crops), then feeding phase
    // Dennis has 2 food, needs 4. Use Joinery: 1 wood -> 2 food = 4 total
    t.choose(game, 'Use Joinery: convert wood to 2 food')
    // PlowBuilder fires: offers plow for 1 food
    // Taking it would leave 3 food but need 4. Skip to avoid begging.
    t.choose(game, 'Skip')
    // Has 4 food = 4 needed -> done converting auto-proceeds

    t.testBoard(game, {
      dennis: {
        wood: 0,  // 1 - 1 used for joinery
        food: 0,  // 4 - 4 feeding
        grain: 1, // from Grain Seeds
        occupations: ['plow-builder-e091'],
        majorImprovements: ['joinery'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('plows a field when accepting plow offer during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-builder-e091'],
        majorImprovements: ['joinery'], // Joinery: wood -> 2 food
        wood: 1,
        food: 3, // needs 4. 3 + 2 joinery = 5. After plow cost: 4. Just enough.
        familyMembers: 2,
      },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')          // plow field
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: feeding phase
    // Dennis has 3 food, needs 4. Use Joinery: 1 wood -> 2 food = 5 food
    t.choose(game, 'Use Joinery: convert wood to 2 food')
    // PlowBuilder fires: pay 1 food to plow
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '0,3') // plow field location (0,2 already plowed)
    // 5 - 1 (plow) = 4 food = 4 needed -> auto-feeds

    t.testBoard(game, {
      dennis: {
        wood: 0,  // 1 - 1 joinery
        food: 0,  // 5 - 1 plow - 4 feeding
        grain: 1, // from Grain Seeds
        occupations: ['plow-builder-e091'],
        majorImprovements: ['joinery'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })
})
