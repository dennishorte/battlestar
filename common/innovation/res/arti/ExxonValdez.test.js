Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Exxon Valdez', () => {

  test('dogma: game over with two players', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Exxon Valdez'],
      },
      micah: {
        green: ['The Wheel'],
        red: ['Coal'],
        score: ['Metalworking'],
        achievements: ['Enterprise'],
        hand: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testGameOver(request3, 'dennis', 'Exxon Valdez')
  })

  test('dogma: continue with three players', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'], numPlayers: 3 })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Exxon Valdez'],
      },
      micah: {
        green: ['The Wheel'],
        red: ['Coal'],
        score: ['Metalworking'],
        achievements: ['Enterprise'],
        hand: ['Sailing'],
      },
      scott: {
        red: ['Flight'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testBoard(game, {
      scott: {
        red: ['Flight'],
      },
    })
  })
})
