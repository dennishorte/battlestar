Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dancing Girl', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Dancing Girl'],
      },
      micah: {
        purple: ['Philosophy', 'Code of Laws'],
        red: ['Construction'],
        yellow: ['Canal Building'],
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dancing Girl')
    const request3 = t.choose(game, request2, 'Construction')

    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        purple: ['Code of Laws'],
        yellow: ['Dancing Girl', 'Canal Building'],
        green: ['Sailing'],
      },
    })
  })

  test('dogma with empty yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Dancing Girl'],
      },
      micah: {
        purple: ['Philosophy', 'Code of Laws'],
        red: ['Construction'],
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dancing Girl')
    const request3 = t.choose(game, request2, 'Construction')

    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        purple: ['Code of Laws'],
        yellow: ['Dancing Girl'],
        green: ['Sailing'],
      },
    })
  })
})
