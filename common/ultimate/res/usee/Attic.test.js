Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Attic', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Attic'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Attic')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Attic'],
      },
    })
  })

})