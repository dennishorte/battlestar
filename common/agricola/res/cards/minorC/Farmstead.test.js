const t = require('../../../testutil_v2.js')

describe('Farmstead', () => {
  test('gives 1 food when plowing a field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['farmstead-c048'],
        occupations: ['test-occupation-1'],
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2')

    t.testBoard(game, {
      dennis: {
        food: 1,
        occupations: ['test-occupation-1'],
        minorImprovements: ['farmstead-c048'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('no food when not using farmyard space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['farmstead-c048'],
        occupations: ['test-occupation-1'],
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['test-occupation-1'],
        minorImprovements: ['farmstead-c048'],
      },
    })
  })
})
