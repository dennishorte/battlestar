Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
          3: ['Education'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'no')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['Sailing'],
        museum: ['Museum 1', 'Papyrus of Ani'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Tools'],
        museum: ['Museum 1', 'Papyrus of Ani'],
      },
    })
  })
})
