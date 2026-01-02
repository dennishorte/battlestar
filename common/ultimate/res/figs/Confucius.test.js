Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Confucius', () => {
  test('karma: owner dogmas card with {k}, choose age 2 deck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        red: ['Archery'], // Has {k} biscuit, age 1
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // Cards that would be transferred if Archery dogma executed
      },
      achievements: ['The Wheel', 'Mathematics'], // Achievements that could be junked
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    // After karma triggers, choose age 2 deck
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 2) // Age 2 deck was junked
    t.testBoard(game, {
      dennis: {
        purple: ['Confucius'],
        score: ['Archery'], // Archery was scored instead of dogmatized
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // No transfer occurred (Archery dogma did not execute)
      },
    })
  })

  test('karma: owner dogmas card with {k}, choose age 3 deck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        red: ['Archery'], // Has {k} biscuit, age 1
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'],
      },
      achievements: ['The Wheel', 'Mathematics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    // After karma triggers, choose age 3 deck
    request = t.choose(game, request, 3)

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 3) // Age 3 deck was junked
    t.testBoard(game, {
      dennis: {
        purple: ['Confucius'],
        score: ['Archery'], // Archery was scored instead of dogmatized
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // No transfer occurred
      },
    })
  })

  test('karma: does not trigger when dogmatizing card without {k}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        blue: ['Experimentation'], // No {k} biscuit (has {s})
        hand: [],
      },
      decks: {
        base: {
          5: ['Measurement'], // Card that will be drawn and melded by Experimentation's dogma ({5})
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')
    // Experimentation has a simple effect that just draws cards - no choices needed

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Confucius'],
        blue: ['Experimentation'], // Experimentation was not scored (karma did not trigger)
        green: ['Measurement'], // Card melded from Experimentation's dogma ({5})
        hand: [],
      },
      junk: [], // No deck was junked (karma did not trigger)
    })
  })

  test('karma: triggers for age 2 card with {k}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        red: ['Road Building'], // Has {k} biscuit, age 2
        hand: [],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Road Building')
    request = t.choose(game, request, 2) // Choose age 2 deck

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 2) // Age 2 deck was junked
    t.testBoard(game, {
      dennis: {
        purple: ['Confucius'],
        score: ['Road Building'], // Road Building was scored instead of dogmatized
        hand: [],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Construction'], // No cards were melded (Road Building dogma did not execute)
      },
    })
  })
})
