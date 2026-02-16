const t = require('../../../testutil_v2.js')

describe('Domestician Expert', () => {
  test('allows holding 2 sheep per adjacent room pair', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['domestician-expert-d148'],
      },
    })
    game.run()

    // Default 2 rooms (0,0) and (1,0) = 1 adjacent pair = 2 on card + 1 pet = 3
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['domestician-expert-d148'],
        pet: 'sheep',
        animals: { sheep: 3 },
      },
    })
  })

  test('capacity increases with more adjacent room pairs', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 5 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['domestician-expert-d148'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms in a column: (0,0), (1,0), (2,0) = 2 pairs
        },
      },
    })
    game.run()

    // 2 adjacent pairs = 4 on card + 1 pet = 5
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['domestician-expert-d148'],
        pet: 'sheep',
        animals: { sheep: 5 },
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
