Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Envelope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Envelope'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Red Envelope')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Red Envelope'],
      },
    })
  })

})