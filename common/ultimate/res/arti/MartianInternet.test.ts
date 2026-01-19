Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Martian Internet", () => {

  test('dogma: no leaves', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Martian Internet"],
      },
      decks: {
        arti: {
          4: ['Petition of Right'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 4)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Petition of Right'],
        museum: ['Museum 1', "Martian Internet"],
      },
    })
  })

  test('dogma: leaf, but not most', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Martian Internet"],
      },
      micah: {
        yellow: ['Agriculture'],
      },
      decks: {
        arti: {
          4: ['Moses'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 4)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Moses'],
        museum: ['Museum 1', "Martian Internet"],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })
  })

  test('dogma: leaf, with most', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Martian Internet"],
      },
      decks: {
        arti: {
          4: ['Moses'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 4)

    t.testGameOver(request, 'dennis', 'Martian Internet')
  })
})
