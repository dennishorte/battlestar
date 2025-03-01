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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stethoscope')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stethoscope')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Stethoscope'],
        hand: ['Socialism', 'Nylon'],
      },
    })
  })
})
