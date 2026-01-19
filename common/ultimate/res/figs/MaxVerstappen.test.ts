Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (0 cards returned)
    // chooseAndReturn with min: 0 - when returning nothing, just call t.choose with no arguments
    request = t.choose(game, request) // Return nothing (empty selection when min: 0)
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
    request = t.choose(game, request, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (1 card returned)
    request = t.choose(game, request, 'Tools') // Return Tools
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
    request = t.choose(game, request, 'Dogma.Sailing')
    // Karma triggers: return cards from hand (2 cards returned)
    // chooseAndReturn allows selecting multiple cards at once
    request = t.choose(game, request, 'Tools', 'Mathematics') // Return both cards
    request = t.choose(game, request, 'auto')
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
    request = t.choose(game, request, 'Dogma.Clothing')
    // Pottery's first effect: return up to 3 cards, then draw and score equal to count
    // Karma triggers for first effect: return cards from hand
    request = t.choose(game, request, 'Metalworking') // Return Metalworking
    // First effect executes twice (1 normal + 1 repeat):
    // First: meld Mysticism
    request = t.choose(game, request, 'Mysticism')
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

    request = t.choose(game, request, 'Navigation')

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

})
