Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('Su Song', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Su Song', 'Trade')
  })

  describe('If you would meld a card, first draw and meld a {3}. If the drawn card has no {l}, return it.', () => {
    test('karma: drawn card has {l}, keep it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Su Song'],
          hand: ['Construction'],
        },
        decks: {
          base: {
            3: ['Machinery'], // Has {l} biscuit (llhk), should be kept
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers first: draws and melds Machinery (has {l}, kept)
      // Then Construction is melded

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Su Song'],
          yellow: ['Machinery'], // Drawn and melded first, kept because it has {l}
          red: ['Construction'], // Then Construction was melded
        },
      })
    })

    test('karma: drawn card has no {l}, return it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Su Song'],
          hand: ['Construction'],
        },
        decks: {
          base: {
            3: ['Engineering'], // No {l} biscuit (khsk), should be returned
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers first: draws and melds Engineering (no {l}, returned)
      // Then Construction is melded

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Su Song'],
          red: ['Construction'], // Construction was melded
          // Engineering was drawn, melded, then returned (no {l})
        },
      })
    })
  })
})
