const t = require('../testutil')

describe('Units and Deployment', () => {

  test('combat space offers deployment of 0 to 2 troops from garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    // Reconnaissance (purple) → Arrakeen (combat space)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 0 troop(s) from garrison')
    expect(choices).toContain('Deploy 1 troop(s) from garrison')
    expect(choices).toContain('Deploy 2 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 3 troop(s) from garrison')
  })

  test('deploying troops moves them from garrison to conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Arrakeen gives +1 troop to garrison, then we deploy 2 from garrison
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
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
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
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')
    t.choose(game, 'Assembly Hall')

    // Should NOT be at a deploy prompt — should be at plot intrigue or next player
    const choices = t.currentChoices(game)
    const hasDeployChoice = choices.some(c => c.includes('Deploy'))
    expect(hasDeployChoice).toBe(false)
  })
})
