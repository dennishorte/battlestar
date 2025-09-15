Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Coke", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coke'],
        blue: ['Thermometer'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          6: ['Industrialization'],
        },
        echo: {
          6: ['Steamboat'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Coke')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Coke'],
        blue: ['Thermometer'],
        purple: ['Enterprise'],
        forecast: ['Steamboat'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing', 'Clothing'],
        yellow: ['Perspective'],
        hand: ['Thermometer'],
        forecast: ['Coke'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          6: ['Industrialization'],
        },
        echo: {
          6: ['Steamboat'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Thermometer')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Coke'],
        green: ['Clothing'],
        score: ['Sailing', 'Perspective', 'Thermometer', 'Enterprise'],
        forecast: ['Steamboat'],
      },
    })
  })
})
