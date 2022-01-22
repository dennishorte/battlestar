Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Monument achievement', () => {

  test('tuck six', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'blue', ['Pottery', 'Calendar'])  // 5
    t.setSplay(game, 'micah', 'blue', 'up')

    t.setColor(game, 'micah', 'purple', ['Reformation', 'Lighting']) // 5
    t.setSplay(game, 'micah', 'purple', 'up')

    t.setColor(game, 'micah', 'yellow', ['Agriculture']) // 3

    t.setHand(game, 'micah', [
      'Bioengineering',
      'Software',
      'Self Service',
      'Databases',
      'Globalization',
      'Stem Cells',
      'Mathematics',
    ])

    game.run()
    t.dogma(game, 'Reformation')
    t.choose(game, 'Tuck 6 cards from hand')
    t.choose(game, 'Bioengineering')
    t.choose(game, 'Software')
    t.choose(game, 'Self Service')
    t.choose(game, 'Databases')
    t.choose(game, 'Globalization')

    expect(game.getAchievements('micah').cards).toStrictEqual([])

    t.choose(game, 'Stem Cells')
    expect(game.getAchievements('micah').cards).toStrictEqual(['Monument'])
  })

  test('score six', () => {
    const game = t.fixtureDogma('Metalworking')
    t.topDeck(game, 'base', 1, [
      'Archery',
      'Oars',
      'Tools',
      'The Wheel',
      'City States',
      'Mysticism',
      'Code of Laws',
    ])
    game.run()
    t.dogma(game, 'Metalworking')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Monument'])
  })

  test('tuck three and score three does not work', () => {
    const game = t.fixtureFirstPicks()

    t.topDeck(game, 'base', 1, [
      'Pottery',  // Micah will draw
      'Archery',
      'Oars',
      'Tools',
      'Code of Laws',
    ])

    // Setup for Tom (who is the first player to get two actions
    t.setColor(game, 'tom', 'red', ['Metalworking'])
    t.setColor(game, 'tom', 'yellow', ['Agriculture']) // 3 leaf biscuits
    t.setColor(game, 'tom', 'purple', ['Reformation', 'Lighting']) // 5 leaf biscuits
    t.setSplay(game, 'tom', 'purple', 'up')
    t.setHand(game, 'tom', [
      'Bioengineering',
      'Software',
      'Self Service',
      'Mathematics',
    ])

    game.run()

    // Micah's Action
    t.draw(game)

    jest.spyOn(game, 'aScore')
    jest.spyOn(game, 'aTuck')

    // Tom's first action
    t.dogma(game, 'Metalworking')

    // Tom's secone action
    t.dogma(game, 'Reformation')
    t.choose(game, 'Tuck 4 cards from hand')
    t.choose(game, 'Bioengineering')
    t.choose(game, 'Software')
    t.choose(game, 'Self Service')

    expect(game.aScore.mock.calls.length).toBe(3)
    expect(game.aTuck.mock.calls.length).toBe(3)

    expect(game.getAchievements('tom').cards).toStrictEqual([])
  })

})
