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
        echo: {
          3: ['Almanac', 'Homing Pigeons'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sandpaper')
    request = t.choose(game, 'Tools', 'Sailing')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Almanac')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sandpaper'],
        blue: ['Almanac'],
        hand: ['Calendar', 'Homing Pigeons'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Sandpaper'],
        hand: ['Calendar', 'Tools', 'Sailing', 'Machinery'],
      },
      decks: {
        echo: {
          3: ['Almanac', 'Homing Pigeons'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Machinery')
    request = t.choose(game, 'Tools', 'Sailing')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Almanac')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sandpaper', 'Machinery'],
        blue: ['Almanac'],
        forecast: ['Calendar', 'Homing Pigeons'],
      },
    })
  })
})
