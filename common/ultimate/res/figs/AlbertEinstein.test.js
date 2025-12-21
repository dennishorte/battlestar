Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Albert Einstein', () => {

  test('karma decree', () => {
    t.testDecreeForTwo('Albert Einstein', 'Advancement')
  })

  describe('If you would take a Draw action, first meld all cards with {s} or {i} from each player\'s hand.', () => {
    test('karma: draw action, meld all cards with s or i from all hands', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Albert Einstein'],
          hand: ['Tools', 'Writing', 'Pottery'], // Tools and Writing have {s}, Pottery does not
        },
        micah: {
          hand: ['Mathematics', 'Clothing'], // Mathematics has {s}, Clothing does not
        },
        decks: {
          base: {
            1: ['Sailing'], // Age 1 card to draw (after melding, Writing (age 1) is top, so draws age 1)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.Draw a card') // Draw action
      // Karma triggers: meld all cards with {s} or {i} from all hands
      // Tools (s), Writing (s), Mathematics (s) get melded
      // Choose melding order: Tools first (goes to bottom), then Mathematics, then Writing last (goes to top, index 0)
      request = t.choose(game, request, 'Tools')
      request = t.choose(game, request, 'Mathematics')
      // Writing is auto-selected as the last card
      // Draw action completes automatically after melding
      // Pottery and Clothing remain in hand

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Writing', 'Mathematics', 'Tools', 'Albert Einstein'], // Writing (top), Mathematics, Tools, Albert Einstein (bottom) - stacks work like CS stacks
          hand: ['Sailing', 'Pottery'], // Sailing drawn (age 1, based on Writing top card), Pottery remains (no {s} or {i})
        },
        micah: {
          hand: ['Clothing'], // Clothing remains (no {s} or {i})
        },
      })
    })

    test('karma: no cards with s or i in hands, nothing melded', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Albert Einstein'],
          hand: ['Oars', 'Pottery'], // No {s} or {i}
        },
        micah: {
          hand: ['The Wheel', 'Clothing'], // No {s} or {i}
        },
        decks: {
          base: {
            8: ['Flight'], // Age 8 card to draw
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.Draw a card') // Draw action
      // Karma triggers but no cards with {s} or {i}, so nothing melded

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Albert Einstein'],
          hand: ['Flight', 'Oars', 'Pottery'], // Flight drawn, Oars and Pottery remain
        },
        micah: {
          hand: ['The Wheel', 'Clothing'], // All cards remain
        },
      })
    })

    test('karma: cards with i biscuit also get melded', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Albert Einstein'],
          hand: ['Tools', 'Software'], // Tools has {s}, Software has {i}
        },
        decks: {
          base: {
            10: ['Databases'], // Age 10 card to draw (after melding, Software (age 10) is top)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.Draw a card') // Draw action
      // Karma triggers: meld all cards with {s} or {i}
      // Tools ({s}) and Software ({i}) get melded
      // Choose melding order: Tools first (goes to bottom), then Software last (goes to top, index 0)
      request = t.choose(game, request, 'Tools')
      // Software is auto-selected as the last card
      // Draw action completes automatically after melding

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Software', 'Tools', 'Albert Einstein'], // Software (top, index 0), Tools, Albert Einstein (bottom) - stacks work like CS stacks
          hand: ['Databases'], // Databases drawn (age 10, based on Software top card)
        },
      })
    })
  })
})
