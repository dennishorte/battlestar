Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Buried Treasure', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Buried Treasure')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
      },
    })
  })

})