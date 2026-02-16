const t = require('../../../testutil_v2.js')

describe('Stone Carver', () => {
  test('converts 1 stone to 3 food during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,  // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-carver-d108'],
        stone: 2,
        food: 1,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: field phase, then onHarvest fires
    t.choose(game, 'Convert 1 stone to 3 food')

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['stone-carver-d108'],
        stone: 1,  // 2 - 1
        clay: 1,   // from Clay Pit
        food: 2,   // 1 + 2(DL) + 3(carver) - 4(feeding) = 2
      },
    })
  })

  test('can skip conversion', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-carver-d108'],
        stone: 1,
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // onHarvest fires — skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['stone-carver-d108'],
        stone: 1,  // unchanged
        clay: 1,
        food: 0,   // 2 + 2(DL) - 4(feeding) = 0
      },
    })
  })

  test('does not trigger without stone', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-carver-d108'],
        stone: 0,
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // No stone => no prompt, goes straight to feeding

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['stone-carver-d108'],
        clay: 1,
        food: 0,  // 2 + 2(DL) - 4(feeding) = 0
      },
    })
  })
})
