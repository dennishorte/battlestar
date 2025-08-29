Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Social Networking", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Social Networking'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Navigation'],
        purple: ['Mysticism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Social Networking')
    request = t.choose(game, request, '{f}')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Social Networking'],
        score: ['Navigation', 'Mysticism'],
      },
      micah: {
        yellow: ['Canning'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Social Networking'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Navigation', 'Mapmaking'],
        purple: ['Mysticism', 'Monotheism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Social Networking')
    request = t.choose(game, request, '{f}')
    request = t.choose(game, request, 'auto')

    t.testGameOver(request, 'dennis', 'Social Networking')
  })
})
