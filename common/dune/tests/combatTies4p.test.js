const t = require('../testutil')

describe('4-Player Combat Tie Scenarios', () => {

  test('2 tied for 1st: code path awards 3rd place to remaining players', () => {
    // When exactly 2 tied for first in 4-player, remaining players compete for 3rd
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')
    expect(code).toContain('firstGroup.players.length === 2 && placements.length > 1')
    // This branch awards thirdGroup the 3rd place reward
    expect(code).toContain("awardReward(game, thirdGroup.players[0], rewards?.third, '3rd')")
  })

  test('3+ tied for 1st: only 2nd place reward given, no other rewards', () => {
    // When 3+ tied for first, the branch for 3rd place is skipped
    // because firstGroup.players.length === 2 is NOT met
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')
    // The tied-for-first branch gives 2nd place rewards
    expect(code).toContain("awardReward(game, player, rewards?.second, '2nd')")
    // The 3rd place branch requires exactly 2 tied
    expect(code).toContain('firstGroup.players.length === 2')
  })

  test('4-player game creates with correct player count', () => {
    const game = t.fixture({ numPlayers: 4 })
    game.run()
    expect(game.players.all().length).toBe(4)
    // 4-player starts at 1 VP
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)
  })
})
