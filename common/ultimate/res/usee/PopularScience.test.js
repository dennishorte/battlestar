Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Popular Science', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Popular Science'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Popular Science')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Popular Science'],
      },
    })
  })

})