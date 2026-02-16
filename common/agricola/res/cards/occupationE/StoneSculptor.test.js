const t = require('../../../testutil_v2.js')

describe('Stone Sculptor', () => {
  test('converts 1 stone to 1 VP + 1 food during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-sculptor-e153'],
        stone: 2,
        food: 4,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: onHarvest fires — convert 1 stone
    t.choose(game, 'Convert 1 stone to 1 VP + 1 food')

    t.testBoard(game, {
      dennis: {
        stone: 1,       // 2 - 1
        food: 3,        // 4 + 2 (DL) + 1 (sculptor) - 4 (feeding)
        bonusPoints: 1,
        reed: 1,
        occupations: ['stone-sculptor-e153'],
      },
    })
  })

  test('can skip the conversion', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-sculptor-e153'],
        stone: 1,
        food: 4,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        food: 2,  // 4 + 2 (DL) - 4 (feeding)
        bonusPoints: 0,
        reed: 1,
        occupations: ['stone-sculptor-e153'],
      },
    })
  })

  test('does not trigger without stone', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-sculptor-e153'],
        food: 4,
        // no stone
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // No stone — Stone Sculptor does not fire, goes straight to feeding

    t.testBoard(game, {
      dennis: {
        stone: 0,
        food: 2,  // 4 + 2 (DL) - 4 (feeding)
        bonusPoints: 0,
        reed: 1,
        occupations: ['stone-sculptor-e153'],
      },
    })
  })
})
