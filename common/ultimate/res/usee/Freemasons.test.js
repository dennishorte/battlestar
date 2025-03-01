Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Freemasons', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Freemasons')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
      },
    })
  })

})