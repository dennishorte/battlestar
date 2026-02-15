const t = require('../../../testutil_v2.js')

describe('Full Peasant', () => {
  // Card text: "Each time after you use the 'Grain Utilization' or
  // 'Fencing' action space while the other is unoccupied, you can pay
  // 1 food to use that other space with the same person."
  // Card is 1+ players. Both sow-bake and fencing are Stage 1 round cards.

  test('Grain Utilization while Fencing unoccupied: pay 1 food to use Fencing', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['full-peasant-b130'],
        food: 3,
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Use Grain Utilization — sow grain
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    // Full Peasant offers Fencing
    t.choose(game, 'Use Fencing (pay 1 food)')
    // Fencing: no wood for fences, auto-skips

    t.testBoard(game, {
      dennis: {
        food: 2,  // 3 - 1
        grain: 1, // 2 - 1 sowed
        occupations: ['full-peasant-b130'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('player can skip the offer', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['full-peasant-b130'],
        food: 3,
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    // Full Peasant offers Fencing — skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 1,
        occupations: ['full-peasant-b130'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('no offer when other space is occupied', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['full-peasant-b130'],
        food: 3,
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // micah takes Fencing first (occupies it)
    t.choose(game, 'Fencing')
    // No wood for fences → auto-skips

    // dennis takes Grain Utilization
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    // No Full Peasant offer — Fencing is occupied

    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 1,
        occupations: ['full-peasant-b130'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
