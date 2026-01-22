Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Empire Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
        hand: ['Databases'], // Databases needs to be in hand to meld
      },
    })

    let request
    request = game.run()

    // Test preconditions
    const biscuits = t.dennis(game).biscuits()
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, 'Meld.Databases')

    expect(t.cards(game, 'achievements')).toEqual(['Empire'])
  })

  test('person biscuits do not count', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        hand: ['Escapism'],
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
      },
    })

    let request
    request = game.run()
    const biscuits = t.dennis(game).biscuits()
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, 'Meld.Escapism')

    expect(t.cards(game, 'achievements')).toEqual([])
  })

  test('not quite', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        hand: ['Bioengineering'],
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
      },
    })

    let request
    request = game.run()
    const biscuits = t.dennis(game).biscuits()
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, 'Meld.Bioengineering')

    expect(t.cards(game, 'achievements')).toEqual([])
  })
})
