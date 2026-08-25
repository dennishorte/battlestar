const t = require('../../../testutil_v2.js')

describe('Grain Thief', () => {
  test('leaves grain on field and takes 1 from supply during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: Grain Thief offers before the field is harvested
    t.choose(game, 'Use Grain Thief')

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 1, // from supply via Grain Thief (field grain stays)
        food: 6, // 8 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
    })
  })

  test('leaves the last grain on a field', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    t.choose(game, 'Use Grain Thief')

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 1,
        food: 6,
        clay: 1,
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('can skip Grain Thief during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    t.choose(game, 'Skip')

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 1, // normal harvest only
        food: 6, // 8 + 2 - 4
        clay: 1, // Clay Pit accumulates 1
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('offers once per grain field', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'grain', cropCount: 3 },
          ],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    t.choose(game, 'Use Grain Thief') // field (2,0) stays at 2
    t.choose(game, 'Skip')            // field (2,1) harvests 3→2

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 2, // 1 from supply + 1 harvested
        food: 6,
        clay: 1,
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
  })
})
