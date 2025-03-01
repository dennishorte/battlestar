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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testChoices(request, ['Homer', 'Construction'])

    request = t.choose(game, request, 'Construction')

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

    let request
    request = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).k).toBe(6)
  })

})
