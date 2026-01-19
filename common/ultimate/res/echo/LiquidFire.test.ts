Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Liquid Fire')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Liquid Fire')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Liquid Fire')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Liquid Fire'],
      },
    })
  })
})
