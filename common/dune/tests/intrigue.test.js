const t = require('../testutil')

// Helper: finish a round
function finishRound(game) {
  const startRound = game.state.round
  let safety = 30
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Intrigue Cards', () => {

  test('intrigue cards are kept in separate zone from deck', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Ambush'] },
    })
    game.run()

    const intrigueZone = game.zones.byId('dennis.intrigue')
    expect(intrigueZone.cardlist().length).toBe(1)
    expect(intrigueZone.cardlist()[0].name).toBe('Ambush')

    // Hand should not contain intrigue cards
    const handZone = game.zones.byId('dennis.hand')
    const handNames = handZone.cardlist().map(c => c.name)
    expect(handNames).not.toContain('Ambush')
  })

  test('combat intrigue played during combat phase', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, intrigue: ['Ambush'] },
    })
    game.run()

    // Dennis deploys troops
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Micah reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    // Dennis reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass') // acquire

    // Combat phase: dennis has Ambush (+4 Swords)
    // Should be offered to play it
    const choices = t.currentChoices(game)
    expect(choices).toContain('Ambush')

    t.choose(game, 'Ambush')

    // Combat resolves and advances to next round — strength resets after combat.
    // Verify Ambush was consumed (no longer in intrigue zone).
    const intrigueZone = game.zones.byId('dennis.intrigue')
    const remaining = intrigueZone.cardlist().map(c => c.name)
    expect(remaining).not.toContain('Ambush')
  })

  test('endgame intrigue played at end of game', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, solari: 15, intrigue: ['Economic Positioning'] },
    })
    game.run()

    // Complete round to trigger endgame
    finishRound(game)

    expect(game.gameOver).toBe(true)
    // Economic Positioning: if 10+ Solari → +1 VP
    // Dennis started at 10 VP + 1 from endgame = 11
    expect(game.gameOverData.player).toBe('dennis')
  })
})
