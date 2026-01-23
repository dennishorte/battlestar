Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Counterfeiting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Counterfeiting'],
        blue: ['Software', 'Tools'],
        red: ['Optics'],
        purple: ['Mysticism', 'Monotheism'],
        score: ['Machinery', 'Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Counterfeiting')
    request = t.choose(game, 'Software')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Tools'],
        red: ['Optics'],
        purple: {
          cards: ['Mysticism', 'Monotheism'],
          splay: 'left',
        },
        score: ['Machinery', 'Domestication', 'Software', 'Counterfeiting'],
      },
    })
  })

})
