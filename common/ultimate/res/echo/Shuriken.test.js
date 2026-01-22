Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Shuriken", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Shuriken'],
        green: ['Navigation'],
        blue: ['Encyclopedia'],
        purple: ['Code of Laws', 'Mysticism'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
        blue: ['Tools'],
        purple: ['Whataboutism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Shuriken')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shuriken'],
        green: ['Navigation'],
        blue: ['Tools', 'Encyclopedia'],
        purple: {
          cards: ['Whataboutism', 'Code of Laws', 'Mysticism'],
          splay: 'right'
        },
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Shuriken'],
        green: ['Navigation'],
        hand: ['Encyclopedia'],
        purple: ['Code of Laws', 'Mysticism'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
        blue: ['Tools'],
        purple: ['Whataboutism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Encyclopedia')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shuriken'],
        green: ['Navigation'],
        blue: ['Encyclopedia'],
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'right'
        },
        achievements: ['Tools', 'Whataboutism'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
      },
    })
  })

  test('dogma: was foreseen, but only one transferred', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Shuriken'],
        green: ['Navigation'],
        hand: ['Encyclopedia'],
        purple: ['Code of Laws', 'Mysticism'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
        purple: ['Whataboutism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Encyclopedia')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shuriken'],
        green: ['Navigation'],
        blue: ['Encyclopedia'],
        purple: {
          cards: ['Whataboutism', 'Code of Laws', 'Mysticism'],
          splay: 'right'
        },
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
      },
    })
  })
})
