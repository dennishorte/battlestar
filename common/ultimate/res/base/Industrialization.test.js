Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Industrialization', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Industrialization', 'Coal', 'Gunpowder'],
          splay: 'up',
        },
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up',
        },
      },
      decks: {
        base: {
          6: ['Machine Tools', 'Atomic Theory', 'Encyclopedia'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Industrialization')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Industrialization', 'Coal', 'Gunpowder', 'Machine Tools'],
          splay: 'right'
        },
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up',
        },
        blue: ['Atomic Theory', 'Encyclopedia']
      },
    })
  })

  test('dogma: has the most i biscuits', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Industrialization', 'Coal', 'Gunpowder'],
          splay: 'up',
        },
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up',
        },
        green: ['Bicycle'],
      },
      decks: {
        base: {
          6: ['Machine Tools', 'Atomic Theory', 'Encyclopedia'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Industrialization')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Gunpowder', 'Machine Tools'],
          splay: 'right'
        },
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up',
        },
        blue: ['Atomic Theory', 'Encyclopedia'],
        green: ['Bicycle'],
      },
    })
  })

})
