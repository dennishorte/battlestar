Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emperor Meiji', () => {

  test('karma: meld age 10 with five different top card values, win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],  // Age 7
        red: ['Archery'],            // Age 1
        yellow: ['Fermenting'],      // Age 2
        green: ['Paper'],            // Age 3
        blue: ['Printing Press'],    // Age 4
        hand: ['Software'],          // Age 10
      },
    })
    // Top cards have ages: 1, 2, 3, 4, 7 = 5 different values

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Software')

    t.testGameOver(request, 'dennis', 'Emperor Meiji')

    t.testBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        red: ['Archery'],
        yellow: ['Fermenting'],
        green: ['Paper'],
        blue: ['Printing Press'],
        hand: ['Software'], // Not melded because player won instead
      },
    })
  })

  test('karma: meld age 10 without five different top card values, normal meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],  // Age 7
        red: ['Archery'],            // Age 1
        yellow: ['Fermenting'],      // Age 2
        green: ['Paper'],            // Age 3
        hand: ['Software'],          // Age 10, blue
      },
    })
    // Top cards have ages: 1, 2, 3, 7 = 4 different values (not 5)

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Software')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        red: ['Archery'],
        yellow: ['Fermenting'],
        green: ['Paper'],
        blue: ['Software'], // Normal meld - Software is blue, age 10
      },
    })
  })

  describe(`karma: On your turn, until your second action, each card in an opponent's hand counts as being in your hand.`, () => {

    test('opponent turn', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          hand: ['The Wheel', 'Agriculture'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools'],
        },
      })

      let request
      request = game.run()

      t.testBoard(game, {
        dennis: {
          hand: ['The Wheel', 'Agriculture'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools'],
        },
      })
    })

    test('owner turn, first action', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          hand: ['The Wheel'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools'],
        },
        decks: {
          base: {
            1: ['Agriculture'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')

      t.testBoard(game, {
        dennis: {
          hand: ['The Wheel', 'Agriculture'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools', 'The Wheel', 'Agriculture'],
        },
      })
    })

    test('owner turn, second action', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          hand: ['The Wheel'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools'],
        },
        decks: {
          base: {
            1: ['Agriculture'],
            7: ['Lighting'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')

      t.testBoard(game, {
        dennis: {
          hand: ['The Wheel', 'Agriculture'],
        },
        micah: {
          purple: ['Emperor Meiji'],
          yellow: ['Handshake'],
          hand: ['Tools', 'Lighting'],
        },
      })
    })

  })
})
