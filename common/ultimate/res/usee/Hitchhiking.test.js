Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hitchhiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hitchhiking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
      },
    })
  })

})