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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Katana')

    t.testChoices(request2, ['Archery', 'Fermenting', 'Mysticism'])

    const request3 = t.choose(game, request2, 'Fermenting', 'Mysticism')
    const request4 = t.choose(game, request3, 'auto')


    t.testIsSecondPlayer(request4)
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
