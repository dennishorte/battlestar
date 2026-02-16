const t = require('../../../testutil_v2.js')

describe("Animal Tamer's Apprentice", () => {
  test('gives 1 sheep per unoccupied wood room at round start', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamers-apprentice-e168'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }], // 3 rooms
          pastures: [{ spaces: [{ row: 1, col: 1 }] }], // pasture for sheep
        },
        // 2 family members, 3 rooms = 1 unoccupied wood room
      },
    })
    game.run()

    // Round 2 starts, onRoundStart fires: 1 unoccupied wood room -> 1 sheep
    t.testBoard(game, {
      dennis: {
        animals: { sheep: 1 },
        occupations: ['animal-tamers-apprentice-e168'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
          pastures: [{ spaces: [{ row: 1, col: 1 }], sheep: 1 }],
        },
      },
    })
  })

  test('no animals if all rooms occupied', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamers-apprentice-e168'],
        // 2 rooms, 2 family members = 0 unoccupied rooms
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-tamers-apprentice-e168'],
      },
    })
  })
})
