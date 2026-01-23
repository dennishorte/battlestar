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
    request = t.choose(game, 'Dogma.Inhomogeneous Cosmology')

    // First loop
    request = t.choose(game, 'Paper')
    request = t.choose(game)

    // Second loop
    request = t.choose(game)
    request = t.choose(game, 'Agriculture')

    // Third loop
    request = t.choose(game, 'Reformation')
    request = t.choose(game, 'Navigation')

    // Fourth loop
    request = t.choose(game, 'Lighting')

    // Fifth loop
    request = t.choose(game)


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
