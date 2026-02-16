const t = require('../../../testutil_v2.js')

describe('Uncaring Parents', () => {
  test('gives 1 bonus point at harvest end with stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['uncaring-parents-e099'],
        roomType: 'stone',
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    // Play through 4 actions (2 players x 2 workers)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest fires: onHarvestEnd gives 1 bonus point for stone house
    // dennis: 8 food + 2 (Day Laborer) - 4 (feeding) = 6; grain: 1 (Grain Seeds)
    t.testBoard(game, {
      dennis: {
        bonusPoints: 1,
        roomType: 'stone',
        food: 6,
        grain: 1,
        occupations: ['uncaring-parents-e099'],
      },
    })
  })

  test('does not give bonus point without stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['uncaring-parents-e099'],
        roomType: 'wood',
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 0,
        food: 6,
        grain: 1,
        occupations: ['uncaring-parents-e099'],
      },
    })
  })
})
