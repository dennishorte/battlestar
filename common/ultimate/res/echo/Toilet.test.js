Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Toilet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing'],
        blue: ['Perfume'],
        hand: ['Machinery'],
      },
      micah: {
        score: ['Sailing', 'Calendar', 'Translation'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          4: ['Shuriken'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Toilet')
    const request3 = t.choose(game, request2, 'Machinery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing', 'Shuriken'],
        blue: ['Perfume'],
        hand: ['Engineering'],
      },
      micah: {
        score: ['Sailing', 'Translation'],
      },
    })
  })
})
