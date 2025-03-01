Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secretum Secretorum', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Secretum Secretorum'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secretum Secretorum')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Secretum Secretorum'],
      },
    })
  })

})