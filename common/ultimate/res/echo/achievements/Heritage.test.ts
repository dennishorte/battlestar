Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Heritage', () => {
  test('eight hexes in one color', () => {
    const game = t.fixtureTopCard('Specialization', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setColor(game, 'dennis', 'blue', [
        'Bioengineering',
        'Software',
        'Computers',
        'Genetics',
        'Quantum Theory',
        'Rocketry',
        'Evolution',
        'Atomic Theory',
      ])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Specialization')
    request = t.choose(game, request, 'blue')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Heritage'])
  })

  test('eight hexes total, but different colors', () => {
    const game = t.fixtureTopCard('Specialization', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setColor(game, 'dennis', 'blue', [
        'Bioengineering',
        'Software',
        'Computers',
        'Quantum Theory',
        'Rocketry',
        'Evolution',
        'Atomic Theory',
      ])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Specialization')
    request = t.choose(game, request, 'blue')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test('seven hexes in one color', () => {
    const game = t.fixtureTopCard('Specialization', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setColor(game, 'dennis', 'blue', [
        'Bioengineering',
        'Software',
        'Computers',
        'Genetics',
        'Quantum Theory',
        'Evolution',
        'Atomic Theory',
      ])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Specialization')
    request = t.choose(game, request, 'blue')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
