Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Calculator", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Calculator', 'Tools'],
        green: ['Navigation', 'Paper', 'Sailing'],
        yellow: ['Agriculture', 'Canning'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
        echo: {
          4: ['Shuriken'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Calculator')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Calculator', 'Tools'],
          splay: 'up'
        },
        green: ['Navigation'],
        score: ['Agriculture', 'Canning', 'Sailing', 'Paper'],
        hand: ['Shuriken', 'Lighting'],
      },
    })
  })

  test('dogma (11+)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Calculator'],
        green: ['Navigation', 'Paper', 'Self Service'],
        yellow: ['Agriculture', 'Canning'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Calculator')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Calculator'],
        green: ['Navigation', 'Paper'],
        yellow: ['Agriculture'],
        score: ['Canning', 'Self Service'],
      },
    })
  })
})
