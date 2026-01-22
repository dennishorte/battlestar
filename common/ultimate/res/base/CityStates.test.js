Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('City States', () => {
  test('transfer a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['City States'],
      },
      micah: {
        yellow: ['Masonry'],
        red: ['Archery'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.City States')
    const result3 = t.choose(game, result2, 'Archery')

    expect(t.cards(game, 'red')).toEqual(['Archery'])
    expect(t.cards(game, 'hand', 'micah')).toEqual(['Tools'])
  })

  test('not enough castles', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['City States'],
      },
      micah: {
        yellow: ['Masonry'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.City States')

    expect(result2.selectors[0].title).toBe('Choose First Action')
  })
})
