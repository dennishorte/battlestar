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

  test('called after return', () => {

  })

  test('called after score', () => {

  })

  test('called after splay', () => {

  })

  test('called after transfer', () => {

  })

  test('called after tuck', () => {

  })

})
