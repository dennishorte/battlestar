const t = require('../../../testutil_v2.js')

describe('Veggie Lover', () => {
  test('converts grain + vegetable to 6 food during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['veggie-lover-e132'],
        grain: 2,
        vegetables: 1,
        food: 4, // enough to feed 2 people
      },
      micah: { food: 4 },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase, then onHarvest fires
    // Veggie Lover: convert 1 grain + 1 vegetable to 6 food
    t.choose(game, 'Convert 1 grain + 1 vegetable to 6 food')
    // No more vegetables, loop exits

    // Feeding: 6 + 6 (from DL + existing) - 4 (feed 2 people)
    t.testBoard(game, {
      dennis: {
        grain: 1,       // 2 - 1
        vegetables: 0,  // 1 - 1
        food: 8,        // 4 + 2 (DL) + 6 (VL conversion) - 4 (feeding)
        reed: 1,        // from Reed Bank
        occupations: ['veggie-lover-e132'],
      },
    })
  })

  test('can skip the conversion', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['veggie-lover-e132'],
        grain: 1,
        vegetables: 1,
        food: 4,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Veggie Lover fires, skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        vegetables: 1,
        food: 2,  // 4 + 2 (DL) - 4 (feeding)
        reed: 1,
        occupations: ['veggie-lover-e132'],
      },
    })
  })

  test('getEndGamePoints gives 2 points per pair of grain+vegetable up to 3', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['veggie-lover-e132'],
        grain: 3,
        vegetables: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: Veggie Lover onHarvest fires -- skip conversion to keep resources for scoring
    t.choose(game, 'Skip')

    // getEndGamePoints: min(3, 2, 3) = 2 pairs * 2 = 4 bonus (via getBonusPoints)
    // Score: fields 0 => -1, pastures 0 => -1, grain 3 => +1, veg 2 => +2
    // sheep 0 => -1, boar 0 => -1, cattle 0 => -1  => categories = -2
    // rooms 2 wood => 0, family 2 => 6, unused 13 => -13
    // bonus: 4 (VeggieLover getEndGamePoints)
    // Total: -2 + 0 + 6 - 13 + 4 = -5
    t.testBoard(game, {
      dennis: {
        grain: 3,
        vegetables: 2,
        food: 8,  // 10 + 2 (DL) - 4 (feeding)
        clay: 1,
        score: -5,
        occupations: ['veggie-lover-e132'],
      },
    })
  })
})
