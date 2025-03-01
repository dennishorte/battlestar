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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Margaret Thatcher')

    t.testChoices(request, ['Canning', 'Navigation', 'Margaret Thatcher'])

    request = t.choose(game, request, 'Navigation')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Margaret Thatcher'],
        score: ['Navigation', 'Canning'],
      },
    })
  })

})
