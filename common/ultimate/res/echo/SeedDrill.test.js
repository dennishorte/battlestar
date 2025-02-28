Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Seed Drill", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
      },
      micah: {
        blue: ['Calendar'],
        yellow: ['Machinery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Seed Drill')
    const request3 = t.choose(game, request2, 3)
    const request4 = t.choose(game, request3, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
      },
      micah: {
        yellow: ['Machinery'],
      },
    })
  })

  test('dogma: add achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
      },
      micah: {
        blue: ['Calendar'],
        yellow: ['Machinery'],
      },
      achievements: ['Translation'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Seed Drill')
    const request3 = t.choose(game, request2, 3)
    const request4 = t.choose(game, request3, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
      },
      micah: {
        yellow: ['Machinery'],
      },
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => !card.isSpecialAchievement)
    expect(achievements.length).toBe(2)
  })
})
