Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gilgamesh', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Gilgamesh'],
        hand: ['Homer', 'Construction'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testChoices(request2, ['Homer', 'Construction'])

    const request3 = t.choose(game, request2, 'Construction')

    t.testBoard(game, {
      dennis: {
        red: ['Gilgamesh'],
        hand: ['Homer', 'The Wheel'],
        score: ['Construction'],
      },
    })
  })

  test('karma: claim', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Gilgamesh'],
        purple: ['Homer'],
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).k).toBe(6)
  })

})
