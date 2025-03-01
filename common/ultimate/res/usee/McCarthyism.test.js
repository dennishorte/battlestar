Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('McCarthyism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['McCarthyism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.McCarthyism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['McCarthyism'],
      },
    })
  })

})