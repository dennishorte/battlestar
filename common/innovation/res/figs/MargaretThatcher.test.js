Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Margaret Thatcher', () => {

  test('echo and karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Margaret Thatcher'],
        yellow: ['Canning'],
      },
      micah: {
        green: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Margaret Thatcher')

    t.testChoices(request2, ['Canning', 'Navigation', 'Margaret Thatcher'])

    const request3 = t.choose(game, request2, 'Navigation')
    const request4 = t.choose(game, request3, 'Canning')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Margaret Thatcher'],
        score: ['Navigation', 'Canning'],
      },
    })
  })

})
