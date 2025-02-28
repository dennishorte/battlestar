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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Kim Yu-Na')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Kim Yu-Na')
    const request3 = t.choose(game, request2, 'The Wheel')

    t.testGameOver(request3, 'dennis', 'Kim Yu-Na')
  })
})
