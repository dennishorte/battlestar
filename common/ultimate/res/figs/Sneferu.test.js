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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).c).toBe(5)
  })
})
