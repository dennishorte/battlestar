Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Von Neumann', () => {

  describe('If you would meld a card, instead meld it and self-execute it.', () => {
    test('karma: meld card, meld and self-execute it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
          score: ['The Wheel', 'Agriculture'], // 2 cards in score
          hand: ['Calendar'], // Age 2 card to meld
        },
        decks: {
          base: {
            3: ['Engineering', 'Translation'], // Cards to draw when Calendar self-executes
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Calendar')
      // Karma triggers: instead of just melding Calendar, meld it and self-execute it
      // Calendar has dogma: "If you have more cards in your score pile than in your hand, draw two {3}."
      // dennis has 2 cards in score and 0 in hand (after melding), so condition is met
      // Calendar should self-execute and draw two age 3 cards

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
          blue: ['Calendar'], // Calendar melded and self-executed
          score: ['The Wheel', 'Agriculture'],
          hand: ['Engineering', 'Translation'], // Two age 3 cards drawn from Calendar's self-execution
        },
      })
    })
  })

  describe('If you would draw an {8}, first junk all cards in the {8} deck.', () => {
    test('karma: draw age 8 card, first junk all cards in age 8 deck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
        },
        decks: {
          base: {
            9: ['Fission'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: first junk all cards in the age 8 deck
      // After junking, the draw action should complete (possibly with no card if deck is empty)
      // If there's another request, it might be asking for something else - need to investigate

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
          hand: ['Fission'],
        },
      })
      t.testDeckIsJunked(game, 8)
    })

    test('karma: draw age 8 when deck is already empty', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
        },
        decks: {
          base: {
            9: ['Fission'], // Age 9 card available as fallback
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: first junk all cards in the age 8 deck (already empty, so no effect)
      // Then try to draw age 8 (fails since deck is empty, but draw action may allow choosing different age)
      // The draw action might fall back to available decks or allow re-selection

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Von Neumann'],
          hand: ['Fission'], // Draw action fell back to age 9 since age 8 was empty
        },
      })
      t.testDeckIsJunked(game, 8) // Deck should still be empty/junked
    })

  })

})
