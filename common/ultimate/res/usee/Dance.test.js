Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Dance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Dance'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Dance'],
      },
    })
  })

})