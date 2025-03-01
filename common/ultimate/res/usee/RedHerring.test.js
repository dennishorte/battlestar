Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Herring', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Herring'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Red Herring')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Red Herring'],
      },
    })
  })

})