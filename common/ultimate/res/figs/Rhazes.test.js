Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rhazes', () => {

  test('tuck age 3 card from hand when drawing age 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Calendar', 'Machinery', 'Perspective'],
      },
      decks: {
        base: {
          3: ['Education']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes', 'Machinery'],
        hand: ['Education', 'Calendar', 'Perspective']
      },
    })
  })

  test('tuck age 3 card from opponent score when drawing age 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Calendar', 'Perspective'], // No age 3 cards in hand
      },
      micah: {
        score: ['Machinery', 'Tran Huang Dao'], // Age 3 cards in score
      },
      decks: {
        base: {
          3: ['Translation']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    request = t.choose(game, request, '**base-3* (micah)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes', 'Machinery'],
        hand: ['Translation', 'Calendar', 'Perspective']
      },
      micah: {
        score: ['Tran Huang Dao']
      },
    })
  })


  test('choose hand card when both hand and opponent score have matching cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Machinery', 'Calendar'], // Age 3 in hand
      },
      micah: {
        score: ['Education'], // Age 3 in score
      },
      decks: {
        base: {
          3: ['Translation']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: can choose from hand or opponent score
    request = t.choose(game, request, 'Machinery') // Choose from hand

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes', 'Machinery'],
        hand: ['Translation', 'Calendar']
      },
      micah: {
        score: ['Education'] // Not chosen, still in score
      },
    })
  })

  test('tuck from hand when drawing via dogma effect', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        green: ['The Wheel'], // Dogma: Draw two {1}
        hand: ['Archery', 'Tools'], // Age 1 cards in hand
      },
      decks: {
        base: {
          1: ['Agriculture', 'Domestication']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')
    // Karma triggers on first draw: must tuck age 1 card from hand
    request = t.choose(game, request, 'Archery')
    // Karma triggers on second draw: must tuck age 1 card from hand
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: ['Rhazes'],
        green: ['The Wheel'],
        blue: ['Tools'],
        hand: ['Agriculture', 'Domestication']
      },
    })
  })

  test('no effect when hand and opponent score have no matching cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Calendar', 'Perspective'], // No age 3 cards
      },
      micah: {
        score: ['The Wheel', 'Mathematics'], // No age 3 cards
      },
      decks: {
        base: {
          3: ['Education']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers but no valid cards to tuck - draw proceeds normally

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Education', 'Calendar', 'Perspective'] // Card drawn, nothing tucked
      },
      micah: {
        score: ['The Wheel', 'Mathematics'] // Unchanged
      },
    })
  })

})
