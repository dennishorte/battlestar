Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Terracotta Army", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Terracotta Army"],
        hand: ['Mapmaking', 'Pottery'],
      },
      micah: {
        green: ['Navigation'],
        hand: ['Agriculture', 'The Wheel'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Pottery'],
        hand: ['Mapmaking', 'Fermenting'],
        museum: ['Museum 1', 'Terracotta Army'],
      },
      micah: {
        hand: ['The Wheel'],
        score: ['Agriculture'],
      },
    })
  })

  test('dogma: nothing to score in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Terracotta Army"],
      },
      micah: {
        green: ['Navigation'],
        hand: ['Agriculture', 'The Wheel'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Terracotta Army'],
        hand: ['Fermenting'],
      },
      micah: {
        hand: ['The Wheel'],
        score: ['Agriculture'],
      },
    })
  })
})
