const t = require('../testutil')

describe('Units and Deployment', () => {

  test('can deploy up to 2 from pre-existing garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    // Reconnaissance (purple) → Arrakeen (combat space, +1 troop)
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    // 3 pre-existing + 1 recruited = 4 in garrison
    // Can deploy: 1 recruited + min(2, 3 pre-existing) = 3
    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 0 troop(s) from garrison')
    expect(choices).toContain('Deploy 1 troop(s) from garrison')
    expect(choices).toContain('Deploy 2 troop(s) from garrison')
    expect(choices).toContain('Deploy 3 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 4 troop(s) from garrison')
  })

  test('recruited troops from action space are deployable beyond the 2-garrison limit', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0, troopsInSupply: 9 },
    })
    game.run()

    // Arrakeen gives +1 troop; 0 pre-existing garrison
    // Can deploy: 1 recruited + min(2, 0 pre-existing) = 1
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 0 troop(s) from garrison')
    expect(choices).toContain('Deploy 1 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 2 troop(s) from garrison')
  })

  test('deploying troops moves them from garrison to conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Starting garrison: 3, +1 recruited = 4, -2 deployed = 2
    const player = game.players.byName('dennis')
    expect(player.troopsInGarrison).toBe(2)
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
  })

  test('recruiting troops goes to garrison (not conflict)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0, troopsInSupply: 9 },
    })
    game.run()

    // Arrakeen gives +1 troop
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const player = game.players.byName('dennis')
    // Recruited 1 to garrison, deployed 0
    expect(player.troopsInGarrison).toBe(1)
    expect(player.troopsInSupply).toBe(8)
  })

  test('non-combat space does not offer deployment', () => {
    const game = t.fixture()
    game.run()

    // Dagger (green) → Assembly Hall (non-combat)
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    // Should NOT be at a deploy prompt — should be at plot intrigue or next player
    const choices = t.currentChoices(game)
    const hasDeployChoice = choices.some(c => c.includes('Deploy'))
    expect(hasDeployChoice).toBe(false)
  })

  test('with no garrison and no recruitment, deployment is skipped', () => {
    const game = t.fixture({ seed: 'deploy_skip' })
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0 },
    })
    game.run()

    // Imperial Basin is combat + maker space but gives spice harvest, not troops
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')

    // 0 pre-existing garrison, 0 recruited → deployment skipped
    const choices = t.currentChoices(game)
    const hasDeployChoice = choices.some(c => c.includes('Deploy'))
    expect(hasDeployChoice).toBe(false)
  })

  test('large troop recruitment allows deploying all recruited plus 2 from garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 2, troopsInSupply: 9, spice: 5 },
    })
    game.run()

    // Heighliner (guild combat space) costs 5 spice, gives +5 troops
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Heighliner')

    // 2 pre-existing + 5 recruited = 7 in garrison
    // Can deploy: 5 recruited + min(2, 2 pre-existing) = 7
    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 7 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 8 troop(s) from garrison')
  })

  test('troops from card agent ability count as recruited for deployment', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 2, troopsInSupply: 9 },
    })
    // Inject "Arrakis Recruiter" (purple, agentAbility: '+1 Troop') into hand
    game.testSetBreakpoint('initialization-complete', (game) => {
      const imperiumDeck = game.zones.byId('common.imperiumDeck')
      const hand = game.zones.byId('dennis.hand')
      const card = imperiumDeck.cardlist().find(c => c.name === 'Arrakis Recruiter')
      if (card) {
        card.moveTo(hand)
      }
    })
    game.run()

    // Arrakis Recruiter (+1 troop from card) → Arrakeen (+1 troop from space) = 2 recruited
    t.choose(game, 'Agent Turn.Arrakis Recruiter')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Arrakis Recruiter')

    // 2 pre-existing + 2 recruited = 4 in garrison
    // Can deploy: 2 recruited + min(2, 2 pre-existing) = 4
    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 4 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 5 troop(s) from garrison')
  })

  test('troops from a contract completed this turn are deployable', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { troopsInGarrison: 2, troopsInSupply: 9 },
    })
    // Place the +2 Troops Spice Refinery contract (by id, since multiple
    // contracts share the name "Spice Refinery").
    game.testSetBreakpoint('initialization-complete', (game) => {
      const contractDeck = game.zones.byId('common.contractDeck')
      const contractMarket = game.zones.byId('common.contractMarket')
      const playerContracts = game.zones.byId('dennis.contracts')
      const pool = [...contractMarket.cardlist(), ...contractDeck.cardlist()]
      const card = pool.find(c => c.defId === 'spice-refinery-3')
      card.moveTo(playerContracts)
    })
    game.run()

    // Reconnaissance (purple) → Spice Refinery (combat space)
    // Spice Refinery contract completes on visit → +2 troops to garrison.
    // The "Pay 1 Spice, gain 4 Solari" option is filtered out (0 spice), so
    // the space effect resolves silently.
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Spice Refinery')

    // 2 pre-existing + 2 from contract = 4 in garrison
    // Can deploy: 2 recruited + min(2, 2 pre-existing) = 4
    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 4 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 5 troop(s) from garrison')
  })

  test('only 2 from garrison when no troops recruited on combat space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5 },
    })
    game.run()

    // Fremkit (fremen combat space) gives draw 1, not troops
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Fremkit')

    // 5 pre-existing, 0 recruited → can deploy up to 2
    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 2 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 3 troop(s) from garrison')
  })

  test('troops from an end-of-turn Plot Intrigue card are still deployable', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0, troopsInSupply: 9, intrigue: ['Honor Guard'] },
    })
    game.run()

    // Decline the start-of-turn Plot Intrigue offer
    t.choose(game, 'Pass')

    // Fremkit (fremen combat space) gives draw 1, not troops — nothing to
    // deploy from the space itself
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Fremkit')

    // End-of-turn Plot Intrigue: Honor Guard grants +1 Troop. Deploying
    // troops to the Conflict must happen last so this troop is still
    // deployable this turn.
    t.choose(game, 'Honor Guard')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 0 troop(s) from garrison')
    expect(choices).toContain('Deploy 1 troop(s) from garrison')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(0)
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })
})
