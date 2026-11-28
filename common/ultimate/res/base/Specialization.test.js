Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Specialization', () => {
  describe('Reveal and take', () => {
    test('take opponent top cards of matching color', () => {
      const game = t.fixtureFirstPlayer({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          purple: ['Specialization'],
          red: ['Flight'],
          hand: ['Oars'],
        },
        scott: {
          red: ['Archery'],
        },
        micah: {
          red: ['Metalworking', 'Optics'],
        },
      })

      game.run()
      t.choose(game, 'Dogma.Specialization')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Specialization'],
          red: ['Flight'],
          hand: ['Oars', 'Archery', 'Metalworking'],
        },
        scott: {},
        micah: {
          red: ['Optics'],
        },
      })
    })

    test('taken cards are named in the log for other players', () => {
      const game = t.fixtureFirstPlayer({ numPlayers: 3, viewerName: 'scott' })
      t.setBoard(game, {
        dennis: {
          purple: ['Specialization'],
          red: ['Flight'],
          hand: ['Oars'],
        },
        scott: {
          red: ['Archery'],
        },
        micah: {
          red: ['Metalworking', 'Optics'],
        },
      })

      game.run()
      t.choose(game, 'Dogma.Specialization')

      const transferred = game
        .log
        .getLog()
        .filter(e => e.template === '{player} transfers {card} to {zone}')
        .map(e => e.args.card.value)

      expect(transferred).toEqual(expect.arrayContaining(['Archery', 'Metalworking']))
    })
  })

  test('revealing a card does not award a share bonus', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Specialization'],
        hand: ['Sailing'],
      },
      micah: {
        red: ['Gunpowder'],
        hand: ['Agriculture'],
      },
      decks: {
        base: {
          9: ['Computers'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Specialization')

    // Both players reveal a hand card, and neither has a board card of that
    // color to take. The reveal is the only thing Micah does, so Dennis
    // does not draw a share bonus.
    const revealed = game.log.getLog()
      .filter(entry => entry.template === '{player} reveals {card}')
      .map(entry => entry.args.card.value)
    expect(revealed).toEqual(expect.arrayContaining(['Sailing', 'Agriculture']))
    expect(game.log.getLog().some(entry =>
      entry.template && entry.template.includes('sharing bonus')
    )).toBe(false)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Specialization'],
        hand: ['Sailing'],
      },
      micah: {
        red: ['Gunpowder'],
        hand: ['Agriculture'],
      },
    })
  })

  describe('splay', () => {
    test('can splay', () => {
      const game = t.fixtureFirstPlayer({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          purple: ['Specialization'],
          blue: ['Mathematics', 'Experimentation'],
        },
      })

      game.run()
      t.choose(game, 'Dogma.Specialization')
      t.choose(game, 'blue')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Specialization'],
          blue: {
            cards: ['Mathematics', 'Experimentation'],
            splay: 'up',
          },
        },
      })
    })
  })
})
