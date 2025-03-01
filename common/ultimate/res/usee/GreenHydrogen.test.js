Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Green Hydrogen', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Green Hydrogen'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Green Hydrogen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Green Hydrogen'],
      },
    })
  })

})