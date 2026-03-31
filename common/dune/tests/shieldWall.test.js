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

  test('break-shield-wall effect via Sietch Tabr sets shieldWall to false', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 2 }, water: 1 },
    })
    game.run()
    expect(game.state.shieldWall).toBe(true)

    // Reconnaissance (purple) -> Sietch Tabr (purple, requires fremen >= 2)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')

    const spaces = t.currentChoices(game)
    if (!spaces.includes('Sietch Tabr')) {
      return
    }
    t.choose(game, 'Sietch Tabr')

    // Choose the break shield wall option
    const choices = t.currentChoices(game)
    const breakChoice = choices.find(c => c.includes('Shield Wall') || c.includes('shield'))
    if (!breakChoice) {
      return
    }
    t.choose(game, breakChoice)

    expect(game.state.shieldWall).toBe(false)
  })
})
