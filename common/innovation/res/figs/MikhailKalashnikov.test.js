Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mikhail Kalashnikov', () => {

  test('inspire (plus, tuck non-red)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        hand: ['Canning']
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        yellow: ['Canning'],
        hand: ['Computers']
      },
    })
  })

  test('karma: tuck red then transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        hand: ['Coal']
      },
      micah: {
        red: ['Industrialization']
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')
    const request3 = t.choose(game, request2, 'transfer it')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        hand: ['Coal', 'Computers'],
        score: ['Industrialization']
      },
    })
  })

  test('karma: tuck red then execute', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        hand: ['Coal']
      },
      micah: {
        red: ['Industrialization']
      },
      decks: {
        base: {
          6: ['Canning'],
          9: ['Computers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')
    const request3 = t.choose(game, request2, 'execute it')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Mikhail Kalashnikov'],
        yellow: ['Canning'],
        hand: ['Coal', 'Computers'],
      },
      micah: {
        red: ['Industrialization']
      },
    })
  })

})
