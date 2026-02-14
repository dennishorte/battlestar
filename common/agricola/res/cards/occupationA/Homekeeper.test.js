const t = require('../../../testutil_v2.js')

describe('Homekeeper', () => {
  test('modifyRoomCapacity: no bonus for wood house', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }] }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getHouseCapacity()).toBe(2)
  })

  test('modifyRoomCapacity: +1 capacity when clay room adjacent to field and pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }] }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getHouseCapacity()).toBe(3)
  })

  test('modifyRoomCapacity: no bonus when room not adjacent to both field and pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['homekeeper-a085'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fields: [{ row: 2, col: 2 }],
          pastures: [{ spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getHouseCapacity()).toBe(2)
  })
})
