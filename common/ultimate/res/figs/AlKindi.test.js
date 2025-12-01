Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Al-Kindi', () => {

  describe('If you would draw a card for sharing, first draw two cards of the same value.', () => {
    test('karma: owner draws for sharing, draws two cards of same age first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Al-Kindi'], // Age 3, biscuits: hccp (has 'c')
          blue: ['Writing'], // Age 1, biscuits: hssc (has 's')
        },
        micah: {
          blue: ['Tools'], // Age 1, biscuits: hssc, dogmaBiscuit: s
        },
        decks: {
          base: {
            2: ['Construction', 'Mapmaking'],
            3: ['Engineering', 'Machinery']
          },
          figs: {
            3: ['Sejong the Great'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Al-Kindi'],
          blue: ['Writing'],
          hand: [
            'Mapmaking',  // Drew age 2 from Writing effect
            'Sejong the Great', // Drew age 3 figure for sharing bonus
            'Engineering', // Drew age 3 from karma
            'Machinery', // Drew age 3 from karma
          ],
        },
        micah: {
          blue: ['Tools'],
          hand: ['Construction'], // Drew age 2 from Writing effect
        },
      })
    })
  })

  describe('If another player would draw a card for sharing, first score a card from your hand.', () => {
    test('karma: opponent draws for sharing, owner scores from hand', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Tools'],
          purple: ['Al-Kindi'],
          hand: ['The Wheel', 'Mathematics'], // Cards to score
        },
        micah: {
          blue: ['Writing'], // Age 1, biscuits: hssc, dogmaBiscuit: s
        },
        decks: {
          base: {
            2: ['Construction', 'Mapmaking'],
            3: ['Alchemy'], // For Dennis's draw action
          },
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Writing')
      request = t.choose(game, request, 'The Wheel')

      t.testBoard(game, {
        dennis: {
          blue: ['Tools'],
          purple: ['Al-Kindi'],
          score: ['The Wheel'], // Scored from hand
          hand: ['Mathematics', 'Construction', 'Alchemy'], // Remaining hand
        },
        micah: {
          blue: ['Writing'],
          hand: ['Mapmaking', 'Sargon of Akkad'], // Drew age 2 from Writing effect + sharing bonus
        },
      })
    })
  })
})
