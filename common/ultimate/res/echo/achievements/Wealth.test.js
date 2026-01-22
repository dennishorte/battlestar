Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Wealth', () => {
  test('eight visible bonuses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Scissors'],
        blue: ['Perfume'],
        purple: {
          cards: ['Flute', 'Puppet'],
          splay: 'up',
        },
        yellow: {
          cards: ['Soap', 'Stove'],
          splay: 'up',
        },
        hand: ['Pencil'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Pencil')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Scissors'],
        blue: ['Perfume'],
        purple: {
          cards: ['Flute', 'Puppet'],
          splay: 'up',
        },
        yellow: {
          cards: ['Pencil', 'Soap', 'Stove'],
          splay: 'up',
        },
        achievements: ['Wealth'],
      },
    })
  })

  test('seven visible bonuses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Scissors'],
        purple: {
          cards: ['Flute', 'Puppet'],
          splay: 'up',
        },
        yellow: {
          cards: ['Soap', 'Stove'],
          splay: 'up',
        },
        hand: ['Pencil'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Pencil')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Scissors'],
        purple: {
          cards: ['Flute', 'Puppet'],
          splay: 'up',
        },
        yellow: {
          cards: ['Pencil', 'Soap', 'Stove'],
          splay: 'up',
        },
      },
    })
  })
})
