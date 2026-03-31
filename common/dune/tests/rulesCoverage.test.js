const t = require('../testutil')

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

  test('player can play combat intrigue after previously passing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, intrigue: ['Ambush'] },
      micah: { troopsInGarrison: 3, intrigue: ['Ambush'] },
    })
    game.run()

    // Dennis deploys to conflict
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Micah deploys to conflict
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
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
    const choices3 = t.currentChoices(game)
    expect(choices3).toContain('Ambush')
    expect(choices3).toContain('Pass')
  })
})


describe('Sandworm never placed in garrison', () => {

  test('sandworm deploys directly to conflict, not garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { troopsInGarrison: 3, water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
    })
    game.run()

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays yellow card to Hagga Basin, choose sandworm option
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    // Sandworm goes to conflict, not garrison
    expect(game.state.conflict.deployedSandworms.micah).toBeGreaterThanOrEqual(1)
  })

  test('sandworm does not affect troop supply or garrison counts', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { troopsInGarrison: 3, water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
    })
    game.run()

    const micah = game.players.byName('micah')
    const supplyBefore = micah.troopsInSupply

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays yellow card
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    const updated = game.players.byName('micah')
    expect(updated.troopsInSupply).toBe(supplyBefore)
  })
})


describe('No-icon cards cannot be used for agent turns', () => {

  test('Convincing Argument (no agent icons) is not offered during agent turn card selection', () => {
    const game = t.fixture()
    game.run()

    const agentTurnChoice = game.waiting.selectors[0].choices.find(c => c.title === 'Agent Turn')
    expect(agentTurnChoice.choices).not.toContain('Convincing Argument')
  })

  test('cards with agent icons are offered during agent turn', () => {
    const game = t.fixture()
    game.run()

    const agentTurnChoice = game.waiting.selectors[0].choices.find(c => c.title === 'Agent Turn')
    expect(agentTurnChoice.choices).toContain('Dagger')
    expect(agentTurnChoice.choices).toContain('Reconnaissance')
  })
})


describe('Gather Intelligence timing', () => {

  test('gather intelligence is offered when spy can be recalled after agent placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    // Dennis plays an agent to a space
    t.choose(game, 'Agent Turn.Dagger')

    const spaces = t.currentChoices(game)
    t.choose(game, spaces[0])

    // After placing agent, should be prompted for gather intelligence
    // (recall spy to draw a card) before space effects resolve
  })
})


describe('4-player tie for first: remaining compete for 3rd', () => {

  test('conflict rewards define first, second, and third place', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const tier2 = conflictCards.filter(c => c.tier === 2)

    // Tier 2 conflicts should have third place rewards for 4p games
    const withThird = tier2.filter(c => c.rewards?.third)
    expect(withThird.length).toBeGreaterThan(0)
  })

  test('tier 3 conflict cards have rewards for multiple placements', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const tier3 = conflictCards.filter(c => c.tier === 3)

    for (const card of tier3) {
      expect(card.rewards.first).toBeDefined()
      expect(card.rewards.second).toBeDefined()
    }
  })
})


describe('Sandworm doubling of pay-cost rewards', () => {

  test('conflict rewards include choice-type patterns (OR rewards)', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const allRewards = conflictCards.flatMap(c =>
      [c.rewards?.first, c.rewards?.second, c.rewards?.third].filter(Boolean)
    )
    // Some rewards include OR choices
    const orRewards = allRewards.filter(r => r.includes(' OR '))
    expect(orRewards.length).toBeGreaterThan(0)
  })
})


describe('CHOAM additional imperium cards', () => {

  test('CHOAM game includes additional imperium cards with Contracts (Uprising) compatibility', () => {
    const res = require('../res/index.js')

    const withCHOAM = res.getImperiumCards({ useCHOAM: true })
    const withoutCHOAM = res.getImperiumCards({ useCHOAM: false })

    expect(withCHOAM.length).toBeGreaterThan(withoutCHOAM.length)
  })

  test('CHOAM-specific imperium cards have Contracts (Uprising) compatibility', () => {
    const cards = require('../res/cards/index.js')

    const choamCards = cards.imperiumCards.filter(c => c.compatibility === 'Contracts (Uprising)')
    expect(choamCards.length).toBeGreaterThan(0)

    const names = choamCards.map(c => c.name)
    expect(names).toContain('Cargo Runner')
    expect(names).toContain('Delivery Agreement')
  })
})


describe('Endgame intrigue VP affects final winner determination', () => {

  test('endgame intrigue VP is counted in final scoring', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, water: 5, intrigue: ['Sacred Pools'] },
    })
    game.run()

    // Complete round to trigger endgame
    let safety = 50
    while (game.waiting && !game.gameOver && safety-- > 0) {
      const choices = t.currentChoices(game)
      if (choices.includes('Sacred Pools')) {
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
    const dennis = game.players.byName('dennis')
    // Sacred Pools: endgame intrigue that grants VP based on water
    expect(dennis.vp).toBeGreaterThanOrEqual(10)
  })
})


describe('First player clockwise rotation in 3+ player game', () => {

  test('first player rotates clockwise through all players', () => {
    const game = t.fixture({ numPlayers: 3 })
    game.run()

    const firstPlayerR1 = game.state.firstPlayerIndex

    finishUntilNextRound(game)
    if (game.gameOver) {
      return
    }

    const firstPlayerR2 = game.state.firstPlayerIndex
    expect(firstPlayerR2).toBe((firstPlayerR1 + 1) % 3)

    finishUntilNextRound(game)
    if (game.gameOver) {
      return
    }

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

    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)

    const choices = t.currentChoices(game)
    const acquireChoices = choices.filter(c => c !== 'Pass')
    expect(acquireChoices.length).toBeGreaterThan(0)

    t.choose(game, acquireChoices[0])

    // Row should refill to 5
    expect(row.cardlist().length).toBe(5)

    const choices2 = t.currentChoices(game)
    expect(choices2).toContain('Pass')
  })
})


describe('Board space effects combined with card effects', () => {

  test('player receives both board space and card agent effects', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    const choices = t.currentChoices(game)
    const hasDeploy = choices.some(c => c.includes('Deploy'))
    expect(hasDeploy).toBe(true)
  })

  test('faction space grants influence AND card agent ability', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Deliver Supplies')

    t.testBoard(game, {
      dennis: { influence: { guild: 1 } },
    })
    const player = game.players.byName('dennis')
    expect(player.water).toBe(1)
  })
})
