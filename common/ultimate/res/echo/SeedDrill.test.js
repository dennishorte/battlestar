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
    request = t.choose(game, request)

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

  test('dogma: junk deck, not enough points', () => {
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

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
        achievements: [],
      },
      micah: {
        yellow: ['Machinery'],
      },
    })
  })

  test('dogma: junk deck, achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
        score: ['Software', 'Databases'],
      },
      micah: {
        blue: ['Calendar'],
        yellow: ['Machinery'],
      },
      junk: ['Gunpowder'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Seed Drill')
    request = t.choose(game, request, 3)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Seed Drill'],
        yellow: ['Agriculture'],
        score: ['Software', 'Databases'],
        achievements: ['Gunpowder'],
      },
      micah: {
        yellow: ['Machinery'],
      },
    })
  })
})
