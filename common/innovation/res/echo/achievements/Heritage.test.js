Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Heritage', () => {
  test('eight hexes in one color', () => {
    const game = t.fixtureDogma('Specialization', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', [])
    t.setColor(game, 'micah', 'blue', [
      'Bioengineering',
      'Software',
      'Computers',
      'Genetics',
      'Quantum Theory',
      'Rocketry',
      'Evolution',
      'Atomic Theory',
    ])
    game.run()
    t.dogma(game, 'Specialization')
    t.choose(game, 'blue')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Heritage'])
  })

  test('eight hexes total, but different colors', () => {
    const game = t.fixtureDogma('Specialization', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', [])
    t.setColor(game, 'micah', 'blue', [
      'Bioengineering',
      'Software',
      'Computers',
      'Genetics',
      'Quantum Theory',
      'Rocketry',
      'Evolution',
    ])
    // Seven in blue
    // One in purple

    game.run()
    t.dogma(game, 'Specialization')
    t.choose(game, 'blue')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })

  test('seven hexes in one color', () => {
    const game = t.fixtureDogma('Specialization', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', [])
    t.setColor(game, 'micah', 'blue', [
      'Bioengineering',
      'Software',
      'Computers',
      'Genetics',
      'Quantum Theory',
      'Rocketry',
      'Evolution',
    ])
    game.run()
    t.dogma(game, 'Specialization')
    t.choose(game, 'blue')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })
})
