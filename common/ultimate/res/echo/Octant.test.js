Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Octant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Octant'],
        blue: ['Chemistry'],
      },
      micah: {
        red: ['Coal'],
        blue: ['Pottery'],
        green: ['The Wheel'],
        yellow: ['Canning'],
      },
      decks: {
        echo: {
          6: ['Bifocals', 'Indian Clubs'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Octant')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Octant'],
        blue: ['Pottery', 'Chemistry'],
        yellow: ['Canning'],
        forecast: ['Indian Clubs'],
      },
      micah: {
        red: ['Coal'],
        green: ['The Wheel'],
        forecast: ['Bifocals'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Octant'],
        hand: ['Chemistry'],
      },
      micah: {
        red: ['Coal'],
        blue: ['Pottery'],
        green: ['The Wheel'],
        yellow: ['Canning'],
      },
      decks: {
        echo: {
          6: ['Bifocals', 'Indian Clubs'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Chemistry')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Octant'],
        blue: ['Pottery', 'Chemistry'],
        yellow: ['Canning'],
        forecast: ['Bifocals'],
      },
      micah: {
        red: ['Coal'],
        green: ['The Wheel'],
      },
    })
  })
})
