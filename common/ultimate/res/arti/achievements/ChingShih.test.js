Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe("Ching Shih", () => {

  test('karma: when-meld (numbered achievements)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        hand: ["Ching Shih"],
      },
      micah: {
        achievements: ['The Wheel', 'Calendar', 'Monument'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Ching Shih')

    t.testChoices(request2, ['micah, age 1', 'micah, age 2', 'micah, Monument'])

    const request3 = t.choose(game, request2, 'micah, age 2')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Ching Shih'],
        achievements: ['Calendar'],
      },
      micah: {
        achievements: ['The Wheel', 'Monument'],
      },
    })
  })

  test('karma: when-meld (special achievements)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        hand: ["Ching Shih"],
      },
      micah: {
        achievements: ['The Wheel', 'Calendar', 'Monument'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Ching Shih')

    t.testChoices(request2, ['micah, age 1', 'micah, age 2', 'micah, Monument'])

    const request3 = t.choose(game, request2, 'micah, Monument')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Ching Shih'],
        achievements: ['Monument'],
      },
      micah: {
        achievements: ['The Wheel', 'Calendar'],
      },
    })
  })

  test('karma: when-meld from non-hand zone', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        score: ["Ching Shih"],
        blue: ['Encyclopedia'],
      },
      micah: {
        achievements: ['The Wheel', 'Calendar', 'Monument'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Encyclopedia')
    const request3 = t.choose(game, request2, 'yes')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Ching Shih'],
        blue: ['Encyclopedia'],
      },
      micah: {
        achievements: ['The Wheel', 'Calendar', 'Monument'],
      },
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ["Ching Shih"],
        purple: ['Philosophy'],
        hand: ['Fermenting'],
      },
      micah: {
        score: ['The Wheel', 'Calendar', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Philosophy')
    const request3 = t.choose(game, request2, 'Fermenting')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ["Ching Shih"],
        purple: ['Philosophy'],
        hand: ['Fermenting'],
        score: ['Calendar'],
      },
      micah: {
        score: ['The Wheel', 'Construction'],
      },
    })
  })

  test('karma: score (nothing to transfer)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ["Ching Shih"],
        purple: ['Philosophy'],
        hand: ['Fermenting'],
      },
      micah: {
        score: ['The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Philosophy')
    const request3 = t.choose(game, request2, 'Fermenting')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ["Ching Shih"],
        purple: ['Philosophy'],
        hand: ['Fermenting'],
      },
      micah: {
        score: ['The Wheel'],
      },
    })
  })
})
