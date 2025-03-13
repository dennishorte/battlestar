Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Inhomogeneous Cosmology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Inhomogeneous Cosmology'],
        red: ['Optics', 'Metalworking'],
        green: ['Paper'],
        purple: ['Reformation', 'Lighting'],
        hand: ['Agriculture', 'Navigation'],
      },

      decks: {
        usee: {
          11: ['Holography'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Inhomogeneous Cosmology')

    // First loop
    request = t.choose(game, request, 'Paper')
    request = t.choose(game, request)

    // Second loop
    request = t.choose(game, request)
    request = t.choose(game, request, 'Agriculture')

    // Third loop
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, 'Navigation')

    // Fourth loop
    request = t.choose(game, request, 'Lighting')

    // Fifth loop
    request = t.choose(game, request)


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Inhomogeneous Cosmology'],
        red: ['Optics', 'Metalworking'],
        yellow: ['Agriculture'],
        green: ['Navigation'],
        hand: ['Holography'],
      },
    })
  })

})
