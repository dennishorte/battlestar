Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Socialism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Socialism'],
        green: ['Invention', 'Paper'],
        hand: ['Code of Laws', 'The Wheel', 'Clothing']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Socialism')
    request = t.choose(game, request, 'Invention')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Socialism', 'Code of Laws'],
        green: ['Paper', 'Invention', 'The Wheel', 'Clothing'],
      },
    })
  })
})
