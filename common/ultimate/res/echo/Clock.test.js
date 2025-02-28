Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Clock", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Clock', 'Enterprise'],
      },
      micah: {
        hand: ['Gunpowder', 'Astronomy', 'Coal'],
        score: ['Canning', 'Banking'],
      },
      decks: {
        base: {
          10: ['Software', 'Stem Cells'],
        },
        echo: {
          10: ['Social Network'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Clock')
    const request3 = t.choose(game, request2, 'purple')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Clock', 'Enterprise'],
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
