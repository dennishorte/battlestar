const t = require('../../../testutil_v2.js')

describe('Tinsmith Master', () => {
  // Card text: "You can hold 1 additional animal in each pasture without a
  // stable. Each time you sow in a field, you can place 1 additional crop of
  // the respective type in that field."

  test('+1 pasture capacity for pastures without stable', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tinsmith-master-b115'],
        food: 10,
        farmyard: {
          // 2-space pasture without stable: base capacity = 4, +1 = 5
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Take Sheep Market — with 4 sheep already and capacity 5,
    // one more should fit
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['tinsmith-master-b115'],
        food: 10,
        animals: { sheep: 5 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 5 }],
        },
      },
    })
  })

  test('no extra capacity for pastures with stable', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    // 1-space pasture with stable: base = 2, doubled by stable = 4, no +1
    // Place 4 sheep — should be at max
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['tinsmith-master-b115'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 4 }],
          stables: [{ row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // Capacity should be 4 (1×2=2, doubled by stable=4, no +1 from Tinsmith)
    t.testBoard(game, {
      dennis: {
        occupations: ['tinsmith-master-b115'],
        animals: { sheep: 4 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 4 }],
          stables: [{ row: 0, col: 3 }],
        },
      },
    })
  })

  test('+1 crop when sowing', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tinsmith-master-b115'],
        grain: 1,
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Sow grain: normally places 3, Tinsmith adds 1 → 4
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        occupations: ['tinsmith-master-b115'],
        food: 10,
        grain: 0,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 4 }],  // 3 + 1
        },
      },
    })
  })
})
