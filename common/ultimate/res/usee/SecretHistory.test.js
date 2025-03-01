Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret History', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Secret History'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret History')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Secret History'],
      },
    })
  })

})