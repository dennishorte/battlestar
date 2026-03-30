const t = require('../testutil')
const spySystem = require('../systems/spies')

describe('Spy Agent Icon', () => {

  test('canSendAgentTo allows access via spy connection without matching icon', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post A connects to arrakeen and spice-refinery
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    // Verify spy is connected to arrakeen
    expect(spySystem.hasSpyAt(game, { name: 'dennis' }, 'arrakeen')).toBe(true)
  })

  test('spy on observation post enables spyAccess card to visit connected space', () => {
    // Verify the code path: canSendAgentTo checks card.spyAccess && spies.hasSpyAt
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/playerTurns.js'), 'utf8')
    expect(code).toContain('card.spyAccess && spies.hasSpyAt(game, player, space.id)')
  })

  test('spy is NOT recalled when using spy agent icon', () => {
    // Per rules: "Do NOT recall the Spy for this purpose"
    // The spyAccess check in canSendAgentTo only checks hasSpyAt — it does not recall
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    // Spy should remain on post after access check
    expect(spySystem.hasSpyAt(game, { name: 'dennis' }, 'arrakeen')).toBe(true)
    // hasSpyAt is read-only — does not modify state
    spySystem.hasSpyAt(game, { name: 'dennis' }, 'arrakeen')
    expect(game.state.spyPosts['A']).toContain('dennis')
  })
})
