Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Velcro Shoes", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
        hand: ['Computers'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Computers', 'Metalworking'],
        museum: ['Museum 1', 'Velcro Shoes'],
      },
      micah: {
        score: ['Coal'],
      },
    })
  })

  test('dogma: no hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
        score: ['Computers'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Computers'],
        hand: ['Metalworking'],
        museum: ['Museum 1', 'Velcro Shoes'],
      },
      micah: {
        score: ['Coal'],
      },
    })
  })

  test('dogma: I win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Velcro Shoes')
  })
})
