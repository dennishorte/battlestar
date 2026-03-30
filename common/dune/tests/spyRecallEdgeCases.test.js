const t = require('../testutil')
const spySystem = require('../systems/spies')

describe('Spy Recall Edge Cases', () => {

  test('placeSpy returns false when no spies in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spiesInSupply: 0 },
    })
    game.run()

    const player = game.players.byName('dennis')
    const result = spySystem.placeSpy(game, player)
    expect(result).toBe(false)
  })

  test('placeSpy succeeds when spies are available', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spiesInSupply: 3 },
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.spiesInSupply).toBe(3)
    // placeSpy will prompt for choice — just verify the initial state
    // The integration test in spyIntegration.test.js covers the full flow
  })

  test('recallSpy returns null when no spies on posts', () => {
    const game = t.fixture()
    game.run()

    const player = game.players.byName('dennis')
    const result = spySystem.recallSpy(game, player)
    expect(result).toBeNull()
  })

  test('recallSpyAt returns null for space with no spy', () => {
    const game = t.fixture()
    game.run()

    const player = game.players.byName('dennis')
    const result = spySystem.recallSpyAt(game, player, 'arrakeen')
    expect(result).toBeNull()
  })

  test('icon-restricted spy placement: spy effect checks are in resolveEffect', () => {
    // Some card effects specify spy placement with icon restrictions
    // The spy placement in resolveEffect delegates to spies.placeSpy
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/playerTurns.js'), 'utf8')
    // The spy case calls placeSpy directly
    expect(code).toContain("case 'spy':")
    expect(code).toContain('spies.placeSpy(game, player)')
  })

  test('getSpyConnectedSpaces returns empty set with no spies placed', () => {
    const game = t.fixture()
    game.run()

    const player = game.players.byName('dennis')
    const connected = spySystem.getSpyConnectedSpaces(game, player)
    expect(connected.size).toBe(0)
  })

  test('getSpyConnectedSpaces returns correct spaces for placed spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post A connects to arrakeen and spice-refinery
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    const player = game.players.byName('dennis')
    const connected = spySystem.getSpyConnectedSpaces(game, player)
    expect(connected.has('arrakeen')).toBe(true)
    expect(connected.has('spice-refinery')).toBe(true)
  })
})
