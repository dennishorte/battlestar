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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request, 'Coal')

    expect(t.cards(game, 'score')).toEqual(['Mathematics'])
    expect(t.cards(game, 'hand')).toEqual(['Canning'])
  })

  test('do not return', () => {
    const game = t.fixtureTopCard('Printing Press')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setScore(game, 'dennis', ['Coal', 'Mathematics'])
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setDeckTop(game, 'base', 6, ['Canning'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request)

    expect(t.cards(game, 'score')).toEqual(['Coal', 'Mathematics'])
    expect(t.cards(game, 'hand')).toEqual([])
  })

  test('splay', () => {
    const game = t.fixtureTopCard('Printing Press')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setColor(game, 'dennis', 'blue', ['Printing Press', 'Tools'])
      t.setDeckTop(game, 'base', 6, [])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Printing Press')
    request = t.choose(game, request, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('right')
  })
})
