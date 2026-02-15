const t = require('../../../testutil_v2.js')

describe('Mineralogist', () => {
  // Card text: "Each time you use a clay/stone accumulation space, you also
  // get 1 of the other good, stone/clay."
  // Card is 1+ players.

  test('Clay Pit gives 1 bonus stone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mineralogist-b122'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1,   // from Clay Pit
        stone: 1,  // bonus from Mineralogist
        occupations: ['mineralogist-b122'],
      },
    })
  })

  test('Western Quarry gives 1 bonus clay', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mineralogist-b122'],
      },
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        stone: 1,  // from Western Quarry
        clay: 1,   // bonus from Mineralogist
        occupations: ['mineralogist-b122'],
      },
    })
  })

  test('does not trigger on non-matching action spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mineralogist-b122'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['mineralogist-b122'],
      },
    })
  })
})
