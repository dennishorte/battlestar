const t = require('../../../testutil_v2.js')

describe('Swagman', () => {
  test('onAction offers to use Grain Seeds after Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['swagman-a129'],
        wood: 5,
        reed: 2,
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Use Grain Seeds')

    t.testBoard(game, {
      dennis: {
        occupations: ['swagman-a129'],
        grain: 1,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }], fields: [{ row: 0, col: 2 }] },
      },
    })
  })

  test('allows skip after Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['swagman-a129'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['swagman-a129'],
        grain: 0,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }] },
      },
    })
  })
})
