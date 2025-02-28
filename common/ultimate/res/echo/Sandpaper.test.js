Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sandpaper", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Sandpaper'],
        hand: ['Calendar', 'Tools', 'Sailing'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
        echo: {
          3: ['Almanac'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sandpaper')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'Almanac')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sandpaper'],
        blue: ['Almanac'],
        hand: ['Calendar', 'Machinery'],
      },
    })
  })
})
