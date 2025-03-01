Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Concealment', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Concealment'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Concealment')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Concealment'],
      },
    })
  })

})