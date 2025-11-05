Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Susan Blackmore', () => {


  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      micah: {
        blue: ['Susan Blackmore'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
      },
      micah: {
        blue: ['Susan Blackmore'],
        score: ['Experimentation'],
      },
    })
  })
})
