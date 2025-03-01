Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Holography', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
      },
    })
  })

})