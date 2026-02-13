const t = require('../../../testutil_v2.js')

describe('Sculpture Course', () => {
  test('exchange 1 wood for 2 food at end of non-harvest round', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['sculpture-course-b053'],
        wood: 3,
        stone: 2,
      },
    })
    game.run()

    // Play through the round (4 actions for 2 players × 2 workers)
    t.choose(game, 'Day Laborer')   // dennis — +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis — +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Round ends, Sculpture Course fires for dennis
    t.choose(game, '1 wood → 2 food')

    t.testBoard(game, {
      dennis: {
        wood: 2,    // 3 - 1
        stone: 2,
        food: 4,    // 0 + 2 (day laborer) + 2 (sculpture course)
        grain: 1,   // from Grain Seeds
        minorImprovements: ['sculpture-course-b053'],
      },
    })
  })

  test('exchange 1 stone for 4 food', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['sculpture-course-b053'],
        wood: 0,
        stone: 3,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Only stone option available (no wood)
    t.choose(game, '1 stone → 4 food')

    t.testBoard(game, {
      dennis: {
        stone: 2,   // 3 - 1
        food: 6,    // 0 + 2 (day laborer) + 4 (sculpture course)
        grain: 1,
        minorImprovements: ['sculpture-course-b053'],
      },
    })
  })

  test('skip the exchange', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['sculpture-course-b053'],
        wood: 3,
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3,    // unchanged
        stone: 2,   // unchanged
        food: 2,    // only day laborer
        grain: 1,
        minorImprovements: ['sculpture-course-b053'],
      },
    })
  })

  test('not offered on harvest rounds', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 4,  // harvest round
      dennis: {
        minorImprovements: ['sculpture-course-b053'],
        wood: 3,
        stone: 2,
        food: 20,  // enough to survive harvest
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Round 4 is a harvest round — Sculpture Course should NOT fire
    // Game proceeds to harvest feeding phase, not Sculpture Course prompt
    // The next prompt should be harvest-related, not Sculpture Course
    const request = game.waiting
    const selector = request.selectors[0]
    expect(selector.title).not.toContain('Sculpture Course')
  })
})
