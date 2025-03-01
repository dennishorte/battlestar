Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Reconnaissance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Reconnaissance'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Reconnaissance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Reconnaissance'],
      },
    })
  })

})