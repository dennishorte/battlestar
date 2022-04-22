Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Indian Clubs", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Indian Clubs'],
        score: ['Masonry', 'Gunpowder'],
        hand: ['Code of Laws', 'Engineering', 'Enterprise', 'Astronomy'],
      },
      micah: {
        score: ['Tools', 'Sailing', 'The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Indian Clubs')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        purple: ['Indian Clubs'],
        score: ['Masonry', 'Gunpowder', 'Code of Laws', 'Enterprise'],
        hand: ['Engineering', 'Astronomy'],
      },
      micah: {
        score: ['The Wheel'],
      },
    })
  })
})
