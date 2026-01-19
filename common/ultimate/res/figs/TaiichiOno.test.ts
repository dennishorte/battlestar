Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Taiichi Ono', () => {
  describe('If you would dogma a card, first you may achieve a card from your hand with featured biscuit matching that card\'s featured biscuit, regardless of eligibility. If you don\'t, draw an {e}.', () => {
    test('karma: dogma card, achieve card from hand with matching featured biscuit', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Taiichi Ono'], // Owner of karma card
          red: ['Metalworking'], // Metalworking has featured biscuit 'k'
          hand: ['Archery'], // Archery has featured biscuit 'k' (matches Metalworking)
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Cards for Metalworking's dogma draws
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) dogmas Metalworking
      request = t.choose(game, request, 'Dogma.Metalworking')
      // Karma triggers: may achieve a card from hand with matching featured biscuit
      // Archery has featured biscuit 'k' (matches Metalworking's 'k')
      request = t.choose(game, request, 'Archery') // Choose to achieve Archery
      // Metalworking's dogma: draw and reveal {1}, if it has {k}, score it and repeat
      // Continue until a card without {k} is drawn

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Taiichi Ono'],
          red: ['Metalworking'],
          achievements: ['Archery'], // Archery was achieved by karma
          hand: ['Sailing'], // Sailing drawn by Metalworking's dogma (no {k}, kept in hand)
          score: ['Tools'], // Tools drawn by Metalworking's dogma (has {k}, scored)
        },
      })
    })

    test('karma: dogma card, choose not to achieve, draw {e}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Taiichi Ono'], // Owner of karma card
          red: ['Metalworking'], // Metalworking has featured biscuit 'k'
          hand: ['Archery'], // Archery has featured biscuit 'k' (matches Metalworking)
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Cards for Metalworking's dogma draws
            11: ['Fusion'], // Age 11 card to draw (e = 11)
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) dogmas Metalworking
      request = t.choose(game, request, 'Dogma.Metalworking')
      // Karma triggers: may achieve a card from hand with matching featured biscuit
      // Choose not to achieve (skip)
      request = t.choose(game, request) // Skip achieving (min: 0)
      // Since no card was achieved, draw an {e} (age 11)
      // Metalworking's dogma continues

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Taiichi Ono'],
          red: ['Metalworking'],
          hand: ['Archery', 'Fusion', 'Sailing'], // Archery remains, Fusion drawn by karma, Sailing by Metalworking
          score: ['Tools'], // Tools drawn by Metalworking's dogma (has {k}, scored)
        },
      })
    })

    test('karma: dogma card, no cards in hand with matching featured biscuit, draw {e}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Taiichi Ono'], // Owner of karma card
          red: ['Metalworking'], // Metalworking has featured biscuit 'k'
          hand: ['Tools'], // Tools has featured biscuit 's' (does not match Metalworking's 'k')
        },
        decks: {
          base: {
            1: ['Archery', 'Sailing'], // Cards for Metalworking's dogma draws (Archery has {k} and is scored first, Sailing doesn't)
            11: ['Fusion'], // Age 11 card to draw (e = 11)
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) dogmas Metalworking
      request = t.choose(game, request, 'Dogma.Metalworking')
      // Karma triggers: may achieve a card from hand with matching featured biscuit
      // Tools has featured biscuit 's' (does not match Metalworking's 'k')
      // No cards match, so chooseAndAchieve returns [] (min: 0)
      // Since no card was achieved, draw an {e} (age 11)
      // Metalworking's dogma continues

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Taiichi Ono'],
          red: ['Metalworking'],
          hand: ['Tools', 'Fusion', 'Sailing'], // Tools remains, Fusion drawn by karma, Sailing by Metalworking
          score: ['Archery'], // Archery drawn by Metalworking's dogma (has {k}, scored)
        },
      })
    })
  })
})
