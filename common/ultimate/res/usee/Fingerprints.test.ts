Error.stackTraceLimit = 100
import t from '../../testutil.js'
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
    request = t.choose(game, request, 'Dogma.Fingerprints')
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'dennis')

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
