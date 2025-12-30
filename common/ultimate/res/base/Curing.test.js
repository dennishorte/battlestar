Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Curing', () => {
  test('dogma: score card with {r}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'], // Has {r} biscuit
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    // Fire is auto-selected (only card with {r})
    request = t.choose(game, request, 'no') // Don't exchange

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Curing'],
        score: ['Fire'],
      },
    })
  })

  test('dogma: score card with {r}, then exchange', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'], // Has {r} biscuit
        hand: ['Tools', 'Agriculture'],
      },
      micah: {
        score: ['Mathematics', 'Optics'], // Mathematics is age 2, Optics is age 3 (highest)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    // Fire is auto-selected (only card with {r})
    request = t.choose(game, request, 'yes') // Exchange
    // micah is auto-selected (only opponent in 2-player game)
    // Optics is highest (age 3), so it gets exchanged with both hand cards

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Curing'],
        score: ['Fire'],
        hand: ['Optics'], // Optics (highest, age 3) exchanged to hand
      },
      micah: {
        score: ['Mathematics', 'Tools', 'Agriculture'], // Hand cards exchanged to score
      },
    })
  })

  test('dogma: score card with {r}, choose not to exchange', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'], // Has {r} biscuit
        hand: ['Tools'],
      },
      micah: {
        score: ['Mathematics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    // Fire is auto-selected (only card with {r})
    request = t.choose(game, request, 'no') // Don't exchange

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Curing'],
        score: ['Fire'],
        hand: ['Tools'],
      },
      micah: {
        score: ['Mathematics'],
      },
    })
  })

  test('dogma: multiple cards with {r}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'], // Has {r} biscuit
        green: ['Fishing'], // Has {r} biscuit
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    request = t.choose(game, request, 'Fishing') // Choose Fishing to score (multiple options)
    request = t.choose(game, request, 'no') // Don't exchange

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'],
        score: ['Fishing'],
      },
    })
  })

  test('dogma: exchange with multiple highest cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'],
        red: ['Fire'], // Has {r} biscuit
        hand: ['Tools'],
      },
      micah: {
        score: ['Optics', 'Engineering'], // Both age 3, both highest
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    // Fire is auto-selected (only card with {r})
    request = t.choose(game, request, 'yes') // Exchange
    // micah is auto-selected (only opponent in 2-player game)
    // Both Mathematics and Engineering are highest (age 3), so both get exchanged

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Curing'],
        score: ['Fire'],
        hand: ['Optics', 'Engineering'], // Both highest (age 3) exchanged to hand
      },
      micah: {
        score: ['Tools'], // Hand card exchanged to score
      },
    })
  })

  test('dogma: you lose (no cards with {r})', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Curing'], // Tools has no {r} biscuit
        green: ['The Wheel'], // The Wheel has no {r} biscuit
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Curing')
    // No cards with {r} to score (Curing itself is excluded), so player loses

    t.testGameOver(request, 'micah', 'Curing') // Micah wins when Dennis loses
  })
})
