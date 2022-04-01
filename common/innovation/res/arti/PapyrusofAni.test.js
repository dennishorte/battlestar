Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Papyrus of Ani", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Papyrus of Ani"],
        hand: ['Code of Laws'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        arti: {
          3: ['Necronomicon']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'arti')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Necronomicon'],
        hand: ['Engineering'],
      },
    })
  })

  test('dogma: no purple cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Papyrus of Ani"],
        hand: ['Tools'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Tools'],
      },
    })
  })
})
