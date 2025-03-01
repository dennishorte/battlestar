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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Writing')
    request = t.choose(game, request, 'figs')

    t.testIsSecondPlayer(game)
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
