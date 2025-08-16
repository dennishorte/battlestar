Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Kaleidoscope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Kaleidoscope'],
        green: ['Sailing', 'The Wheel'],
      },
      decks: {
        echo: {
          7: ['Jeans'],
        }
      },
      achievements: ['Masonry', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Kaleidoscope')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Kaleidoscope'],
        green: {
          cards: ['Jeans', 'Sailing', 'The Wheel'],
          splay: 'right',
        }
      },
      junk: ['Construction'],
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing', 'The Wheel'],
        hand: ['Lighting'],
        forecast: ['Kaleidoscope'],
      },
      decks: {
        echo: {
          7: ['Jeans'],
        }
      },
      achievements: ['Masonry', 'Construction', 'Mathematics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Lighting')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'Construction')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Kaleidoscope', 'Lighting'],
        green: {
          cards: ['Jeans', 'Sailing', 'The Wheel'],
          splay: 'right',
        }
      },
      junk: ['Construction', 'Masonry'],
    })
  })
})
