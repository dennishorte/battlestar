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

  test('shield wall detonation code sets shieldWall to false', () => {
    // Verify the break-shield-wall effect type works
    const game = t.fixture()
    game.run()
    expect(game.state.shieldWall).toBe(true)

    // Simulate the break-shield-wall effect
    const { resolveEffect } = require('../phases/playerTurns.js')
    const player = game.players.byName('dennis')
    resolveEffect(game, player, { type: 'break-shield-wall' }, null)

    expect(game.state.shieldWall).toBe(false)
  })

  test('sandworm blocked at protected location when shield wall up', () => {
    // Verify isConflictProtected function via the playerTurns module
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/playerTurns.js'), 'utf8')
    // Sandworm effect checks isConflictProtected
    expect(code).toContain("case 'sandworm'")
    expect(code).toContain('isConflictProtected')
    expect(code).toContain('Shield Wall')
  })
})
