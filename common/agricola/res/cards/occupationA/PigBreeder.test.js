const t = require('../../../testutil_v2.js')

describe('Pig Breeder', () => {
  // Card is 4+ players. onPlay: +1 boar. onRoundEnd(12): breed boar if 2+ and room.

  test('onPlay gives 1 wild boar', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pig-breeder-a165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    // Play Pig Breeder via Lessons A (first occupation is free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Pig Breeder')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['pig-breeder-a165'],
        animals: { boar: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], boar: 1 }],
        },
      },
    })
  })

  test('breeds boar at end of round 12 with 2+ boar and space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // 8 actions to complete round 12
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Clay Pit')       // scott
    t.choose(game, 'Reed Bank')      // eliya
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Fishing')        // micah
    t.choose(game, 'Hollow')         // scott
    t.choose(game, 'Copse')          // eliya

    // onRoundEnd(12): 2 boar + space → breeds to 3

    t.testBoard(game, {
      round: 13,
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 12,  // 10 + 2(Day Laborer)
        grain: 1,
        animals: { boar: 3 },  // 2 + 1 bred
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 3 }],
        },
      },
    })
  })

  test('does not breed on non-12 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // 8 actions to complete round 11
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Clay Pit')       // scott
    t.choose(game, 'Reed Bank')      // eliya
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Fishing')        // micah
    t.choose(game, 'Hollow')         // scott
    t.choose(game, 'Copse')          // eliya

    // Round 11 is a harvest round. onRoundEnd(11) → not round 12, no breeding
    // But harvest breeding: 2 boar → 3 from normal harvest breeding

    t.testBoard(game, {
      round: 12,
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 8,  // 10 + 2(DL) - 4(feeding)
        grain: 1,
        animals: { boar: 3 },  // 2 + 1 from normal harvest breeding
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 3 }],
        },
      },
    })
  })

  test('does not breed with fewer than 2 boar', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // 8 actions to complete round 12
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Clay Pit')       // scott
    t.choose(game, 'Reed Bank')      // eliya
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Fishing')        // micah
    t.choose(game, 'Hollow')         // scott
    t.choose(game, 'Copse')          // eliya

    // onRoundEnd(12): only 1 boar → no breeding

    t.testBoard(game, {
      round: 13,
      dennis: {
        occupations: ['pig-breeder-a165'],
        food: 12,  // 10 + 2(DL)
        grain: 1,
        animals: { boar: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 1 }],
        },
      },
    })
  })
})
