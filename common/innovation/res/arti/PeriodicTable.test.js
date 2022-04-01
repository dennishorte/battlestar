Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Periodic Table", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Periodic Table"],
        blue: ['Atomic Theory'],
        yellow: ['Canning'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory'],
        yellow: ['Canning'],
        purple: ['Lighting'],
      },
    })
  })

  test('dogma: meld over', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Periodic Table"],
        blue: ['Atomic Theory'],
        yellow: ['Canning'],
        red: ['Machine Tools'],
      },
      decks: {
        base: {
          7: ['Publications', 'Combustion'],
          8: ['Socialism']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Machine Tools, Atomic Theory')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Publications', 'Atomic Theory'],
        yellow: ['Canning'],
        purple: ['Socialism'],
        red: ['Combustion', 'Machine Tools'],
      },
    })
  })
})
