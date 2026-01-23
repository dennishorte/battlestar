Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Knights Templar', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        red: ['Knights Templar', 'Metalworking'],
      },
      micah: {
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['Paper', 'Mapmaking', 'The Wheel'],
          splay: 'left',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Knights Templar')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        red: {
          cards: ['Knights Templar', 'Metalworking'],
          splay: 'left',
        },
        score: ['Paper'],
      },
      micah: {
        blue: ['Tools', 'Writing'],
        green: ['Mapmaking', 'The Wheel'],
      },
    })
  })

})
