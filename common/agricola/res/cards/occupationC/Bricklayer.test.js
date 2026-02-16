const t = require('../../../testutil_v2.js')

describe('Bricklayer', () => {
  // Card text: "Each improvement and each renovation costs you 1 clay less.
  // Each room costs you 2 clay less."

  test('reduces clay cost of major improvement by 1', () => {
    // Pottery normally costs 2 clay + 2 stone. With Bricklayer: 1 clay + 2 stone.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        clay: 1,
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        majorImprovements: ['pottery'],
        clay: 0,
        stone: 0,
      },
    })
  })

  test('reduces clay cost of renovation by 1', () => {
    // Renovate wood→clay: normally 2 clay + 1 reed (2 rooms).
    // With Bricklayer: 1 clay + 1 reed.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'wood',
        clay: 1,
        reed: 1,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
      },
    })
  })

  test('reduces clay room cost by 2 via modifyRoomCost', () => {
    // Clay room normally costs 5 clay + 2 reed. With Bricklayer: 3 clay + 2 reed.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'clay',
        clay: 3,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not reduce cost for wood rooms', () => {
    // Wood room costs 5 wood + 2 reed. Bricklayer only affects clay.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'wood',
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'wood',
        wood: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
