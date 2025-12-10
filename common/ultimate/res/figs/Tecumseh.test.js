Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tecumseh', () => {
  test('karma: meld card, return top cards with {f} from each player, junk achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Banking'], // Age 5, has {f}
        hand: ['Tools'], // Card to meld
      },
      micah: {
        red: ['Coal'], // Age 5, has {f}
      },
      achievements: ['Statistics'], // Age 5 achievement
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')
    request = t.choose(game, request, 5) // Choose age 5
    request = t.choose(game, request, 'dennis.Banking', 'micah.Coal')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        blue: ['Tools'], // Tools melded
        green: [], // Banking returned
      },
      micah: {
        red: [], // Coal returned
      },
      junk: ['Statistics'], // Achievement junked
    })
  })

  test('karma: no cards with {f} of chosen age, still junk achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Banking'], // Age 5, has {f}, but we'll choose age 1
        hand: ['Tools'], // Card to meld
      },
      micah: {
        red: ['Coal'], // Age 5, has {f}, but we'll choose age 1
      },
      achievements: ['The Wheel'], // Age 1 achievement
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')
    request = t.choose(game, request, 1) // Choose age 1 - no cards with {f} at age 1

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        blue: ['Tools'], // Tools melded
        green: ['Banking'], // Banking not returned (age 5, not age 1)
      },
      micah: {
        red: ['Coal'], // Coal not returned (age 5, not age 1)
      },
      junk: ['The Wheel'], // Achievement junked
    })
  })

  test('karma: no achievement of chosen age available, still return cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Banking'], // Age 5, has {f}
        hand: ['Tools'], // Card to meld
      },
      micah: {
        red: ['Coal'], // Age 5, has {f}
      },
      achievements: ['The Wheel'], // Age 1 achievement, not age 5
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')
    request = t.choose(game, request, 5) // Choose age 5
    request = t.choose(game, request, 'dennis.Banking', 'micah.Coal')
    request = t.choose(game, request, 'auto')
    // No achievement to junk, so no additional request

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        blue: ['Tools'], // Tools melded
        green: [], // Banking returned
      },
      micah: {
        red: [], // Coal returned
      },
      standardAchievements: ['The Wheel'], // Achievement not junked (wrong age)
    })
  })

  test('karma: only some players have cards with {f} of chosen age', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Banking'], // Age 5, has {f}
        hand: ['Tools'], // Card to meld
      },
      micah: {
        red: ['Archery'], // Age 1, no {f}, and wrong age
      },
      achievements: ['Statistics'], // Age 5 achievement
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')
    request = t.choose(game, request, 5) // Choose age 5
    request = t.choose(game, request, 'dennis.Banking') // Only dennis has a card with {f} at age 5
    // Achievement selection happens automatically when only one option

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        blue: ['Tools'], // Tools melded
        green: [], // Banking returned
      },
      micah: {
        red: ['Archery'], // Archery not returned (no {f} and wrong age)
      },
      junk: ['Statistics'], // Achievement junked
    })
  })

  test('karma: multiple players with cards to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Banking'], // Age 5, has {f}
        hand: ['Tools'], // Card to meld
      },
      micah: {
        red: ['Coal'], // Age 5, has {f}
      },
      scott: {
        blue: ['Physics'], // Age 5, has {f}
      },
      achievements: ['Statistics'], // Age 5 achievement
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')
    request = t.choose(game, request, 5) // Choose age 5
    request = t.choose(game, request, 'dennis.Banking', 'micah.Coal', 'scott.Physics')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        blue: ['Tools'], // Tools melded
        green: [], // Banking returned
      },
      micah: {
        red: [], // Coal returned
      },
      scott: {
        blue: [], // Physics returned
      },
      junk: ['Statistics'], // Achievement junked
    })
  })
})
