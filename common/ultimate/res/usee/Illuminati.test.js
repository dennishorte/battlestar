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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Illuminati')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Illuminati'],
      },
    })
  })

})