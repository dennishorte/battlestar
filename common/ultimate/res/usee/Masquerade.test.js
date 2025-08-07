Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Masquerade', () => {

  test('dogma: no achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade', 'Mysticism'],
        hand: ['Tools', 'Optics'],
      },
      achievements: ['Domestication', 'Construction', 'Machinery', 'Anonymity']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Masquerade', 'Mysticism'],
          splay: 'left',
        },
        hand: ['Tools', 'Optics'],
        safe: ['Construction'],
      },
    })
  })

  test('dogma: get achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade', 'Mysticism'],
        hand: ['Tools', 'Optics', 'Reformation', 'Gunpowder'],
      },
      achievements: ['Domestication', 'Construction', 'Machinery', 'Experimentation', 'Anonymity']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Masquerade', 'Mysticism'],
          splay: 'left',
        },
        hand: ['Tools', 'Optics'],
        safe: ['Experimentation'],
        achievements: ['Anonymity'],
      },
    })
  })

})
