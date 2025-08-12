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
          10: ['Software', 'Stem Cells', 'Databases'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Clock')
    request = t.choose(game, request, 'purple')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

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
