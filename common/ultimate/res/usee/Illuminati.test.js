Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Illuminati', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Illuminati'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Illuminati')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Illuminati'],
      },
    })
  })

})