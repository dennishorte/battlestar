const t = require('../../../testutil_v2.js')

describe('Wooden Hut Extender', () => {
  // Card text: "Wood rooms now cost you 1 reed, and additionally 5 wood through
  // round 5, 4 wood in rounds 6 and 7, and 3 wood in round 8 and later."

  test('wood room costs 5 wood + 1 reed through round 5', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 5,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('wood room costs 4 wood + 1 reed in round 6', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'Farm Expansion',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 4,
        reed: 1,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('wood room costs 3 wood + 1 reed in round 8', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Pig Market', 'Farm Expansion',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 3,
        reed: 1,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'wood',
        wood: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not affect clay rooms', () => {
    // Clay room still costs 5 clay + 2 reed
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
