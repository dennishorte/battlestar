Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Leonardo Da Vinci', () => {

  describe('If you would meld a card, first meld another card in your hand. If the other card is purple, draw three {4}, then score a top figure from anywhere.', () => {

    test('karma: meld a card, first meld a purple card, draw three {4}, score a top figure', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          hand: ['Philosophy', 'Construction'], // Philosophy is purple, Construction to meld
        },
        micah: {
          red: ['Yi Sun-Sin'], // Top figure to score
        },
        decks: {
          base: {
            4: ['Gunpowder', 'Printing Press', 'Experimentation'], // Three {4} cards to draw
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      request = t.choose(game, request, 'Yi Sun-Sin')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          purple: ['Philosophy'], // Melded first
          red: ['Construction'], // Then melded
          hand: ['Gunpowder', 'Printing Press', 'Experimentation'], // Three {4} cards drawn
          score: ['Yi Sun-Sin'], // Top figure scored
        },
        micah: {
          red: [],
        },
      })
    })

    test('karma: no other cards in hand to meld first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          hand: ['Construction'],
        },
        micah: {
          red: ['Yi Sun-Sin'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          red: ['Construction'], // Then melded
        },
        micah: {
          red: ['Yi Sun-Sin'],
        },
      })
    })

    test('karma: meld a card, first meld another non-purple card from hand', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          hand: ['Construction', 'Tools'],
        },
        micah: {
          red: ['Yi Sun-Sin'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Leonardo Da Vinci'],
          red: ['Construction'],
          blue: ['Tools'],
        },
        micah: {
          red: ['Yi Sun-Sin'],
        },
      })
    })
  })

})
