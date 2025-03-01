Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Escape Room', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Escape Room')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
      },
    })
  })

})