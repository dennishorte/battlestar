Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('James Clerk Maxwell', () => {

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['James Clerk Maxwell'],
        yellow: ['Alex Trebek'],
        hand: ['Tools', 'Calendar', 'Construction']
      },
    })

    let request
    request = game.run()

    expect(t.dennis(game).biscuits()).toEqual({
      k: 0,
      s: 5,
      l: 0,
      c: 0,
      f: 0,
      i: 4,
      p: 5,
    })
  })

  describe('If a player would return a card of value lower than 8, first draw an {8}.', () => {
    test('karma: any player returns card < age 8, owner draws age 8 first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Mathematics'], // Mathematics on top to dogma it
          hand: ['Tools'], // Age 1 card to return
        },
        micah: {
          blue: ['James Clerk Maxwell'], // Owner of karma card
        },
        decks: {
          base: {
            2: ['Calendar'], // Card drawn and melded after returning Tools (age 1 -> age 2)
            8: ['Skyscrapers'], // Age 8 card to draw via karma (owner draws)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Mathematics')
      request = t.choose(game, request, 'Tools') // dennis returns Tools (age 1)
      // Karma triggers: micah (owner) draws age 8 first (Skyscrapers) because triggerAll: true
      // Then Mathematics's dogma continues: dennis draws and melds age 2 (Calendar)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Calendar', 'Mathematics'], // Calendar melded into blue (same color as Mathematics)
          // Tools was returned
        },
        micah: {
          blue: ['James Clerk Maxwell'],
          hand: ['Skyscrapers'], // Drew age 8 card via karma (owner draws)
        },
      })
    })

    test('karma: owner returns card < age 8, owner draws age 8 first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['James Clerk Maxwell'], // Owner of karma card
          yellow: ['Agriculture'], // Agriculture on top to dogma it
          hand: ['Tools'], // Age 1 card to return
        },
        decks: {
          base: {
            2: ['Calendar'], // Card drawn and scored after returning Tools (age 1 -> age 2)
            8: ['Rocketry'], // Age 8 card to draw via karma (owner draws)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // dennis returns Tools (age 1)
      // Karma triggers: dennis (owner) draws age 8 first (Rocketry) because triggerAll: true
      // Then Agriculture's dogma continues: micah draws and scores age 2 (Calendar)

      t.testBoard(game, {
        dennis: {
          blue: ['James Clerk Maxwell'],
          yellow: ['Agriculture'],
          score: ['Calendar'], // Scored age 2 card from Agriculture's dogma
          hand: ['Rocketry'], // Drew age 8 card via karma (owner draws)
        },
      })
    })

    test('karma: does not trigger for age 8+ cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Agriculture'], // Agriculture on top to dogma it
          hand: ['Skyscrapers'], // Age 8 card to return
        },
        micah: {
          blue: ['James Clerk Maxwell'], // Owner of karma card
        },
        decks: {
          base: {
            9: ['Services'], // Card drawn and scored after returning Skyscrapers (age 8 -> age 9)
            8: ['Rocketry'], // Age 8 card should NOT be drawn (karma does not trigger)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Skyscrapers') // Return Skyscrapers (age 8)
      // Karma should NOT trigger (card is age 8, not < 8)
      // Agriculture's dogma continues: draw and score age 9 (Services)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Agriculture'],
          score: ['Services'], // Scored age 9 card from Agriculture's dogma
          // Skyscrapers was returned
        },
        micah: {
          blue: ['James Clerk Maxwell'],
          hand: [], // No age 8 card drawn (karma did not trigger)
        },
      })
    })

    test('karma: does not trigger on non-return actions', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['The Wheel'], // The Wheel on top to dogma it
        },
        micah: {
          blue: ['James Clerk Maxwell'], // Owner of karma card
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Cards drawn by The Wheel
            8: ['Rocketry'], // Age 8 card should NOT be drawn (karma does not trigger)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      // Karma should NOT trigger (The Wheel does not return cards)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['The Wheel'],
          hand: ['Tools', 'Sailing'], // Drew cards from The Wheel's dogma
        },
        micah: {
          blue: ['James Clerk Maxwell'],
          hand: [], // No age 8 card drawn (karma did not trigger)
        },
      })
    })
  })
})
