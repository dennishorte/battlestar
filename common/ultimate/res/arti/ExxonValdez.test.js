Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Exxon Valdez', () => {

  test('dogma', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testGameOver(request, 'dennis', 'Exxon Valdez')
  })

  test('dogma', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      scott: {
        red: ['Flight'],
      },
    })
  })
})
