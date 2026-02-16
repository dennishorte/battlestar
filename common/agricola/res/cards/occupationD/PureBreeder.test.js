const t = require('../../../testutil_v2.js')

describe('Pure Breeder', () => {
  test('onPlay gives 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pure-breeder-d167'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Pure Breeder')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['pure-breeder-d167'],
        wood: 1,  // from onPlay
      },
    })
  })

  test('breeds sheep at end of non-harvest round', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,  // non-harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pure-breeder-d167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // onRoundEnd fires — non-harvest round, has 2 sheep with room
    t.choose(game, 'Breed sheep')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['pure-breeder-d167'],
        food: 2,   // from Day Laborer
        grain: 1,  // from Grain Seeds
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 3 }],
        },
      },
    })
  })

  test('does not trigger on harvest rounds', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,  // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pure-breeder-d167'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest round: onRoundEnd fires but isHarvestRound => no breeding prompt
    // (Normal harvest breeding happens, but 2 sheep -> 3 from regular breeding)

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['pure-breeder-d167'],
        food: 8,   // 10 + 2(DL) - 4(feeding)
        clay: 1,
        animals: { sheep: 3 },  // normal breeding: 2 -> 3
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 3 }],
        },
      },
    })
  })

  test('does not trigger without 2+ of any animal', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,  // non-harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pure-breeder-d167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // onRoundEnd fires — only 1 sheep, no breedable type => no prompt

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['pure-breeder-d167'],
        food: 2,
        grain: 1,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
