Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Astronomy', () => {
  test('draw blue, green, other', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'blue')).toEqual(['Atomic Theory'])
    expect(t.cards(game, 'green')).toEqual(['Classification'])
    expect(t.cards(game, 'hand')).toEqual(['Industrialization'])
  })

  test('win condition, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'achievements')).toEqual(['Universe'])
  })

  test('win condition, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        yellow: ['Steam Engine'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'achievements')).toEqual([])
  })
})
