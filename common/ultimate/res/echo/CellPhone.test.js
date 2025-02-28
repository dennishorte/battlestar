Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Cell Phone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Cell Phone'],
        green: ['Databases', 'Sailing'],
        blue: ['Tools'],
      },
      decks: {
        base: {
          10: ['Software'],
        },
        echo: {
          10: ['Artificial Heart'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Cell Phone')
    const request3 = t.choose(game, request2, 'green')
    const request4 = t.choose(game, request3, 'Software')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Cell Phone'],
        green: {
          cards: ['Databases', 'Sailing'],
          splay: 'up'
        },
        blue: {
          cards: ['Tools', 'Software'],
          splay: 'up'
        },
        hand: ['Artificial Heart'],
      },
    })
  })
})
