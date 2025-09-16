Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Kim Yu-Na', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Kim Yu-Na'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Kim Yu-Na')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        score: ['Kim Yu-Na'],
      },
    })
  })

  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel'],
        purple: ['Kim Yu-Na'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Kim Yu-Na')
    request = t.choose(game, request, 'The Wheel')

    t.testGameOver(request, 'dennis', 'Kim Yu-Na')
  })
})
