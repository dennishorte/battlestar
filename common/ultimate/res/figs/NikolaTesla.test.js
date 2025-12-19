Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nikola Tesla', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Nikola Tesla', 'Expansion')
  })

  describe('If you would meld a card, first score an opponent\'s top card with neither {s} nor {i}. If no card in your score pile has a higher value than the scored card, draw a {9}.', () => {
    test('karma: meld card, score opponent top card without s or i, draw age 9 when no higher age in score pile', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          hand: ['Tools'], // Card to meld
        },
        micah: {
          green: ['The Wheel'], // Top card without s or i
        },
        decks: {
          base: {
            9: ['Computers'], // Age 9 card to draw
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Tools') // Meld Tools
      // Karma triggers: score opponent's top card without s or i
      // Only The Wheel is available, so auto-selected
      // No card in score pile has higher age than The Wheel (age 1), so draw age 9

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          blue: ['Tools'], // Tools melded
          score: ['The Wheel'], // The Wheel scored
          hand: ['Computers'], // Age 9 card drawn
        },
        micah: {
          green: [], // The Wheel was scored
        },
      })
    })

    test('karma: meld card, score opponent top card, no draw when score pile has higher age', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          hand: ['Tools'], // Card to meld
          score: ['Mathematics'], // Age 2 card in score pile (higher than The Wheel age 1)
        },
        micah: {
          green: ['The Wheel'], // Top card without s or i (age 1)
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Tools') // Meld Tools
      // Karma triggers: score opponent's top card without s or i
      // Only The Wheel is available, so auto-selected
      // Score pile has Mathematics (age 2) which is higher than The Wheel (age 1), so no draw

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          blue: ['Tools'], // Tools melded
          score: ['Mathematics', 'The Wheel'], // Both cards in score pile
          hand: [], // No card drawn
        },
        micah: {
          green: [], // The Wheel was scored
        },
      })
    })

    test('karma: meld card, choose from multiple opponent top cards without s or i', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          hand: ['Tools'], // Card to meld
        },
        micah: {
          green: ['The Wheel'], // Age 1, no s or i
          red: ['Oars'], // Age 1, no s or i
        },
        decks: {
          base: {
            9: ['Computers'], // Age 9 card to draw
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Tools') // Meld Tools
      // Karma triggers: score opponent's top card without s or i
      request = t.choose(game, request, 'Oars') // Choose Oars to score
      // No card in score pile has higher age than Oars (age 1), so draw age 9

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Nikola Tesla'],
          blue: ['Tools'], // Tools melded
          score: ['Oars'], // Oars scored
          hand: ['Computers'], // Age 9 card drawn
        },
        micah: {
          red: [], // Oars was scored
          green: ['The Wheel'], // The Wheel remains
        },
      })
    })
  })

})
