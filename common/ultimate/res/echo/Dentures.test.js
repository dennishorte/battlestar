Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Dentures", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Dentures'],
        blue: ['Tools', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Industrialization', 'Canning'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dentures')
    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'right'
        },
        score: ['Dentures'],
      },
    })
  })
})
