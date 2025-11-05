Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mikhail Kalashnikov', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')
    request = t.choose(game, request, 'transfer it')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')
    request = t.choose(game, request, 'execute it')

    t.testIsSecondPlayer(game)
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
