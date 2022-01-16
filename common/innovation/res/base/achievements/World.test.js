Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('World achievement', () => {
  test('12 on board', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'purple', ['Specialization'])
    t.setColor(game, 'micah', 'green', ['Databases'])
    t.setColor(game, 'micah', 'blue', [
      'Software',
      'Bioengineering',
      'Computers',
      'Publications',
      'Rocketry',
      'Quantum Theory'
    ])
    game.run()

    t.dogma(game, 'Specialization')
    t.choose(game, 'blue')

    expect(game.getAchievements('micah').cards).toStrictEqual(['World'])
  })

  test('12 due to karma', () => {
    const game = t.fixtureDogma('John Von Neumann', { expansions: ['base', 'figs'] })
    t.setHand(game, 'micah', [
      'Industrialization',
      'Flight',
      'Specialization',
      'Fu Xi',
    ])
    game.run()

    t.draw(game)

    expect(game.getBiscuits('micah').board.i).toBe(2)
    expect(game.getBiscuits('micah').final.i).toBe(12)
    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })
})
