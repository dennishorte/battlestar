Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Atomic Theory', () => {
  test('splay blue right', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Mathematics'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Atomic Theory')
    const result3 = t.choose(game, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('right')
  })

  test('draw and meld', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Atomic Theory'],
      },
      decks: {
        base: {
          7: ['Explosives'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Atomic Theory')

    expect(t.cards(game, 'red')).toEqual(['Explosives'])
  })
})
