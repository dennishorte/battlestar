Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Woodworking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Woodworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Woodworking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Woodworking'],
      },
    })
  })

})