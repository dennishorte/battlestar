Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Teleprompter', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Teleprompter')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
    })
  })

})