Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Magic 8-Ball', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
    })
  })

})