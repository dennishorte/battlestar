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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Coke')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Coke'],
        purple: ['Enterprise'],
        forecast: ['Classification'],
      },
    })
  })
})
