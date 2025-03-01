Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Dark Web', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Dark Web'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dark Web')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Dark Web'],
      },
    })
  })

})