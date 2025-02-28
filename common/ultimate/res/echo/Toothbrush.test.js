Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Toothbrush", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Toothbrush'],
        hand: ['Tools', 'Sailing', 'Machinery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Toothbrush')

    t.testChoices(request2, [1, 3])

    const request3 = t.choose(game, request2, 3)
    const request4 = t.choose(game, request3, 'yellow')
    const request5 = t.choose(game, request4, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Toothbrush', 'Machinery'],
          splay: 'left'
        },
        hand: ['Tools', 'Sailing'],
      },
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => card.getAge() === 2)
      .length
    expect(achievements).toBe(2)
  })
})
