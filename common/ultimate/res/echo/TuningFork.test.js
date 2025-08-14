Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tuning Fork", () => {

  test('dogma: empty score pile; foreshadow; no meld; no repeat', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        hand: ['Candles', 'Domestication'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tuning Fork')
    request = t.choose(game, request, 'Candles')
    request = t.choose(game, request, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        hand: ['Domestication'],
        forecast: ['Candles'],
      },
    })
  })

  test('dogma: empty score pile; foreshadow; no meld; repeat', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        hand: ['Candles', 'Domestication'],
      },
      decks: {
        base: {
          1: ['Tools', 'Masonry'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tuning Fork')
    request = t.choose(game, request, 'Candles')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        yellow: ['Masonry'],
        green: ['Sailing'],
        forecast: ['Candles', 'Domestication'],
      },
    })
  })

  test('dogma: draw on echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        score: ['Navigation', 'Masonry'],
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Perspective'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tuning Fork')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Chemistry'],
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        yellow: ['Perspective'],
        score: ['Navigation', 'Masonry'],
        forecast: ['Gunpowder'],
      },
    })
  })
})
