Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Whatchamacallit', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
        green: ['The Wheel'],
        red: ['Optics'],
        purple: ['Railroad'],
        score: ['Canning', 'Software']
      },
      decks: {
        base: {
          4: ['Reformation'],
          5: ['Astronomy'],
          8: ['Flight'],
          9: ['Computers'],
          11: ['Astrogeology'],
        },
        usee: {
          2: ['Password'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Whatchamacallit')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
        green: ['The Wheel'],
        red: ['Optics'],
        purple: ['Railroad'],
        score: ['Canning', 'Software', 'Reformation', 'Astrogeology', 'Astronomy', 'Flight', 'Computers', 'Password']
      },
    })
  })

})
