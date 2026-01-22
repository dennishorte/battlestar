Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Triad', () => {

  test('dogma: two cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Triad'],
        hand: ['Optics', 'Monotheism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Triad')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Triad'],
        hand: ['Optics', 'Monotheism'],
      },
    })
  })

  test('dogma: three cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Triad', 'Code of Laws'],
        blue: ['Mathematics'],
        hand: ['Optics', 'Monotheism', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Triad')
    request = t.choose(game, 'Monotheism')
    request = t.choose(game, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Triad', 'Code of Laws'],
          splay: 'right',
        },
        blue: ['Mathematics', 'Tools'],
        score: ['Optics'],
      },
    })
  })

})
