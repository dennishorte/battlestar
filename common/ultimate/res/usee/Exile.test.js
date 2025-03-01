Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Exile', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Exile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })
  })

})