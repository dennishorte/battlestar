Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Email', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'city'] })
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Babylon', 'Email'],
          splay: 'right'
        }
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Babylon')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Babylon', 'Email'],
          splay: 'right'
        },
        forecast: ['Software']
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        green: ['Email'],
        yellow: ['Agriculture'],
        hand: ['Bangle'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          9: ['Computers'],
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Email')
    const request3 = t.choose(game, request2, 'Bangle')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Email'],
        yellow: ['Agriculture'],
        score: ['Calendar'],
        forecast: ['Computers', 'Software']
      },
    })
  })

})
