Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Printing Press', () => {
  test('return and draw', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Coal', 'Mathematics'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Printing Press')
    t.choose(game, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Mathematics'],
        hand: ['Canning'],
      },
    })
  })

  test('do not return', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Coal', 'Mathematics'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Printing Press')
    t.choose(game)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Coal', 'Mathematics'],
      },
    })
  })

  test('splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press', 'Tools'],
        purple: ['Enterprise'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Printing Press')
    t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Printing Press', 'Tools'],
          splay: 'right',
        },
        purple: ['Enterprise'],
      },
    })
  })
})
