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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Toothbrush')

    t.testChoices(request, [1, 3])

    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'yes')

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
