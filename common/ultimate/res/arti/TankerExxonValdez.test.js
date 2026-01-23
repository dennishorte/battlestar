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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testGameOver(request, 'dennis', 'Exxon Valdez')
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Exxon Valdez'],
      },
      scott: {
        red: ['Flight'],
      },
    })
  })
})
