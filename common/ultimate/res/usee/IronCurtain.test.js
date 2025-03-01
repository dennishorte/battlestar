Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Iron Curtain', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Iron Curtain'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Iron Curtain')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Iron Curtain'],
      },
    })
  })

})