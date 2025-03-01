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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sandpaper')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Almanac')

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
