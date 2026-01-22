Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Canning', () => {
  test('draw and tuck a 6, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        green: ['The Wheel'],
        blue: ['Chemistry'],
        purple: ['The Internet'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Canning')
    const result3 = t.choose(game, 'yes')
    const result4 = t.choose(game, 'auto')
    const result5 = t.choose(game, 'yellow')

    expect(t.cards(game, 'score').sort()).toEqual(['The Internet', 'The Wheel'])
    expect(t.cards(game, 'yellow').sort()).toEqual(['Canning', 'Vaccination'])
    expect(t.zone(game, 'yellow').splay).toBe('right')
  })

  test('draw and tuck a 6, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        green: ['The Wheel'],
        blue: ['Chemistry'],
        purple: ['The Internet'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Canning')
    const result3 = t.choose(game, 'no')

    expect(t.cards(game, 'score').sort()).toEqual([])
    expect(t.cards(game, 'yellow').sort()).toEqual(['Canning'])
  })
})
