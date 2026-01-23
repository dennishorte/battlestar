Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Consulting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Consulting'],
        green: ['Mapmaking'],
      },
      micah: {
        score: ['The Wheel'],
      },
      decks: {
        base: {
          1: ['Tools'],
          10: ['Software'],
        },
        usee: {
          10: ['Fight Club'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Consulting')
    request = t.choose(game, 'Mapmaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Software', 'Consulting'],
        red: ['Fight Club'],
        green: ['Mapmaking'],
        score: ['The Wheel', 'Tools'],
      },
    })
  })

})
