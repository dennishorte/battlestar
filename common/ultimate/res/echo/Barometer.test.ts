Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Barometer", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Barometer'],
        forecast: ['Coal', 'Experimentation'],
      },
      micah: {
        purple: ['Chaturanga'],
      },
      decks: {
        echo: {
          5: ['Palampore'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Barometer')
    request = t.choose(game, request, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Barometer'],
        forecast: ['Palampore', 'Experimentation'],
        hand: ['Coal'],
      },
      micah: {
        purple: ['Chaturanga'],
      },
    })
  })
})
