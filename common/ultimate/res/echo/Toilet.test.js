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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Toilet')
    request = t.choose(game, request, 'Machinery')

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
