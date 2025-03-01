Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Astrology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrology'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Astrology'],
      },
    })
  })

})