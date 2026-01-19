Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Atomic Theory', () => {
  test('splay blue right', () => {
    const game = t.fixtureTopCard('Atomic Theory')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Atomic Theory', 'Mathematics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Atomic Theory')
    const result3 = t.choose(game, result2, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('right')
  })

  test('draw and meld', () => {
    const game = t.fixtureTopCard('Atomic Theory')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 7, ['Explosives'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Atomic Theory')

    expect(t.cards(game, 'red')).toEqual(['Explosives'])
  })
})
