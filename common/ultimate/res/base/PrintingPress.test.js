Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Printing Press', () => {
  test('return and draw', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Coal', 'Mathematics'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request, 'Coal')

    expect(t.cards(game, 'score')).toEqual(['Mathematics'])
    expect(t.cards(game, 'hand')).toEqual(['Canning'])
  })

  test('do not return', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press'],
        purple: ['Enterprise'],
        score: ['Coal', 'Mathematics'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request)

    expect(t.cards(game, 'score')).toEqual(['Coal', 'Mathematics'])
    expect(t.cards(game, 'hand')).toEqual([])
  })

  test('splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Printing Press', 'Tools'],
        purple: ['Enterprise'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('right')
  })
})
