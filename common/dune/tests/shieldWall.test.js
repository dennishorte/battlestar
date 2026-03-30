const t = require('../testutil')

describe('Shield Wall', () => {

  test('shield wall starts in place', () => {
    const game = t.fixture()
    game.run()
    expect(game.state.shieldWall).toBe(true)
  })

  test('shield wall can be removed via setBoard', () => {
    const game = t.fixture()
    t.setBoard(game, { shieldWall: false })
    game.run()
    expect(game.state.shieldWall).toBe(false)
  })

  test('protected locations identified correctly', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const protectedSpaces = boardSpaces.filter(s => s.isProtected).map(s => s.id).sort()
    expect(protectedSpaces).toEqual(['arrakeen', 'imperial-basin', 'spice-refinery'])
  })
})

describe('Sandworm Rules', () => {

  test('sandworm strength is 3', () => {
    const constants = require('../res/constants.js')
    expect(constants.SANDWORM_STRENGTH).toBe(3)
  })

  test('troop strength is 2', () => {
    const constants = require('../res/constants.js')
    expect(constants.TROOP_STRENGTH).toBe(2)
  })

  test('sword strength is 1', () => {
    const constants = require('../res/constants.js')
    expect(constants.SWORD_STRENGTH).toBe(1)
  })
})
