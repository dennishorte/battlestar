const t = require('../../../testutil_v2.js')

describe('Roughcaster', () => {
  test('onBuildRoom gives 3 food when building clay room', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['roughcaster-a110'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['roughcaster-a110'],
        clay: 0, // 5 - 5
        reed: 0, // 2 - 2
        food: 3, // from Roughcaster
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('onBuildRoom does not give food when building wood room', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['roughcaster-a110'],
        roomType: 'wood',
        wood: 5,
        reed: 2,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['roughcaster-a110'],
        wood: 0, // 5 - 5
        reed: 0, // 2 - 2
        food: 0, // no food from Roughcaster (wood room)
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('onRenovate gives 3 food when renovating from clay to stone', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['roughcaster-a110'],
        roomType: 'clay',
        stone: 2, // 1 stone per room × 2 rooms = 2 stone
        reed: 1,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Improvement choice auto-skips if no affordable improvements

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['roughcaster-a110'],
        stone: 0, // 2 - 2
        reed: 0, // 1 - 1
        food: 3, // from Roughcaster
        roomType: 'stone',
        score: dennis.calculateScore(),
      },
    })
  })

  test('onRenovate does not give food when renovating from wood to clay', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['roughcaster-a110'],
        roomType: 'wood',
        clay: 2, // 1 clay per room × 2 rooms = 2 clay
        reed: 1,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Improvement choice auto-skips if no affordable improvements

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['roughcaster-a110'],
        clay: 0, // 2 - 2
        reed: 0, // 1 - 1
        food: 0, // no food from Roughcaster (not clay→stone)
        roomType: 'clay',
        score: dennis.calculateScore(),
      },
    })
  })
})
