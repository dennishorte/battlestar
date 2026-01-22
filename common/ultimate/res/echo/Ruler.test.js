Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ruler", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Ruler'],
        red: ['Metalworking'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        },
        echo: {
          1: ['Bangle', 'Noodles'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ruler')
    request = t.choose(game, 'Noodles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Ruler'],
        red: ['Metalworking'],
        hand: ['Calendar'],
        forecast: ['Noodles'],
      },
    })
  })
})
