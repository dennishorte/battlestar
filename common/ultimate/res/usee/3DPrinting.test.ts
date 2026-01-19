Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('3D Printing', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['3D Printing', 'Reformation', 'Lighting'],
        safe: ['Coal', 'Railroad'],
      },
      achievements: ['Tools', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.3D Printing')
    request = t.choose(game, request, 'Lighting')
    request = t.choose(game, request, '**base-3*')
    request = t.choose(game, request, 'Reformation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['3D Printing'],
        safe: ['Coal', 'Optics', 'Tools'],
        achievements: ['Railroad'],
      },
    })
  })

})
