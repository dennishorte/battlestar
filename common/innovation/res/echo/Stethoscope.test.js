Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Stethoscope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Stethoscope'],
        yellow: ['Agriculture'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          7: ['Socialism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Stethoscope')
    const request3 = t.choose(game, request2, 'yellow')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Stethoscope'],
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'right'
        },
        hand: ['Socialism'],
      },
    })
  })

  test('dogma: meld blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Stethoscope'],
        hand: ['Atomic Theory'],
      },
      decks: {
        base: {
          7: ['Socialism'],
        },
        echo: {
          8: ['Nylon'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Stethoscope')

    t.dumpLog(game)

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Stethoscope'],
        hand: ['Socialism', 'Nylon'],
      },
    })
  })
})
