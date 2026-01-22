Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Silk', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Silk'],
        hand: ['Agriculture', 'Domestication', 'The Wheel', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Silk')
    request = t.choose(game, 'Agriculture')
    request = t.choose(game, 'Domestication', 'The Wheel')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Silk'],
        yellow: ['Agriculture'],
        score: ['The Wheel', 'Domestication'],
        hand: ['Metalworking'],
      },
    })
  })

})
