Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Santa', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Secret Santa'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret Santa')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Secret Santa'],
      },
    })
  })

})