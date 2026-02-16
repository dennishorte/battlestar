const t = require('../../../testutil_v2.js')

describe('Seed Servant', () => {
  test('offers bake bread after Grain Seeds when player has baking ability', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-servant-e115'],
        grain: 1, // 1 existing + 1 from Grain Seeds = 2
        majorImprovements: ['fireplace-2'], // baking ability (1 grain -> 2 food)
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    // SeedServant triggers: offers bake bread
    // Player has 2 grain + fireplace -> bake
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // 1 + 1 from Grain Seeds - 1 baked = 1
        food: 2,  // 2 from baking
        occupations: ['seed-servant-e115'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('does not offer bake bread without baking improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-servant-e115'],
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    // No baking improvement -> no bake offer, moves to micah

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // from Grain Seeds
        food: 0,
        occupations: ['seed-servant-e115'],
      },
    })
  })

  test('offers sow after Vegetable Seeds when player has empty fields', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-servant-e115'],
        vegetables: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }], // empty field for sowing
        },
      },
    })
    game.run()

    t.choose(game, 'Vegetable Seeds')
    // SeedServant triggers: offers sow
    // Player has 2 vegetables + empty field -> sow via action input
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'vegetables' })
    // No more empty fields -> auto-exits sow loop

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        vegetables: 1, // 1 + 1 from Vegetable Seeds - 1 sowed = 1
        occupations: ['seed-servant-e115'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
    })
  })

  test('does not offer sow after Vegetable Seeds without empty fields', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-servant-e115'],
        // No fields -> cannot sow
      },
    })
    game.run()

    t.choose(game, 'Vegetable Seeds')
    // No empty fields -> no sow offer, moves to micah

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        vegetables: 1, // from Vegetable Seeds
        occupations: ['seed-servant-e115'],
      },
    })
  })
})
