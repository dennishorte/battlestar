Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Photography", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Photography'],
        purple: ['Philosophy'],
        forecast: ['Mathematics'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        blue: ['Translation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Photography')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics', 'Photography'],
        purple: ['Philosophy'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        hand: ['Translation'],
      },
    })
  })

  test('dogma: History', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Photography'],
        purple: ['Philosophy'],
        red: {
          cards: ['Plumbing', 'Bangle', 'Horseshoes'],
          splay: 'up',
        },
        forecast: ['Mathematics'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        blue: ['Translation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Photography')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics', 'Photography'],
        purple: ['Philosophy'],
        red: {
          cards: ['Plumbing', 'Bangle', 'Horseshoes'],
          splay: 'up',
        },
        achievements: ['History'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
        hand: ['Translation'],
      },
    })
  })
})
