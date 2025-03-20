Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Perfume", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Perfume'],
        red: ['Engineering'],
        yellow: ['Machinery'],
        green: ['The Wheel'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        blue: ['Translation'],
      },
      decks: {
        base: {
          1: ['Writing'],
        },
        echo: {
          2: ['Toothbrush'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Perfume')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Perfume', 'Writing'],
        red: ['Construction', 'Engineering'],
        yellow: ['Machinery'],
        green: ['The Wheel'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Translation'],
        yellow: ['Toothbrush'],
      },
    })
  })
})
