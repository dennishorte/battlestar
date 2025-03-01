Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Ride-Hailing', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ride-Hailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ride-Hailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ride-Hailing'],
      },
    })
  })

})