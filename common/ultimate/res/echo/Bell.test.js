Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bell", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Bell'],
        hand: ['Canning'],
      },
      decks: {
        echo: {
          1: ['Bangle'],
          2: ['Pagoda'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bell')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Bell'],
        score: ['Canning'],
        forecast: ['Bangle', 'Pagoda'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Monotheism'],
        forecast: ['Bell'],
        hand: ['Canning', 'Code of Laws', 'The Wheel'],
      },
      micah: {
        hand: ['Coal'],
      },
      decks: {
        echo: {
          1: ['Bangle'],
          2: ['Pagoda'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Code of Laws')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Bell', 'Code of Laws', 'Monotheism'],
        score: ['Canning'],
        forecast: ['Bangle', 'Pagoda'],
      },
      micah: {}
    })
  })
})
