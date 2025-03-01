Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Katana", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Katana'],
        yellow: ['Masonry'],
        green: ['Comb'],
        purple: ['Bell'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Fermenting'],
        blue: ['Writing'],
        green: ['Sailing'],
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Katana')

    t.testChoices(request, ['Archery', 'Fermenting', 'Mysticism'])

    request = t.choose(game, request, 'Fermenting', 'Mysticism')
    request = t.choose(game, request, 'auto')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Katana'],
        yellow: ['Masonry'],
        green: ['Comb'],
        purple: ['Bell'],
        score: ['Fermenting', 'Mysticism'],
        forecast: ['Gunpowder'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Writing'],
        green: ['Sailing'],
      },
    })
  })
})
