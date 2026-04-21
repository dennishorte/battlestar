const t = require('../testutil')

// Helper: resolve remaining prompts until the next round starts.
// Handles acquire passes, combat rewards (influence choices), etc.
function finishUntilNextRound(game) {
  const startRound = game.state.round
  let safety = 30
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

describe('Combat Integration', () => {

  test('troops return to supply (not garrison) after combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, troopsInSupply: 9 },
    })
    game.run()

    // Dennis sends agent to Arrakeen (combat space), deploys 2
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Finish round (scott + micah reveal, combat, makers, recall)
    finishUntilNextRound(game)

    expect(game.state.round).toBe(2)
    const player = game.players.byName('dennis')
    // Starting: garrison=3, supply=9
    // Arrakeen recruited 1 (supply→garrison): garrison=4, supply=8
    // Deployed 2 from garrison: garrison=2, supply=8, conflict=2
    // After combat: conflict troops → supply: garrison=2, supply=10
    expect(player.troopsInGarrison).toBe(2)
    expect(player.troopsInSupply).toBe(10)
  })

  test('combat markers reset to 0 after combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Finish round (scott + micah reveal, dennis reveals, combat, makers, recall)
    finishUntilNextRound(game)

    expect(game.state.round).toBe(2)
    const player = game.players.byName('dennis')
    expect(player.strength).toBe(0)
    expect(game.state.conflict.deployedTroops.dennis).toBe(0)
  })

  test('player with 0 strength gets no combat reward', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 0 },
    })
    game.run()

    // All reveal — no troops deployed
    finishUntilNextRound(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
  })

  test('winner gets first place reward from conflict card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: 'Shadow Contest',
      dennis: { troopsInGarrison: 3, solari: 0 },
    })
    game.run()

    // Dennis deploys troops
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Finish round (scott + micah reveal, dennis reveals, combat)
    finishUntilNextRound(game)

    // Combat resolves automatically — Dennis wins (only participant)
    // Shadow Contest 1st: "+1 Bene Gesserit Influence and +1 Intrigue card"
    expect(game.state.round).toBe(2)
    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('bene-gesserit')).toBe(1)
  })

  test('second place gets second reward', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: 'CHOAM Security',
      dennis: { troopsInGarrison: 3, solari: 0 },
      micah: { troopsInGarrison: 1, solari: 0 },
    })
    game.run()

    // Dennis: deploy 2 troops to conflict via Arrakeen
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Scott reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah: deploy 1 troop to conflict via Imperial Basin
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // All reveal + combat resolves automatically
    finishUntilNextRound(game)

    expect(game.state.round).toBe(2)
    // Micah should have received 2nd place reward: "+1 Water and +2 Troops and +2 Solari"
    const micah = game.players.byName('micah')
    expect(micah.solari).toBeGreaterThanOrEqual(2)
  })
})
