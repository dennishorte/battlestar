Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Fertilizer", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Fertilizer'],
        hand: ['Construction'],
        score: ['Monotheism', 'Canning'],
      },
      micah: {
        score: ['Tools', 'Fermenting', 'Engineering'],
      },
      decks: {
        echo: {
          2: ['Lever']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fertilizer')
    const request3 = t.choose(game, request2, 'Construction')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fertilizer'],
        hand: ['Fermenting', 'Monotheism'],
        score: ['Canning'],
        forecast: ['Lever'],
      },
      micah: {
        score: ['Tools', 'Engineering'],
      },
    })
  })

  test('dogma: return nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Fertilizer'],
        hand: ['Construction'],
        score: ['Monotheism', 'Canning'],
      },
      micah: {
        score: ['Tools', 'Fermenting', 'Engineering'],
      },
      decks: {
        echo: {
          2: ['Lever']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fertilizer')
    const request3 = t.choose(game, request2)
    const request4 = t.choose(game, request3, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fertilizer'],
        hand: ['Construction'],
        score: ['Monotheism', 'Canning'],
        forecast: ['Lever'],
      },
      micah: {
        score: ['Tools', 'Fermenting', 'Engineering'],
      },
    })
  })
})
