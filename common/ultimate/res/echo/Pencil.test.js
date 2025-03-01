Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pencil", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Pencil'],
        hand: ['Sailing', 'Tools', 'Engineering'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder', 'Experimentation'],
        },
        echo: {
          5: ['Octant'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pencil')
    request = t.choose(game, request, 'Sailing', 'Tools', 'Engineering')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Experimentation')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pencil'],
        forecast: ['Experimentation'],
        hand: ['Octant'],
      },
    })
  })
})
