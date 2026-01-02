Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fu Xi', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Fu Xi', 'Trade')
  })

  test('karma: draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Fu Xi'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.setBoard(game, {
      dennis: {
        green: ['Fu Xi'],
        hand: ['Tools'],
        score: ['Mapmaking'],
      },
    })
  })

})
