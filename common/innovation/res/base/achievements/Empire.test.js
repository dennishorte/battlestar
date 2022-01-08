Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Empire Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPicks()

    t.setHand(game, 'micah', ['Databases'])
    t.setColor(game, 'micah', 'yellow', [])
    t.setColor(game, 'micah', 'red', ['Coal'])
    t.setColor(game, 'micah', 'blue', ['Philosophy'])
    t.setColor(game, 'micah', 'purple', ['Reformation'])
    t.setColor(game, 'micah', 'green', ['The Wheel', 'Self Service'])
    game.mSplay('micah', 'green', 'up')

    const biscuits = game.getBiscuits('micah')
    expect(biscuits.final.c).toBe(3)
    expect(biscuits.final.f).toBe(3)
    expect(biscuits.final.k).toBe(3)
    expect(biscuits.final.l).toBe(3)
    expect(biscuits.final.s).toBe(3)

    game.run()
    t.meld(game, 'Databases')

    expect(game.getAchievements('micah').cards.includes('Empire')).toBe(true)
  })

  test('not quite', () => {
    const game = t.fixtureFirstPicks()

    t.setHand(game, 'micah', ['Bioengineering'])
    t.setColor(game, 'micah', 'yellow', [])
    t.setColor(game, 'micah', 'red', ['Coal'])
    t.setColor(game, 'micah', 'blue', ['Philosophy'])
    t.setColor(game, 'micah', 'purple', ['Reformation'])
    t.setColor(game, 'micah', 'green', ['The Wheel', 'Self Service'])
    game.mSplay('micah', 'green', 'up')

    const biscuits = game.getBiscuits('micah')
    expect(biscuits.final.c).toBe(3)
    expect(biscuits.final.f).toBe(3)
    expect(biscuits.final.k).toBe(3)
    expect(biscuits.final.l).toBe(3)
    expect(biscuits.final.s).toBe(3)

    game.run()
    t.meld(game, 'Bioengineering')

    expect(game.getAchievements('micah').cards.includes('Empire')).toBe(false)
  })
})
