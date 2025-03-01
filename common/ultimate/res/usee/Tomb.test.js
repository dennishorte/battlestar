Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Tomb', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Tomb'],
      },
    })
  })

})