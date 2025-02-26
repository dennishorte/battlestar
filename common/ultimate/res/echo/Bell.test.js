Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bell", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Bell'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Bell')
    const request3 = t.choose(game, request2, 'Canning')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Bell'],
        score: ['Canning'],
        forecast: ['Calendar'],
      },
    })
  })
})
