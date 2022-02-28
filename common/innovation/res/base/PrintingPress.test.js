Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Printing Press', () => {
  test('return and draw', () => {
    const game = t.fixtureTopCard('Printing Press')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setScore(game, 'dennis', ['Coal', 'Mathematics'])
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setDeckTop(game, 'base', 6, ['Canning'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Printing Press')
    const request3 = t.choose(game, request2, 'Coal')

    expect(t.cards(game, 'score')).toStrictEqual(['Mathematics'])
    expect(t.cards(game, 'hand')).toStrictEqual(['Canning'])
  })

  test('do not return', () => {
    const game = t.fixtureTopCard('Printing Press')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setScore(game, 'dennis', ['Coal', 'Mathematics'])
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setDeckTop(game, 'base', 6, ['Canning'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Printing Press')
    const request3 = t.choose(game, request2)

    expect(t.cards(game, 'score')).toStrictEqual(['Coal', 'Mathematics'])
    expect(t.cards(game, 'hand')).toStrictEqual([])
  })

  test('splay', () => {
    const game = t.fixtureTopCard('Printing Press')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setColor(game, 'dennis', 'blue', ['Printing Press', 'Tools'])
      t.setDeckTop(game, 'base', 6, [])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Printing Press')
    const request3 = t.choose(game, request2, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('right')
  })
})
