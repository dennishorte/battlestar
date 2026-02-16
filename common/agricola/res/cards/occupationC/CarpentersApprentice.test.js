const t = require('../../../testutil_v2.js')

describe("Carpenter's Apprentice", () => {
  // Card text: "Wood rooms cost you 2 woods less. Your 3rd and 4th stable each
  // cost you 1 wood less. Your 13th to 15th fence each cost you nothing."

  test('fences below 13 cost normal rate', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 4,
      },
    })
    game.run()

    // Build a single-space pasture in corner
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })

  test('reduces wood room cost by 2 via modifyRoomCost', () => {
    // Wood room normally costs 5 wood + 2 reed. With Carpenter's Apprentice: 3 wood + 2 reed.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        roomType: 'wood',
        wood: 3,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        roomType: 'wood',
        wood: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not reduce cost for clay rooms', () => {
    // Clay room costs 5 clay + 2 reed. Carpenter's Apprentice only affects wood.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
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
        occupations: ['carpenters-apprentice-c088'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('reduces 3rd stable cost by 1 wood', () => {
    // Normal stable costs 2 wood. 3rd stable with Carpenter's Apprentice: 1 wood.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 1,
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 0, col: 4 })

    t.testBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 0,
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('1st and 2nd stables cost normal price', () => {
    // 1st stable still costs 2 wood (no discount)
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    t.testBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 0,
        farmyard: {
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })
})
