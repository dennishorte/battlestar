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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Meld.Pencil')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Wealth'])
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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Meld.Pencil')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
