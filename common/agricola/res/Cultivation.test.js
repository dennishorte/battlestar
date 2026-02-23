const t = require('../testutil_v2.js')

describe('Cultivation action space', () => {
  test('allows plowing only 1 field before sowing', () => {
    const game = t.fixture({ cardSets: ['test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Cultivation'],
      dennis: {
        grain: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Cultivation')

    // Player should be asked if they want to plow
    t.choose(game, 'Plow a field')
    t.choose(game, '0,2')

    // After plowing 1 field, should move to sowing — NOT offer another plow
    // Sow the grain (only 1 empty field, sow loop auto-exits)
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('allows sowing on a field that already has crops (replant)', () => {
    const game = t.fixture({ cardSets: ['test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        vegetables: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')

    // Should be able to sow on the field that already has grain, replacing it with vegetables
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'vegetables' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        vegetables: 0,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
    })
  })

  test('allows sowing on a field that already has the same crop type', () => {
    const game = t.fixture({ cardSets: ['test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')

    // Should be able to re-sow grain on a field that already has grain
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('allows skipping plow and only sowing', () => {
    const game = t.fixture({ cardSets: ['test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Cultivation'],
      dennis: {
        grain: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Cultivation')

    // Skip plowing
    t.choose(game, 'Skip plowing')

    // Should still be able to sow (only 1 empty field, sow loop auto-exits)
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
