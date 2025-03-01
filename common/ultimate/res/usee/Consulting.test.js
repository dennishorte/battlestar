Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Consulting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Consulting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Consulting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Consulting'],
      },
    })
  })

})