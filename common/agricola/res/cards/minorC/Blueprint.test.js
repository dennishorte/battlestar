const t = require('../../../testutil_v2.js')

describe('Blueprint', () => {
  test('can build Joinery on Minor Improvement action via Meeting Place', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['blueprint-c027'],
        wood: 2, stone: 2, // Joinery costs wood:2, stone:2; Blueprint reduces stone by 1
      },
    })
    game.run()

    // Dennis takes Meeting Place (startsPlayer + minor improvement)
    t.choose(game, 'Meeting Place')
    // Blueprint allows Joinery/Pottery/Basketmaker on minor improvement action
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        stone: 1, // Started with 2, paid 1 (Blueprint discount)
        minorImprovements: ['blueprint-c027'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('can build Pottery on Minor Improvement action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['blueprint-c027'],
        clay: 2, stone: 2, // Pottery costs clay:2, stone:2; Blueprint reduces stone by 1
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        stone: 1, // Started with 2, paid 1 (Blueprint discount)
        minorImprovements: ['blueprint-c027'],
        majorImprovements: ['pottery'],
      },
    })
  })

  test('can build Basketmaker Workshop on Minor Improvement action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['blueprint-c027'],
        reed: 2, stone: 2, // Basketmaker costs reed:2, stone:2; Blueprint reduces stone by 1
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, "Major Improvement.Basketmaker's Workshop (basketmakers-workshop)")

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        stone: 1, // Started with 2, paid 1 (Blueprint discount)
        minorImprovements: ['blueprint-c027'],
        majorImprovements: ['basketmakers-workshop'],
      },
    })
  })

  test('reduces stone cost by 1 for Joinery', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['blueprint-c027'],
        wood: 2, stone: 1, // Joinery normally costs wood:2, stone:2; Blueprint reduces to stone:1
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        wood: 0,
        stone: 0,
        minorImprovements: ['blueprint-c027'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('does not offer non-Blueprint majors on minor improvement action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['blueprint-c027'],
        // Has clay:2 for Fireplace (non-Blueprint major), but NO resources for any Blueprint major
        clay: 2,
      },
    })
    game.run()

    // Dennis takes Meeting Place
    t.choose(game, 'Meeting Place')
    // No Blueprint majors are affordable and no minors in hand, so player
    // cannot play anything. The engine auto-skips with "no affordable improvements".

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        clay: 2, // Untouched — Fireplace was not offered
        minorImprovements: ['blueprint-c027'],
      },
    })
  })
})
