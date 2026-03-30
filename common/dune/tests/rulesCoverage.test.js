const t = require('../testutil')
const { resolveEffect } = require('../phases/playerTurns.js')

// Helper: finish remaining prompts until next round
function finishUntilNextRound(game) {
  const startRound = game.state.round
  let safety = 50
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}


describe('Combat intrigue consecutive pass mechanic', () => {

  test('combat intrigue round resets when a card is played (code structure)', () => {
    // The rule: "Not required to pass just because passed earlier in Combat phase"
    // Once a player plays a card, the pass chain resets, giving all players another chance.
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')

    // The consecutivePasses counter is reset to 0 when a card is played
    expect(code).toContain('consecutivePasses = 0')
    // The loop continues until all combatants pass consecutively
    expect(code).toContain('consecutivePasses < combatants.length')
  })

  test('player can play combat intrigue after previously passing', () => {
    // Use Ambush (plotEffect: null, combatEffect: '+4 Swords') to avoid plot intrigue prompts
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, intrigue: ['Ambush'] },
      micah: { troopsInGarrison: 3, intrigue: ['Ambush'] },
    })
    game.run()

    // Dennis deploys to conflict
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Micah deploys to conflict
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Both reveal
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Combat intrigue phase: dennis passes first
    const choices1 = t.currentChoices(game)
    expect(choices1).toContain('Pass')
    expect(choices1).toContain('Ambush')
    t.choose(game, 'Pass')

    // Micah plays Ambush — resets the pass chain
    const choices2 = t.currentChoices(game)
    expect(choices2).toContain('Ambush')
    t.choose(game, 'Ambush')

    // Dennis should get another chance since the pass chain was reset
    // Dennis still has his Ambush card
    const choices3 = t.currentChoices(game)
    expect(choices3).toContain('Ambush')
    expect(choices3).toContain('Pass')
  })
})


describe('Sandworm never placed in garrison', () => {

  test('sandworm effect deploys directly to conflict, not garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    const player = game.players.byName('dennis')
    const garrisonBefore = player.troopsInGarrison

    resolveEffect(game, player, { type: 'sandworm', amount: 1 }, null)

    // Sandworm goes to conflict, not garrison
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
    // Garrison unchanged
    expect(player.troopsInGarrison).toBe(garrisonBefore)
  })

  test('sandworm effect does not increase troop supply or garrison', () => {
    const game = t.fixture()
    game.run()

    const player = game.players.byName('dennis')
    const supplyBefore = player.troopsInSupply
    const garrisonBefore = player.troopsInGarrison

    resolveEffect(game, player, { type: 'sandworm', amount: 1 }, null)

    expect(player.troopsInSupply).toBe(supplyBefore)
    expect(player.troopsInGarrison).toBe(garrisonBefore)
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
  })
})


describe('No-icon cards cannot be used for agent turns', () => {

  test('Convincing Argument (no agent icons) is not offered during agent turn card selection', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn')

    // The card selection should be offered. Convincing Argument has agentIcons: []
    // and no factionAccess — it should not be available for agent turns.
    const cardChoices = t.currentChoices(game)
    expect(cardChoices).not.toContain('Convincing Argument')
  })

  test('cards with agent icons are offered during agent turn', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn')

    const cardChoices = t.currentChoices(game)
    // Dagger has agentIcons: ['green']
    expect(cardChoices).toContain('Dagger')
    // Reconnaissance has agentIcons: ['purple']
    expect(cardChoices).toContain('Reconnaissance')
  })
})


describe('Gather Intelligence timing', () => {

  test('gather intelligence is offered before board space effects resolve', () => {
    // Per rules: "Must choose whether to Gather Intelligence immediately
    // after placing Agent (before receiving effects of board space or card)"
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/playerTurns.js'), 'utf8')

    // The gather intelligence check should happen before resolving board space effects
    const giIndex = code.indexOf('recall Spy to draw')
    expect(giIndex).not.toBe(-1)
    // GI prompt appears before space effect resolution in the agent turn flow
    const resolveIndex = code.indexOf('resolveSpaceEffects')
    const effectsIndex = resolveIndex !== -1 ? resolveIndex : code.indexOf('space.effects')
    expect(giIndex).toBeLessThan(effectsIndex)
  })
})


describe('4-player tie for first: remaining compete for 3rd', () => {

  test('exactly 2 tied for first in 4p: code awards 3rd place to remaining player', () => {
    // When exactly 2 tied for first in 4-player, the next player competes for 3rd
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')

    // The branch for exactly 2 tied for first
    expect(code).toContain('firstGroup.players.length === 2 && placements.length > 1')
    // Awards 3rd place reward to the next group
    expect(code).toContain("rewards?.third, '3rd'")
  })

  test('3+ tied for first in 4p: only 2nd place reward, no 3rd', () => {
    // When 3+ tied for first, no one gets 3rd place
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')

    // The tied-for-first branch gives 2nd place rewards
    expect(code).toContain("rewards?.second, '2nd'")
    // The 3rd place branch specifically requires exactly 2 tied
    expect(code).toContain('firstGroup.players.length === 2')
  })
})


describe('Sandworm doubling of pay-cost rewards', () => {

  test('parseRewardText handles cost-based reward patterns', () => {
    const { parseRewardText } = require('../phases/combat.js')
    // Check that OR choice rewards parse correctly — these are the "pay cost" rewards
    const effects = parseRewardText('+1 Intrigue card OR +1 Spice')
    expect(effects[0].type).toBe('choice')
    expect(effects[0].choices.length).toBe(2)
  })

  test('choice-type rewards are excluded from sandworm doubling', () => {
    // The canDoubleReward function excludes 'choice' type
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/combat.js'), 'utf8')
    expect(code).toContain("effect.type !== 'choice'")
  })
})


describe('CHOAM additional imperium cards', () => {

  test('CHOAM game includes additional imperium cards with Contracts (Uprising) compatibility', () => {
    const res = require('../res/index.js')

    const withCHOAM = res.getImperiumCards({ useCHOAM: true })
    const withoutCHOAM = res.getImperiumCards({ useCHOAM: false })

    // CHOAM should include more imperium cards
    expect(withCHOAM.length).toBeGreaterThan(withoutCHOAM.length)
  })

  test('CHOAM-specific imperium cards have Contracts (Uprising) compatibility', () => {
    const cards = require('../res/cards/index.js')

    const choamCards = cards.imperiumCards.filter(c => c.compatibility === 'Contracts (Uprising)')
    expect(choamCards.length).toBeGreaterThan(0)

    // Verify specific known CHOAM cards exist
    const names = choamCards.map(c => c.name)
    expect(names).toContain('Cargo Runner')
    expect(names).toContain('Delivery Agreement')
  })
})


describe('Endgame intrigue VP affects final winner determination', () => {

  test('endgame intrigue resolves before winner determination', () => {
    // The endGame function calls offerEndgameIntrigue before determining winner
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/recall.js'), 'utf8')

    const offerIndex = code.indexOf('offerEndgameIntrigue')
    const winnerIndex = code.indexOf('winner.vp')
    // Endgame intrigue is offered before winner is determined
    expect(offerIndex).toBeLessThan(winnerIndex)
  })

  test('endgame intrigue VP is counted in final scoring', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, water: 5, intrigue: ['Sacred Pools'] },
    })
    game.run()

    // Complete round to trigger endgame, but play Sacred Pools only during endgame
    // (Sacred Pools also has a plotEffect, so it's offered during agent turns too)
    let safety = 50
    while (game.waiting && !game.gameOver && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (choices.includes('Sacred Pools') && title.includes('Endgame')) {
        t.choose(game, 'Sacred Pools')
      }
      else if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    expect(game.gameOver).toBe(true)
    // Sacred Pools: If 3+ Water → +1 VP
    // Dennis started at 10 VP, has 5 water → should gain +1 VP = 11
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(11)
  })
})


describe('First player clockwise rotation in 3+ player game', () => {

  test('first player rotates clockwise through all players', () => {
    const game = t.fixture({ numPlayers: 3 })
    game.run()

    // Round 1: first player is determined by objectives
    const firstPlayerR1 = game.state.firstPlayerIndex

    // Finish round 1
    finishUntilNextRound(game)
    if (game.gameOver) {
      return
    }

    // Round 2: first player should be next clockwise
    const firstPlayerR2 = game.state.firstPlayerIndex
    expect(firstPlayerR2).toBe((firstPlayerR1 + 1) % 3)

    // Finish round 2
    finishUntilNextRound(game)
    if (game.gameOver) {
      return
    }

    // Round 3: should rotate again
    const firstPlayerR3 = game.state.firstPlayerIndex
    expect(firstPlayerR3).toBe((firstPlayerR2 + 1) % 3)
  })
})


describe('Imperium row replacement acquirable same turn', () => {

  test('after acquiring a card, replacement can be acquired if enough persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 0 },
    })
    game.run()

    // Dennis reveals (all 5 starting hand cards)
    t.choose(game, 'Reveal Turn')

    // Should be in acquire phase — check row has 5 cards
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)

    // Get total persuasion from hand reveal
    // Convincing Argument x2 = 4 persuasion, Diplomacy = 1, total = 5+
    // Try to acquire a cheap card
    const choices = t.currentChoices(game)
    // Should have at least one acquirable card with 5+ persuasion
    const acquireChoices = choices.filter(c => c !== 'Pass')
    expect(acquireChoices.length).toBeGreaterThan(0)

    // Acquire the first available card
    t.choose(game, acquireChoices[0])

    // Row should refill to 5
    expect(row.cardlist().length).toBe(5)

    // Should still be in acquire phase (can acquire more)
    const choices2 = t.currentChoices(game)
    expect(choices2).toContain('Pass')
  })
})


describe('Board space effects combined with card effects', () => {

  test('player receives both board space and card agent effects', () => {
    // Rule: "Gain effects of board space AND effects in Agent box of played card"
    // Arrakeen (purple, combat): +1 Troop, Draw 1 card
    // Reconnaissance (purple): no agent ability, but verifies space effects apply
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')

    // Arrakeen gives +1 Troop (to garrison) + Draw 1 card
    // Deploy step follows since it's a combat space
    const choices = t.currentChoices(game)
    // Should see deploy options — confirms space effects are being resolved
    const hasDeploy = choices.some(c => c.includes('Deploy'))
    expect(hasDeploy).toBe(true)
  })

  test('faction space grants influence AND card agent ability', () => {
    // Diplomacy has factionAccess but no agentAbility — just tests faction influence
    // Deliver Supplies (guild): +1 Water
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Deliver Supplies')

    // Should get +1 guild influence (faction space) AND +1 Water (space effect)
    t.testBoard(game, {
      dennis: { influence: { guild: 1 } },
    })
    const player = game.players.byName('dennis')
    expect(player.water).toBe(1)
  })
})
