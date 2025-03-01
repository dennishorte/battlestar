Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hiking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hiking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hiking'],
      },
    })
  })

})