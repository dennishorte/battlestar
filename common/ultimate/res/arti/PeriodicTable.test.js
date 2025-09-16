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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Machine Tools, Atomic Theory')

    t.testIsFirstAction(request)
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
