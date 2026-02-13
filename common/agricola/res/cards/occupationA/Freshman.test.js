const t = require('../../../testutil_v2.js')

describe('Freshman', () => {
  test('can play a free occupation instead of baking', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['freshman-a097'],
        hand: ['test-occupation-1'],
        grain: 1,
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
    game.run()

    // Use Grain Utilization — no empty fields to sow, goes straight to bake
    // Freshman offers choice before baking
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Play an occupation free')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // grain not spent on baking
        occupations: ['freshman-a097', 'test-occupation-1'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('can decline and bake bread normally', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['freshman-a097'],
        hand: ['test-occupation-1'],
        grain: 2,
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake bread normally')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2, // from baking (Fireplace: 1 grain → 2 food)
        occupations: ['freshman-a097'],
        hand: ['test-occupation-1'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('does not trigger when no occupations in hand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['freshman-a097'],
        grain: 2,
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
    game.run()

    // No occupations in hand → goes straight to baking (no Freshman choice)
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        food: 2,
        occupations: ['freshman-a097'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
