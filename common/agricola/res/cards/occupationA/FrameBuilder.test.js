const t = require('../../../testutil_v2.js')

describe('Frame Builder', () => {
  test('allows wood substitution when building clay room', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['frame-builder-a123'],
        roomType: 'clay',
        clay: 3, // Need 5 clay, but can substitute 2 clay with 1 wood
        wood: 1, // 1 wood to substitute for 2 clay
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Only 1 affordable option (substitution) — no cost choice presented
    // After building, no resources left — loop auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['frame-builder-a123'],
        clay: 0,
        wood: 0,
        reed: 0,
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('allows wood substitution when building stone room', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['frame-builder-a123'],
        roomType: 'stone',
        stone: 3,
        wood: 1,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['frame-builder-a123'],
        stone: 0,
        wood: 0,
        reed: 0,
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('does not offer substitution for wood rooms', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['frame-builder-a123'],
        roomType: 'wood',
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // No substitution available for wood rooms — only standard cost

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['frame-builder-a123'],
        wood: 0,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('player can choose standard cost when both are affordable', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['frame-builder-a123'],
        roomType: 'clay',
        clay: 5,
        wood: 1,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Both options affordable — choose standard cost
    t.choose(game, '5 clay, 2 reed')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['frame-builder-a123'],
        clay: 0,
        wood: 1, // Unused
        reed: 0,
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('player can choose substitution when both are affordable', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['frame-builder-a123'],
        roomType: 'clay',
        clay: 5,
        wood: 1,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Both options affordable — choose substitution
    t.choose(game, '3 clay, 2 reed, 1 wood')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['frame-builder-a123'],
        clay: 2, // 5 - 3
        wood: 0, // 1 - 1
        reed: 0, // 2 - 2
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })
})
