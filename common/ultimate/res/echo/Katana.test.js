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
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Katana')

    t.testChoices(request, ['Archery', 'Fermenting', 'Mysticism'])

    request = t.choose(game, 'Fermenting', 'Mysticism')
    request = t.choose(game, 'auto')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Katana'],
        yellow: ['Masonry'],
        green: ['Comb'],
        purple: ['Bell'],
        score: ['Fermenting', 'Mysticism'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Writing'],
        green: ['Sailing'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Masonry'],
        green: ['Comb'],
        purple: ['Bell'],
        hand: ['Engineering'],
        forecast: ['Katana'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
        purple: ['Mysticism'],
      },
      achievements: [
        "Feudalism",
        "Fission",
        "Lighting",
        "Machine Tools",
        "Mobility",
        "Perspective",
        "Philosophy",
        "Pottery",
        "Robotics",
        "Statistics",
      ]
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Katana', 'Engineering'],
        yellow: ['Masonry'],
        green: ['Comb'],
        purple: ['Bell'],
        score: ['Mysticism'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
      },
      junk: [
        "Feudalism",
        "Fission",
        "Lighting",
        "Machine Tools",
        "Mobility",
        "Perspective",
        "Philosophy",
        "Pottery",
        "Robotics",
        "Statistics",
      ]
    })
  })
})
