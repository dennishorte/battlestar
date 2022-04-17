Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Coke", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coke'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          6: ['Industrialization', 'Classification'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Coke')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Coke'],
        purple: ['Enterprise'],
        forecast: ['Classification'],
      },
    })
  })
})
