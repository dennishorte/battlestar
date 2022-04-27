Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Liquid Fire", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Liquid Fire'],
      },
      micah: {
        red: ['Plumbing'],
        blue: ['Magnifying Glass'],
        hand: ['Sailing', 'Tools'],
      },
      decks: {
        echo: {
          3: ['Sunglasses'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Liquid Fire')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Liquid Fire'],
        forecast: ['Sunglasses'],
      },
      micah: {
        red: ['Plumbing'],
        blue: ['Magnifying Glass'],
        hand: ['Sailing', 'Tools'],
      },
    })
  })

  test('dogma: red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Liquid Fire'],
      },
      micah: {
        red: ['Plumbing'],
        blue: ['Magnifying Glass'],
        hand: ['Sailing', 'Tools'],
      },
      decks: {
        echo: {
          3: ['Katana'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Liquid Fire')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Liquid Fire'],
        score: ['Sailing', 'Tools'],
        forecast: ['Katana'],
      },
      micah: {
        red: ['Plumbing'],
        blue: ['Magnifying Glass'],
      },
    })
  })

  test('dogma: no bonuses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Liquid Fire'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Liquid Fire')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Liquid Fire'],
      },
    })
  })
})
