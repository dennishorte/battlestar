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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Seed Drill')
    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'no')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Seed Drill')
    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'yes')

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
