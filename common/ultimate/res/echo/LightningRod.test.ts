Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Lightning Rod", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Lightning Rod'],
        purple: ['Societies'],
        green: ['Sailing'],
      },
      micah: {
        purple: ['Enterprise', 'Code of Laws'],
        yellow: ['Perspective'],
      },
      decks: {
        base: {
          5: ['Coal', 'Astronomy'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Lightning Rod')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Lightning Rod'],
        red: ['Coal'],
        purple: ['Societies'],
      },
      micah: {
        purple: ['Code of Laws', 'Astronomy'],
        yellow: ['Perspective'],
      },
    })
    // TODO: test if the 6 deck is junked
  })
})
