Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Clock", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: {
          cards: ['Clock', 'Enterprise', 'Code of Laws', 'Monotheism', 'Mysticism'],
          splay: 'left',
        },
      },
      micah: {
        hand: ['Gunpowder', 'Astronomy', 'Coal'],
        score: ['Canning', 'Banking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Clock')
    request = t.choose(game, 'purple')
    request = t.choose(game, 'purple (5)')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Clock', 'Enterprise', 'Code of Laws', 'Monotheism', 'Mysticism'],
          splay: 'right',
        },
        score: ['Astronomy', 'Coal', 'Banking'],
      },
      micah: {
        hand: ['Gunpowder'],
        score: ['Canning'],
      },
    })
  })
})
