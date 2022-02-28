Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sneferu', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sneferu'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Fermenting', 'Canal Building'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sneferu', 'Fermenting', 'Canal Building'],
        hand: ['Tools'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Sneferu', 'Expansion')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sneferu'],
        green: ['The Wheel'],
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).c).toBe(5)
  })
})
