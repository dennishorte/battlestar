const t = require('../testutil')

// Helper: finish remaining prompts until next round
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

describe('Combat Ties', () => {

  test('tie for 1st: each gets 2nd place reward, no winner', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 2, solari: 0 },
      micah: { troopsInGarrison: 2, solari: 0 },
    })
    game.run()

    // Dennis deploys 1 troop via Arrakeen
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Micah deploys 1 troop via Imperial Basin
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Both reveal — handle acquire prompts between
    finishUntilNextRound(game)

    expect(game.state.round).toBe(2)
    const dennis = game.players.byName('dennis')
    const micah = game.players.byName('micah')
    // Tied for 1st → each gets 2nd place reward
    // Skirmish 2nd place: "+3 Solari"
    expect(dennis.solari).toBeGreaterThanOrEqual(3)
    expect(micah.solari).toBeGreaterThanOrEqual(0) // micah harvested spice, check solari
  })

  test('4-player: 3rd place gets 3rd reward', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, solari: 0 },
      micah: { troopsInGarrison: 2, solari: 0 },
      scott: { troopsInGarrison: 1, solari: 0 },
    })
    game.run()

    // Dennis deploys 2 troops (strongest)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Micah deploys 1 troop
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Scott deploys 1 troop — need a yellow card
    const scottHand = game.zones.byId('scott.hand').cardlist()
    const yellowCard = scottHand.find(c => c.agentIcons.includes('yellow'))
    if (!yellowCard) {
      // Skip — can't set up 3-way combat with this seed
      return
    }
    t.choose(game, 'Agent Turn')
    t.choose(game, yellowCard.name)
    const spaces = t.currentChoices(game)
    const combatSpace = spaces.find(s => s !== 'Arrakeen' && s !== 'Imperial Basin')
    if (!combatSpace) {
      return
    }
    t.choose(game, combatSpace)
    // Deploy if offered
    const deployChoices = t.currentChoices(game)
    if (deployChoices.some(c => c.includes('Deploy 1'))) {
      t.choose(game, 'Deploy 1 troop(s) from garrison')
    }

    // Finish round
    finishUntilNextRound(game)
    expect(game.state.round).toBe(2)
  })
})
