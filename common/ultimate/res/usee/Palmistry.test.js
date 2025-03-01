Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Palmistry', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Palmistry'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Palmistry')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Palmistry'],
      },
    })
  })

})