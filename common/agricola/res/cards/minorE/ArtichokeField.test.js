const t = require('../../../testutil_v2.js')

describe('Artichoke Field', () => {
  test('gives 1 food when harvesting from field', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['artichoke-field-e072'],
        virtualFields: {
          'artichoke-field-e072': { crop: 'grain', cropCount: 2 },
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to complete the round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 grain from Artichoke Field → onHarvest gives +1 food
    // Feeding: -4 food (2 workers × 2)
    t.testBoard(game, {
      dennis: {
        grain: 2,  // 0 + 1(harvest from vf) + 1(Grain Seeds)
        food: 9,   // 10 + 2(DL) + 1(Artichoke) - 4(feed)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['artichoke-field-e072'],
      },
    })
  })

  test('no food when virtual field is empty', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['artichoke-field-e072'],
        // No virtualFields — field is empty
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to complete the round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: no harvest from empty Artichoke Field → no bonus food
    t.testBoard(game, {
      dennis: {
        grain: 1,  // from Grain Seeds
        food: 8,   // 10 + 2(DL) - 4(feed), no Artichoke bonus
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['artichoke-field-e072'],
      },
    })
  })
})
