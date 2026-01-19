Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Isaac Newton', () => {
  describe('If you would take a Draw action, first draw and reveal a {1} and transfer it to any player\'s board.', () => {
    test('karma: draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
        },
        decks: {
          base: {
            1: ['Domestication'],
            5: ['Coal']
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'micah')

      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          hand: ['Coal']
        },
        micah: {
          yellow: ['Domestication']
        }
      })
    })

    test('karma: does not trigger on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: ['The Wheel'],
        },
        decks: {
          base: {
            1: ['Domestication', 'Sailing'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')

      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: ['The Wheel'],
          hand: ['Domestication', 'Sailing'],
        },
      })
    })

    test('karma: draw action, transfer to self', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          yellow: [], // Empty yellow pile to receive transferred card
        },
        decks: {
          base: {
            1: ['Domestication'], // Age 1 card (yellow)
            5: ['Coal']
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'dennis') // Transfer to self

      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          yellow: ['Domestication'], // Transferred to dennis's yellow pile
          hand: ['Coal']
        },
      })
    })

    test('karma: draw action, transfer to different color pile', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
        },
        micah: {
          red: [], // Empty red pile
        },
        decks: {
          base: {
            1: ['Archery'], // Age 1 card (red)
            5: ['Coal']
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'micah')

      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          hand: ['Coal']
        },
        micah: {
          red: ['Archery'], // Transferred to micah's red pile
        },
      })
    })
  })

  describe('If you would dogma a card, first splay right every color on your board with a top card of that card\'s value.', () => {
    test('karma: dogma card, splay matching colors right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: ['The Wheel', 'Sailing'], // Age 1 (multiple cards for splay)
          red: ['Archery'], // Age 1 (only one red age 1 card exists, can't splay)
          yellow: ['Agriculture', 'Domestication'], // Age 1 (multiple cards for splay)
        },
        decks: {
          base: {
            1: ['Clothing', 'Metalworking'], // Cards for The Wheel's dogma
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel') // Dogma age 1 card

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          red: {
            cards: ['Archery'],
            splay: 'none', // Not splayed (only one card, can't splay)
          },
          yellow: {
            cards: ['Agriculture', 'Domestication'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          hand: ['Clothing', 'Metalworking'], // Cards drawn by The Wheel's dogma
        },
      })
    })

    test('karma: dogma card, splay matching colors', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: ['The Wheel', 'Sailing'], // Age 1 (multiple cards for splay)
          yellow: ['Agriculture', 'Domestication'], // Age 1 (multiple cards for splay)
        },
        decks: {
          base: {
            1: ['Clothing', 'Metalworking'], // Cards for The Wheel's dogma
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel') // Dogma age 1 card

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          yellow: {
            cards: ['Agriculture', 'Domestication'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          hand: ['Clothing', 'Metalworking'], // Cards drawn by The Wheel's dogma
        },
      })
    })

    test('karma: dogma card, multiple colors already splayed', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'], // Age 1 (multiple cards for splay)
            splay: 'left', // Already splayed left
          },
          yellow: {
            cards: ['Agriculture', 'Domestication'], // Age 1 (multiple cards for splay)
            splay: 'up', // Already splayed up
          },
        },
        decks: {
          base: {
            1: ['Clothing', 'Metalworking'], // Cards for The Wheel's dogma
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel') // Dogma age 1 card

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'],
            splay: 'right', // Changed to right (age 1 matches)
          },
          yellow: {
            cards: ['Agriculture', 'Domestication'],
            splay: 'right', // Changed to right (age 1 matches)
          },
          hand: ['Clothing', 'Metalworking'], // Cards drawn by The Wheel's dogma
        },
      })
    })

    test('karma: dogma card, only some colors match', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'], // Age 2 (multiple cards for splay)
          green: ['The Wheel', 'Sailing'], // Age 1 (won't splay - age doesn't match)
          red: ['Construction', 'Road Building'], // Age 2 (multiple cards for splay)
          yellow: ['Machinery'], // Age 3 (won't splay - age doesn't match, only one card anyway)
          purple: ['Philosophy'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy') // Dogma age 2 card
      request = t.choose(game, request)
      // Mathematics's dogma: optionally return a card and draw/meld one higher
      // Skip returning (min: 0)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'],
            splay: 'none', // Not splayed (age 1 doesn't match age 2)
          },
          red: {
            cards: ['Construction', 'Road Building'],
            splay: 'right', // Splayed right (age 2 matches)
          },
          yellow: {
            cards: ['Machinery'],
            splay: 'none', // Not splayed (age 3 doesn't match age 2)
          },
          purple: ['Philosophy'],
        },
      })
    })

    test('karma: dogma card, only matching color splayed', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: ['The Wheel', 'Sailing'], // Age 1 (multiple cards for splay)
          yellow: ['Agriculture', 'Domestication'], // Age 1 (multiple cards for splay)
          red: ['Archery'], // Age 1 (only one card, can't splay)
        },
        decks: {
          base: {
            1: ['Clothing', 'Metalworking'], // Cards for The Wheel's dogma
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel') // Dogma age 1 card

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Isaac Newton'],
          green: {
            cards: ['The Wheel', 'Sailing'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          yellow: {
            cards: ['Agriculture', 'Domestication'],
            splay: 'right', // Splayed right (age 1 matches)
          },
          red: {
            cards: ['Archery'],
            splay: 'none', // Not splayed (only one card, can't splay)
          },
          hand: ['Clothing', 'Metalworking'], // Cards drawn by The Wheel's dogma
        },
      })
    })
  })
})
