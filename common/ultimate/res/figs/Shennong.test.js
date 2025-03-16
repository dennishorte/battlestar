Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shennong', () => {


  test('karma: foreshadow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        forecast: ['Construction', 'The Wheel', 'Fermenting', 'Engineering'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          2: ['Calendar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        forecast: ['The Wheel', 'Engineering', 'Calendar'],
        score: ['Construction', 'Fermenting'],
        hand: ['Sailing'],
      },
    })
  })
})
