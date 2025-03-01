Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cabal', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Cabal'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cabal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Cabal'],
      },
    })
  })

})