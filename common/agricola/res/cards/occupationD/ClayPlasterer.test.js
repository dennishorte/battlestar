const t = require('../../../testutil_v2.js')

describe('Clay Plasterer', () => {
  // modifyRenovationCost: clay renovation = exactly 1 clay + 1 reed (flat, not per room)
  // modifyRoomCost: clay room = 3 clay + 2 reed

  test('clay renovation costs exactly 1 clay + 1 reed regardless of room count', () => {
    // Wood to clay: normally 2 clay + 1 reed (2 rooms).
    // With Clay Plasterer: exactly 1 clay + 1 reed (flat cost).
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-plasterer-d121'],
        roomType: 'wood',
        clay: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-plasterer-d121'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
      },
    })
  })

  test('does not affect stone renovation cost', () => {
    // Clay to stone: normally 2 stone + 1 reed (2 rooms).
    // Clay Plasterer only affects clay renovation, so no change.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-plasterer-d121'],
        roomType: 'clay',
        stone: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-plasterer-d121'],
        roomType: 'stone',
        stone: 0,
        reed: 0,
      },
    })
  })

  test('clay room costs 3 clay + 2 reed', () => {
    // Clay room normally costs 5 clay + 2 reed. With Clay Plasterer: 3 clay + 2 reed.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-plasterer-d121'],
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
        occupations: ['clay-plasterer-d121'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not affect wood room cost', () => {
    // Wood room costs 5 wood + 2 reed. Clay Plasterer only affects clay rooms.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-plasterer-d121'],
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
        occupations: ['clay-plasterer-d121'],
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
