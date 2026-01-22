Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Chemistry', () => {
  test('no splay, yes score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Chemistry', 'Tools'],
        score: ['The Wheel'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Chemistry')
    const result3 = t.choose(game, result2)
    const result4 = t.choose(game, result3, 'The Wheel')

    expect(t.cards(game, 'score').sort()).toEqual(['Vaccination'])
    expect(t.zone(game, 'blue').splay).toBe('none')
  })

  test('yes splay, no score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Chemistry', 'Tools'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Chemistry')
    const result3 = t.choose(game, result2, 'blue')

    expect(t.cards(game, 'score').sort()).toEqual([])
    expect(t.zone(game, 'blue').splay).toBe('right')
    expect(result3.selectors[0].actor).toBe('micah')
  })
})
