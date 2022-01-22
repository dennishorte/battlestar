Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Wealth', () => {
  test('eight visible bonuses', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'red', ['Plumbing'])
    t.setColor(game, 'micah', 'green', ['Scissors'])
    t.setColor(game, 'micah', 'blue', ['Perfume'])
    t.setColor(game, 'micah', 'purple', ['Flute', 'Puppet'])
    t.setSplay(game, 'micah', 'purple', 'up')

    t.setColor(game, 'micah', 'yellow', ['Soap', 'Stove'])
    t.setSplay(game, 'micah', 'yellow', 'up')

    t.setHand(game, 'micah', ['Pencil'])

    game.run()
    t.meld(game, 'Pencil')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Wealth'])
  })

  test('seven visible bonuses', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'red', ['Plumbing'])
    t.setColor(game, 'micah', 'green', ['Scissors'])
    t.setColor(game, 'micah', 'blue', ['Perfume'])
    t.setColor(game, 'micah', 'purple', ['Flute'])

    t.setColor(game, 'micah', 'yellow', ['Soap', 'Stove'])
    t.setSplay(game, 'micah', 'yellow', 'up')

    t.setHand(game, 'micah', ['Pencil'])

    game.run()
    t.meld(game, 'Pencil')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })
})
