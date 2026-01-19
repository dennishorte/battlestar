Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Sandpaper')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Almanac')

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
    request = t.choose(game, request, 'Meld.Machinery')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Almanac')
    request = t.choose(game, request, 'auto')

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
