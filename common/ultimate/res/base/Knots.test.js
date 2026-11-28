Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Knots', () => {
  test('dogma: reveal card from score pile matching color on board, draw {1}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'], // Red is on board
        score: ['Archery'], // Red card in score pile
      },
      decks: {
        base: {
          1: ['Tools'], // Age 1 card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Knots')
    // Reveal Archery (red, matches color on board)
    // Draw age 1 (Tools)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'],
        score: ['Archery'], // Revealed but stays in score pile
        hand: ['Tools'], // Age 1 card drawn
      },
    })
  })

  test('dogma: proof reveal by a sharing player does not award a share bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Archery'],
        score: ['Agriculture'],
      },
      micah: {
        purple: ['Philosophy'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Knots')

    // Neither score card matches a color on that player's board, so each
    // player only reveals their score pile to prove they cannot. Micah
    // sharing that non-demand must not give Dennis a share bonus.
    const proofs = game.log.getLog().filter(entry =>
      entry.template && entry.template.includes('no valid card')
    )
    expect(proofs).toHaveLength(2)
    expect(game.log.getLog().some(entry =>
      entry.template && entry.template.includes('sharing bonus')
    )).toBe(false)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Archery'],
        score: ['Agriculture'],
      },
      micah: {
        purple: ['Philosophy'],
        score: ['Sailing'],
      },
    })
  })

  test('dogma: drawing after a reveal still awards a share bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Archery'],
        score: ['Agriculture'],
      },
      micah: {
        purple: ['Philosophy'],
        score: ['Code of Laws'],
      },
      decks: {
        base: {
          1: ['Tools', 'Writing'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Knots')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Archery'],
        score: ['Agriculture'],
        hand: ['Writing'],
      },
      micah: {
        purple: ['Philosophy'],
        score: ['Code of Laws'],
        hand: ['Tools'],
      },
    })
  })

  test('dogma: no valid cards to reveal (no matching colors)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'], // Red is on board
        score: ['Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Knots')
    // Mathematics is blue, and blue is on board (Knots), so it should be a valid choice
    // Actually, let me reconsider - the card needs to match a color on the board
    // Blue is on board (Knots), so Mathematics (blue) should be valid

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'],
        score: ['Agriculture'],
      },
    })
  })

  test('dogma: multiple valid cards, choose one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'], // Red is on board
        score: ['Archery', 'Gunpowder'], // Both red cards in score pile
      },
      decks: {
        base: {
          1: ['Tools'], // Age 1 card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Knots')
    // Choose which red card to reveal (multiple options)
    request = t.choose(game, 'Gunpowder') // Choose Gunpowder
    // Draw age 1 (Tools)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Knots'],
        red: ['Fire'],
        score: ['Archery', 'Gunpowder'], // Both still in score pile (revealed but not removed)
        hand: ['Tools'], // Age 1 card drawn
      },
    })
  })
})
