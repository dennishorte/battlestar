Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Bartholomew Roberts', () => {
  describe('If you would take a Draw action, instead score a top card with a {c} from anywhere.', () => {
    test('karma: Draw action replaced with scoring card with {c}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          red: ['Optics'], // Optics has {c} biscuit (ccch)
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: instead of drawing, score a top card with {c}
      request = t.choose(game, request, 'Optics')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          score: ['Optics'], // Optics was scored instead of drawing
        },
      })
    })

    test('karma: multiple cards with {c} available, choose which to score', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          red: ['Optics'], // Optics has {c} biscuit
          blue: ['Translation'], // Translation has {c} biscuit (hccc)
        },
        micah: {
          yellow: ['Skyscrapers'], // Skyscrapers has {c} biscuit
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: choose which card with {c} to score
      request = t.choose(game, request, 'Translation')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          red: ['Optics'],
          score: ['Translation'], // Translation was scored
        },
        micah: {
          yellow: ['Skyscrapers'],
        },
      })
    })

    test('karma: score opponent card with {c}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
        },
        micah: {
          yellow: ['Skyscrapers'], // Skyscrapers has {c} biscuit
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: score a top card with {c} from anywhere (including opponent)
      request = t.choose(game, request, 'Skyscrapers')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          score: ['Skyscrapers'], // Opponent's card was scored
        },
        micah: {
          yellow: [], // Card was removed from opponent's board
        },
      })
    })

    test('karma: only Bartholomew Roberts has {c}, it gets scored', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'], // Bartholomew Roberts has {c} biscuit (phc6)
          red: ['Archery'], // Archery does not have {c} biscuit
        },
        decks: {
          base: {
            5: ['Astronomy'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: score a top card with {c}
      // Only Bartholomew Roberts has {c}, so it gets scored

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: [], // Bartholomew Roberts was scored
          red: ['Archery'],
          score: ['Bartholomew Roberts'], // Bartholomew Roberts was scored instead of drawing
        },
      })
    })
  })

  describe('If you would draw a card, first claim an available achievement matching that card\'s value, regardless of eligibility.', () => {

    test('karma: drawing a card from dogma triggers achievement claim', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          red: ['Optics'], // Optics has {c} biscuit
          blue: ['Writing'],
        },
        achievements: ['Philosophy'],
        decks: {
          base: {
            2: ['Construction'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')
      // Writing's  dogma draws cards, but karma should NOT trigger
      // (only triggers on Draw action, not on draws from dogma effects)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Bartholomew Roberts'],
          red: ['Optics'], // Optics was not scored
          blue: ['Writing'],
          hand: ['Construction'], // Drew normally from dogma
          achievements: ['Philosophy'],
        },
      })
    })
  })
})
