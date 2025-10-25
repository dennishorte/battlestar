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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.DeLorean DMC-12')
    request = t.choose(game, request, 'auto')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        hand: ['Software'],
        museum: ['Museum 1', 'DeLorean DMC-12'],
      },
      micah: {
        purple: ['Philosophy'],
        hand: ['Coal'],
      },
    })
  })
})
