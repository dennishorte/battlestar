Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Exoskeleton", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Exoskeleton'],
      },
      micah: {
        hand: ['Agriculture', 'Bangle', 'Construction', 'Canning'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Exoskeleton')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, '**base-1* (micah)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Exoskeleton'],
        score: ['Construction', 'Canning'],
        achievements: ['Agriculture'],
      },
      micah: {
        hand: ['Bangle'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Robocar'],
        forecast: ['Exoskeleton'],
      },
      micah: {
        hand: ['Agriculture', 'Bangle', 'Construction', 'Canning', 'Software'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Robocar')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, '**base-1* (micah)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Exoskeleton'],
        green: ['Robocar'],
        score: ['Construction', 'Canning', 'Software'],
        achievements: ['Agriculture', 'Bangle'],
      },
    })
  })
})
