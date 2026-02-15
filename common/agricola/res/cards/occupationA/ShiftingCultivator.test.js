const t = require('../../../testutil_v2.js')

describe('Shifting Cultivator', () => {
  test('onAction offers plow for 3 food when using wood accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Forest'],
      dennis: {
        occupations: ['shifting-cultivator-a091'],
        food: 5,
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Plow 1 field for 3 food')
    t.choose(game, '0,1')  // choose plow space (adjacent to default rooms)

    t.testBoard(game, {
      dennis: {
        occupations: ['shifting-cultivator-a091'],
        food: 2, // 5 - 3
        wood: 3,
        farmyard: { fields: [{ row: 0, col: 1 }] },
      },
    })
  })

  test('onAction allows skip plow', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Forest'],
      dennis: {
        occupations: ['shifting-cultivator-a091'],
        food: 5,
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['shifting-cultivator-a091'],
        food: 5,
        wood: 3,
      },
    })
  })
})
