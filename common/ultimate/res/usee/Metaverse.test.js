Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Metaverse', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Metaverse'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Metaverse')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Metaverse'],
      },
    })
  })

})