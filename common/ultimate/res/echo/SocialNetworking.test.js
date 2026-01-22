Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Social Networking", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Social Networking'],
        blue: ['Tools'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Navigation'],
        purple: ['Mysticism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Social Networking')
    request = t.choose(game, '{f}')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Social Networking'],
        score: ['Navigation', 'Mysticism', 'Tools'],
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
    request = t.choose(game, 'Dogma.Social Networking')
    request = t.choose(game, '{f}')
    request = t.choose(game, 'auto')

    t.testGameOver(request, 'dennis', 'Social Networking')
  })
})
