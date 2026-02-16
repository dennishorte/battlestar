const t = require('../../../testutil_v2.js')

describe('Vegetable Vendor', () => {
  test('gets 1 vegetable when using Major Improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['vegetable-vendor-e141'],
        clay: 5,
        food: 5,
      },
      micah: { food: 5 },
    })
    game.run()

    // Use Major Improvement action
    t.choose(game, 'Major Improvement')
    // Choose Fireplace (nested choice format)
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,
        food: 5,
        vegetables: 1,
        occupations: ['vegetable-vendor-e141'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('offers improvement when using Vegetable Seeds action', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['vegetable-vendor-e141'],
        clay: 5,
        food: 5,
      },
      micah: { food: 5 },
    })
    game.run()

    // Use Vegetable Seeds
    t.choose(game, 'Vegetable Seeds')
    // VegetableVendor: buildImprovement (nested choice)
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,
        food: 5,
        vegetables: 1,
        occupations: ['vegetable-vendor-e141'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('auto-skips improvement when player cannot afford any', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['vegetable-vendor-e141'],
        food: 5,
      },
      micah: { food: 5 },
    })
    game.run()

    // Use Vegetable Seeds — VegetableVendor fires but no improvements affordable
    t.choose(game, 'Vegetable Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5,
        vegetables: 1,
        occupations: ['vegetable-vendor-e141'],
      },
    })
  })
})
