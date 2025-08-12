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
        score: ['Sailing', 'Masonry', 'Calendar', 'Translation'],
      },
      decks: {
        echo: {
          3: ['Liquid Fire'],
          4: ['Shuriken'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Toilet')
    request = t.choose(game, request, 'Masonry')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Machinery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing', 'Shuriken'],
        blue: ['Perfume'],
        hand: ['Liquid Fire'],
      },
      micah: {
        score: ['Sailing', 'Translation'],
      },
    })
  })
})
