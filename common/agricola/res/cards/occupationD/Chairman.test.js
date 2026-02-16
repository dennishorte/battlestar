const t = require('../../../testutil_v2.js')

describe('Chairman', () => {
  test('gives 1 food when owner uses Meeting Place', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['chairman-d139'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Chairman
        occupations: ['chairman-d139'],
      },
    })
  })

  test('gives 1 food to both when other player uses Meeting Place', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['chairman-d139'],
      },
    })
    game.run()

    // Micah goes first and uses Meeting Place
    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        food: 1, // 1 from Chairman (as card owner)
        occupations: ['chairman-d139'],
      },
      micah: {
        food: 2, // 1 from Meeting Place + 1 from Chairman
      },
    })
  })
})
