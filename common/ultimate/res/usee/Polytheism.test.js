Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Polytheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Polytheism'],
        hand: ['Maze', 'Pilgrimage', 'Tomb', 'Woodworking', 'Symbology']
      },
      decks: {
        usee: {
          1: ['Assassination'],
        }
      }
    })

    let request
    request = game.run()

    request = t.choose(game, request, 'Dogma.Polytheism')
    t.testChoices(request, ['Maze', 'Pilgrimage', 'Tomb', 'Woodworking', 'Symbology'])

    request = t.choose(game, request, 'Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Pilgrimage', 'Assassination'],
        purple: ['Symbology', 'Polytheism'],
        hand: ['Maze', 'Tomb', 'Woodworking']
      },
    })
  })

})
