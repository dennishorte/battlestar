Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

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
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Specialization')
    const request3 = t.choose(game, request2, 'blue')

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
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Specialization')
    const request3 = t.choose(game, request2, 'blue')

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
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Specialization')
    const request3 = t.choose(game, request2, 'blue')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
