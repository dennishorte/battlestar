Error.stackTraceLimit = 100

const t = require('../testutil.js')

describe('achievement-check', () => {

  // Sometimes, you can achieve cards from your board
  test('called after achieve', () => {

  })

  test('called after fade', () => {

  })

  test('called after forecast', () => {

  })

  test('called after meld', () => {
    const game = t.fixtureFirstPicks()
    jest.spyOn(game, 'aAchievementCheck')
    t.meld(game, 'Writing')
    expect(game.aAchievementCheck.mock.calls.length).toBe(1)
  })

  test('called after remove', () => {

  })

  test('called after return', () => {

  })

  test('called after score', () => {
    const game = t.fixtureDogma('Philosophy')
    jest.spyOn(game, 'aScore')
    jest.spyOn(game, 'aAchievementCheck')
    game.run()
    t.dogma(game, 'Philosophy')
    game.submit({
      actor: 'micah',
      name: 'Choose Cards',
      option: ['Writing']
    })

    expect(game.aScore.mock.calls.length).toBe(1)
    expect(game.aAchievementCheck.mock.calls.length).toBe(1)
  })

  test('called after splay', () => {
    const game = t.fixtureDogma('Philosophy')
    t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
    jest.spyOn(game, 'aSplay')
    jest.spyOn(game, 'aAchievementCheck')
    game.run()
    t.dogma(game, 'Philosophy')
    game.submit({
      actor: 'micah',
      name: 'Choose Colors',
      option: ['red'],
    })
    game.submit({
      actor: 'micah',
      name: 'Choose Cards',
      option: []
    })

    expect(game.aSplay.mock.calls.length).toBe(1)
    expect(game.aAchievementCheck.mock.calls.length).toBe(1)
  })

  test('called after transfer', () => {

  })

  test('called after tuck', () => {

  })

})
