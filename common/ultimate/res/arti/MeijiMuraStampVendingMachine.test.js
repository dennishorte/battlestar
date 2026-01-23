Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Meiji-Mura Stamp Vending Machine", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Meiji-Mura Stamp Vending Machine"],
        hand: ['Gunpowder'],
      },
      decks: {
        base: {
          4: ['Reformation', 'Experimentation', 'Enterprise'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation', 'Experimentation', 'Enterprise'],
        museum: ['Museum 1', 'Meiji-Mura Stamp Vending Machine'],
      },
    })
  })

  test('dogma: not all the same value', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Meiji-Mura Stamp Vending Machine"],
        hand: ['Gunpowder'],
      },
      decksExact: {
        base: {
          4: ['Reformation'],
          5: ['Coal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation', 'Gunpowder', 'Coal'],
        museum: ['Museum 1', 'Meiji-Mura Stamp Vending Machine'],
      },
    })
    t.testDeckIsJunked(game, 5)
  })
})
