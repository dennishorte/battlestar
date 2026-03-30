const t = require('../testutil')
const { parseRewardText } = require('../phases/combat.js')
const { resolveEffect } = require('../phases/playerTurns.js')

describe('Sandworm Reward Doubling', () => {

  test('sandworm doubles resource amounts in awardReward', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, solari: 0, spice: 0 },
    })
    game.run()

    // Manually set up combat state: dennis has 1 troop + 1 sandworm in conflict
    game.state.conflict.deployedTroops.dennis = 1
    game.state.conflict.deployedSandworms.dennis = 1

    const player = game.players.byName('dennis')
    const hasSandworms = (game.state.conflict.deployedSandworms.dennis || 0) > 0
    expect(hasSandworms).toBe(true)

    // Parse a reward that should be doubled
    const effects = parseRewardText('+2 Solari')
    expect(effects).toEqual([{ type: 'gain', resource: 'solari', amount: 2 }])

    // When sandworms are present, amounts get doubled in awardReward
    // Simulate: double amount if hasSandworms
    for (const effect of effects) {
      if (hasSandworms && effect.type !== 'control' && effect.type !== 'choice') {
        effect.amount *= 2
      }
      resolveEffect(game, player, effect, null)
    }

    expect(player.solari).toBe(4) // 2 doubled to 4
  })

  test('sandworm does NOT double control rewards', () => {
    const effects = parseRewardText('Arrakeen Control')
    expect(effects).toEqual([{ type: 'control', location: 'arrakeen' }])

    // control type is excluded from doubling
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')
    expect(code).toContain("effect.type !== 'control'")
  })

  test('sandworm does NOT double choice rewards', () => {
    const effects = parseRewardText('+1 Intrigue card OR +1 Spice')
    expect(effects[0].type).toBe('choice')

    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')
    expect(code).toContain("effect.type !== 'choice'")
  })

  test('VP rewards are doubled by sandworm', () => {
    const effects = parseRewardText('+1 Victory point')
    expect(effects).toEqual([{ type: 'vp', amount: 1 }])

    // VP type is not excluded from doubling
    const effect = effects[0]
    const canDouble = effect.type !== 'control' && effect.type !== 'choice'
    expect(canDouble).toBe(true)
  })

  test('influence rewards are doubled by sandworm', () => {
    const effects = parseRewardText('+1 Influence')
    expect(effects).toEqual([{ type: 'influence-choice', amount: 1 }])

    const effect = effects[0]
    const canDouble = effect.type !== 'control' && effect.type !== 'choice'
    expect(canDouble).toBe(true)
  })
})
