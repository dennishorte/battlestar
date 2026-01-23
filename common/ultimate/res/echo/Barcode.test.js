Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Barcode", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        green: ['Barcode'],
        yellow: ['Agriculture', 'Canning'],
      },
      micah: {
        red: ['Plumbing'],
        yellow: ['Cell Phone'],
        blue: ['Human Genome'],
        score: ['Robotics', 'Flight', 'Construction', 'Software', 'Databases'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Barcode')
    request = t.choose(game, 'Construction')
    request = t.choose(game, 'Robotics')
    request = t.choose(game, 'Databases')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Barcode'],
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up'
        },
      },
      micah: {
        red: ['Plumbing'],
        yellow: ['Cell Phone'],
        blue: ['Human Genome'],
        score: ['Flight', 'Software'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture', 'Canning'],
        hand: ['Self Service'],
        forecast: ['Barcode'],
      },
      micah: {
        red: ['Plumbing'],
        yellow: ['Cell Phone'],
        blue: ['Human Genome'],
        score: ['Robotics', 'Flight', 'Construction', 'Software', 'Databases'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Self Service')
    request = t.choose(game, 'Construction')
    request = t.choose(game, 'Robotics')
    request = t.choose(game, 'Databases')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Barcode', 'Self Service'],
          splay: 'up',
        },
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up'
        },
      },
      micah: {
        red: ['Plumbing'],
        yellow: ['Cell Phone'],
        blue: ['Human Genome'],
        score: ['Flight', 'Software'],
      },
    })
  })
})
