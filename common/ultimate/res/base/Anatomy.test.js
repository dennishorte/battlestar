Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Anatomy', () => {
  test('returned, matching top card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics', 'The Wheel'],
        red: ['Archery'],
        blue: ['Calendar'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Anatomy')
    t.choose(game, 'The Wheel')  // Micah returns from score
    // Archery (age 1) matches The Wheel's age, so it's also returned

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics'],
        blue: ['Calendar'],
        // red: empty (Archery returned)
      },
    })
  })

  test('returned, no matching top card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics', 'The Wheel'],
        red: ['Gunpowder', 'Archery'],  // Gunpowder is top, age 4
        blue: ['Calendar'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Anatomy')
    t.choose(game, 'The Wheel')  // Micah returns from score
    // No top card matches age 1, so nothing else returned

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics'],
        red: ['Gunpowder', 'Archery'],  // Unchanged
        blue: ['Calendar'],
      },
    })
  })

  test('did not return', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Calendar'],
        // No score cards, so nothing to return
      },
    })
    game.run()
    t.choose(game, 'Dogma.Anatomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Calendar'],
      },
    })
  })
})
