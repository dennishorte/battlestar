Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fingerprints', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fingerprints', 'Masonry'],
        green: {
          cards: ['Sailing', 'Clothing'],
          splay: 'right',
        },
        hand: ['Mathematics', 'Domestication'],
      },
      achievements: ['Tools', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fingerprints')
    request = t.choose(game, 'yellow')
    request = t.choose(game, 'dennis')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Fingerprints', 'Masonry'],
          splay: 'left',
        },
        green: {
          cards: ['Sailing', 'Clothing'],
          splay: 'right',
        },
        blue: ['Mathematics'],
        hand: ['Domestication'],
        safe: ['Construction'],
      },
    })
  })

})
