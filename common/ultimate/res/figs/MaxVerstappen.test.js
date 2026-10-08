Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Max Verstappen', () => {
  test('karma: dogma effect, return 0 cards, effect executes once, do not draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing's dogma: Draw and meld a {1}
        hand: ['Tools'], // Card in hand (not returned)
      },
      decks: {
        base: {
          1: ['Agriculture', 'Pottery'], // Agriculture for normal meld, Pottery for draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (0 cards returned)
    // chooseAndReturn with min: 0 - when returning nothing, just call t.choose with no arguments
    request = t.choose(game) // Return nothing (empty selection when min: 0)
    // Sailing's dogma effect executes once: draw and meld Agriculture

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing remains
        yellow: ['Agriculture'], // Agriculture melded by Sailing's dogma (yellow card)
        hand: ['Tools'], // Tools remains
      },
    })
  })

  test('karma: dogma effect, return 1 card, effect executes twice, draw {11}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing's dogma: Draw and meld a {1}
        hand: ['Tools'], // Card to return
      },
      decks: {
        base: {
          1: ['Agriculture', 'Pottery', 'Metalworking'], // Agriculture for first meld, Pottery for second meld, Metalworking for draw
          11: ['Fusion'], // Age 11 card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (1 card returned)
    request = t.choose(game, 'Tools') // Return Tools
    // Sailing's dogma effect executes twice:
    // First: draw and meld Agriculture
    // Second (repeated): draw and meld Pottery
    // Then draw {11}: Robotics

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing remains
        blue: ['Pottery'], // Pottery melded (blue card)
        yellow: ['Agriculture'], // Agriculture melded (yellow card)
        hand: ['Fusion'], // Fusion drawn by karma
      },
    })
  })

  test('karma: dogma effect, return 2 cards, effect executes 3 times, draw {11}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing's dogma: Draw and meld a {1}
        hand: ['Tools', 'Mathematics'], // Cards to return
      },
      decks: {
        base: {
          1: ['Agriculture', 'Pottery', 'Domestication'], // Cards to meld (3 cards for 3 executions)
          11: ['Fusion'], // Age 11 card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (2 cards returned)
    // chooseAndReturn allows selecting multiple cards at once
    request = t.choose(game, 'Tools', 'Mathematics') // Return both cards
    // Sailing's dogma effect executes 3 times (1 normal + 2 repeats):
    // First: draw and meld Agriculture
    // Second (repeated): draw and meld Pottery
    // Third (repeated): draw and meld Metalworking
    // Then draw {11}: Fusion

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Sailing'], // Sailing remains
        blue: ['Pottery'], // Pottery melded (blue card, second execution)
        yellow: ['Domestication', 'Agriculture'], // Domestication on top (third execution), Agriculture below (first execution)
        hand: ['Fusion'], // Fusion drawn by karma
      },
    })
  })

  test('karma: dogma effect with multiple effects, only repeats the specific effect', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Clothing'],
        hand: ['Tools', 'Mysticism', 'Navigation', 'Metalworking'], // Cards to return
      },
      micah: {
        red: ['Gunpowder'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          1: ['Agriculture', 'Sailing', 'Domestication', 'The Wheel'], // Cards for first effect (need 2 for scoring)
          11: ['Fusion', 'Hypersonics'], // Age 11 card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Clothing')
    // Pottery's first effect: return up to 3 cards, then draw and score equal to count
    // Karma triggers for first effect: return cards from hand
    request = t.choose(game, 'Metalworking') // Return Metalworking
    // First effect executes twice (1 normal + 1 repeat):
    // First: meld Mysticism
    request = t.choose(game, 'Mysticism')
    // Second (repeated): meld Tools (automatically)
    // Then draw {11}: Fusion

    // Intermediate test
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Clothing'],
        blue: ['Tools'],
        purple: ['Mysticism'],
        hand: ['Fusion', 'Navigation'], // Fusion drawn by karma
      },
      micah: {
        red: ['Gunpowder'],
        purple: ['Code of Laws'],
      },
    })

    request = t.choose(game, 'Navigation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Clothing'],
        blue: ['Tools'],
        purple: ['Mysticism'],
        hand: ['Fusion', 'Hypersonics'],
        score: ['Agriculture', 'Sailing', 'Domestication', 'The Wheel'],
      },
      micah: {
        red: ['Gunpowder'],
        purple: ['Code of Laws'],
      },
    })
  })

  test('karma: does not trigger when a demand is made of you', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Demand effect; dennis has more {k} than micah
      },
      micah: {
        red: ['Max Verstappen'], // Karma should NOT fire: micah is impacted, not executing
        hand: ['Tools', 'Coal'],
      },
      achievements: [],
      decks: {
        base: {
          1: ['Sailing'], // Card micah is demanded to draw
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // No karma prompt for micah. The demand just resolves:
    // micah draws a {1} (Sailing), then transfers the highest card in hand
    // (Coal) to dennis's hand. Archery's second effect has no targets.

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Coal'],
      },
      micah: {
        red: ['Max Verstappen'],
        hand: ['Tools', 'Sailing'],
      },
    })
  })

  test('karma: triggers for the player executing a demand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Mapmaking'], // Demand effect; dennis has more {c} than micah
        hand: ['Tools'], // Card to return for karma
      },
      micah: {
        score: ['Sailing'], // {1} to transfer to dennis's score pile
      },
      achievements: [],
      decks: {
        base: {
          1: ['Agriculture'], // Card dennis draws and scores via second effect
          11: ['Fusion'], // Card dennis draws via karma
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mapmaking')
    // dennis is executing the demand effect, so dennis's karma fires.
    request = t.choose(game, 'Tools') // Return Tools to repeat the demand once
    // Demand resolves against micah twice:
    //   First: micah transfers Sailing to dennis's score
    //   Second: micah's score pile is empty, no effect
    // Then dennis draws an {11} (Fusion) via karma
    // Second (non-demand) effect triggers karma again; return nothing.
    request = t.choose(game)
    // Second effect executes: a card was transferred, so draw and score a {1} (Agriculture)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Max Verstappen'],
        green: ['Mapmaking'],
        hand: ['Fusion'],
        score: ['Sailing', 'Agriculture'],
      },
      micah: {
        score: [],
      },
    })
  })

})
