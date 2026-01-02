Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Trapping', () => {
  test('dogma: demand - opponent reveals hand and leader score pile, transfer matching color cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'], // Red card in score pile
      },
      micah: {
        hand: ['Archery', 'Curing', 'Tools'], // Archery is red (matches), Curing is blue, Tools is blue
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Trapping')
    // Demand effect: Micah reveals hand (Archery, Curing, Tools) and dennis's score pile (Fire)
    // Transfer all cards in micah's hand matching colors in dennis's score pile
    // Fire is red, so transfer Archery (red) to dennis's hand

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'],
        hand: ['Archery'], // Archery transferred (red matches red in score)
      },
      micah: {
        hand: ['Curing', 'Tools'], // Curing and Tools not transferred (blue doesn't match red)
      },
    })
  })

  test('dogma: demand - transfer multiple cards matching different colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire', 'Curing'], // Fire is red, Curing is blue
      },
      micah: {
        hand: ['Archery', 'Tools', 'Fishing'], // Archery is red, Tools is blue, Fishing is green
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Trapping')
    // Demand effect: Micah reveals hand and dennis's score pile
    // Transfer all cards matching colors: Archery (red matches Fire), Tools (blue matches Curing)
    // Fishing (green) doesn't match, so not transferred
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire', 'Curing'],
        hand: ['Archery', 'Tools'], // Both transferred (red and blue match)
      },
      micah: {
        hand: ['Fishing'], // Fishing not transferred (green doesn't match)
      },
    })
  })

  test('dogma: demand - no matching colors, nothing transferred', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'], // Red card in score pile
      },
      micah: {
        hand: ['Curing', 'Tools'], // Both are blue, no red cards
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Trapping')
    // Demand effect: Micah reveals hand and dennis's score pile
    // No cards in micah's hand match red (Fire), so nothing transferred

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'],
        hand: [], // No cards transferred
      },
      micah: {
        hand: ['Curing', 'Tools'], // All cards remain (no matching colors)
      },
    })
  })

  test('dogma: demand - opponent has empty hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'], // Red card in score pile
      },
      micah: {
        hand: [], // Empty hand
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Trapping')
    // Demand effect: Micah reveals empty hand and dennis's score pile
    // No cards to transfer

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: ['Fire'],
        hand: [], // No cards transferred
      },
      micah: {
        hand: [], // Empty hand remains empty
      },
    })
  })

  test('dogma: demand - leader has empty score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: [], // Empty score pile
      },
      micah: {
        hand: ['Archery', 'Curing'], // Has cards in hand
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Trapping')
    // Demand effect: Micah reveals hand and dennis's empty score pile
    // No colors in score pile to match, so nothing transferred

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Trapping'],
        score: [],
        hand: [], // No cards transferred (no colors to match)
      },
      micah: {
        hand: ['Archery', 'Curing'], // All cards remain (no matching colors)
      },
    })
  })
})
