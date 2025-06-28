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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fertilizer')
    request = t.choose(game, request, 'Construction')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 2)

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fertilizer')
    request = t.choose(game, request)
    request = t.choose(game, request, 2)

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
