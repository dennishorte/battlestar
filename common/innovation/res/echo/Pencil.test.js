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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pencil')
    const request3 = t.choose(game, request2, 'Sailing', 'Tools', 'Engineering')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'Experimentation')
    const request6 = t.choose(game, request5, 'auto')

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pencil'],
        forecast: ['Experimentation'],
        hand: ['Octant'],
      },
    })
  })
})
