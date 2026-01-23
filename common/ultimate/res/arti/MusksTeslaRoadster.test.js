Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Musk's Tesla Roadster", () => {

  test('dogma: no cards to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Musk's Tesla Roadster"],
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software', 'Coal']
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Hypersonics'],
        score: ['Tools', 'Sailing'],
        museum: ['Museum 1', "Musk's Tesla Roadster"],
      },
      micah: {
        score: ['Software', 'Coal']
      }
    })
  })

  test('dogma: return cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Musk's Tesla Roadster"],
        green: ['Paper'],
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software', 'Coal']
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing', 'Paper'],
        museum: ['Museum 1', "Musk's Tesla Roadster"],
      },
      micah: {
        score: ['Software', 'Coal']
      }
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Musk's Tesla Roadster"],
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', "Musk's Tesla Roadster")
  })
})
