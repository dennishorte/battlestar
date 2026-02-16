const t = require('../../../testutil_v2.js')

describe('Sculptor', () => {
  test('gives 1 food when using Clay Pit', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sculptor-d105'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,
        food: 1,
        occupations: ['sculptor-d105'],
      },
    })
  })

  test('gives 1 grain when using Western Quarry', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sculptor-d105'],
      },
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        stone: 1,
        grain: 1,
        occupations: ['sculptor-d105'],
      },
    })
  })

  test('does not trigger on unrelated action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sculptor-d105'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['sculptor-d105'],
      },
    })
  })
})
