Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Ninja', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Ninja'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ninja')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Ninja'],
      },
    })
  })

})