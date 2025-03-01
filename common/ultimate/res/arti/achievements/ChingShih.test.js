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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Ching Shih')

    t.testChoices(request, ['micah, age 1', 'micah, age 2', 'micah, Monument'])

    request = t.choose(game, request, 'micah, age 2')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Ching Shih')

    t.testChoices(request, ['micah, age 1', 'micah, age 2', 'micah, Monument'])

    request = t.choose(game, request, 'micah, Monument')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Encyclopedia')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Philosophy')
    request = t.choose(game, request, 'Fermenting')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Philosophy')
    request = t.choose(game, request, 'Fermenting')

    t.testIsSecondPlayer(game)
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
