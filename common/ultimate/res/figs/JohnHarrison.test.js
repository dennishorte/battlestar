Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Harrison', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['John Harrison'],
      },
      decks: {
        base: {
          6: ['Industrialization', 'Canning']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['John Harrison'],
        hand: ['Industrialization', 'Canning']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('John Harrison', 'Trade')
  })

  test('karma: share', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Writing']
      },
      micah: {
        green: ['John Harrison'],
        blue: ['Tools']
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting']
        },
        figs: {
          1: ['Homer'],
          6: ['Catherine the Great']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Writing')
    const request3 = t.choose(game, request2, 'figs')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Writing'],
        hand: ['Fermenting', 'Homer'],
      },
      micah: {
        green: ['John Harrison'],
        blue: ['Tools'],
        hand: ['Calendar', 'Catherine the Great']
      },
    })
  })
})
