Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Subway', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Subway'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Subway')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Subway'],
      },
    })
  })

})