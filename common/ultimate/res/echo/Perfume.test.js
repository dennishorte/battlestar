Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Perfume", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Perfume'],
        red: ['Engineering'],
        green: ['The Wheel'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        blue: ['Translation'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Mathematics'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Perfume')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Perfume', 'Tools'],
        red: ['Construction', 'Engineering'],
        green: ['The Wheel'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Mathematics', 'Translation'],
      },
    })
  })
})
