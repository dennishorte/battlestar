Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('DeLorean DMC-12', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['DeLorean DMC-12'],
        blue: ['Mathematics', 'Calendar'],
        hand: ['Software'],
      },
      micah: {
        purple: ['Philosophy', 'Code of Laws'],
        hand: ['Coal'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.DeLorean DMC-12')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Calendar'],
      },
      micah: {
        purple: ['Code of Laws'],
      },
    })
  })

  test('dogma: does nothing when on display', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['DeLorean DMC-12'],
        blue: ['Mathematics'],
        hand: ['Software'],
      },
      micah: {
        purple: ['Philosophy'],
        hand: ['Coal'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        hand: ['Software'],
      },
      micah: {
        purple: ['Philosophy'],
        hand: ['Coal'],
      },
    })
  })
})
