const t = require('../testutil')

const NO_ICON_OBJ = {
  id: 'test-obj-no-icon',
  name: 'Test Objective',
  battleIcon: null,
  isFirstPlayer: true,
}

// Resolve prompts until the next round. Prefer pay/return reward options over Pass.
function finishUntilNextRound(game) {
  const startRound = game.state.round
  let safety = 80
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    const payOrReturn = choices.find(c =>
      c.startsWith('Pay ') || c.startsWith('Return ')
    )
    if (payOrReturn) {
      t.choose(game, payOrReturn)
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
}

describe('Sandworm Reward Doubling', () => {

  test('sandworm offers pay-for-VP reward a second time', () => {
    // Battle for Imperial Basin (Uprising) 1st:
    // "+1 Victory point and Imperial Basin Control and Pay 4 Spice for +1 Victory point"
    // With sandworms: base VP doubles to 2; control is not doubled; pay option offered twice.
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: { id: 'conflict-battle-for-imperial-basin-uprising' },
      dennis: { spice: 8, vp: 0, solari: 0 },
      objectives: { dennis: NO_ICON_OBJ },
      conflict: { deployedSandworms: { dennis: 1 } },
    })
    game.run()

    finishUntilNextRound(game)

    const dennis = game.players.byName('dennis')
    // 2 (doubled base VP) + 1 (first pay) + 1 (second pay) = 4
    expect(dennis.vp).toBe(4)
    expect(dennis.spice).toBe(0)
    expect(game.state.controlMarkers['imperial-basin']).toBe('dennis')
  })

  test('without sandworms, pay-for-VP is offered only once', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: { id: 'conflict-battle-for-imperial-basin-uprising' },
      dennis: { troopsInGarrison: 5, spice: 8, vp: 0 },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')
    finishUntilNextRound(game)

    const dennis = game.players.byName('dennis')
    // 1 (base VP) + 1 (single pay) = 2
    expect(dennis.vp).toBe(2)
    expect(dennis.spice).toBe(4)
  })

  test('sandworm offers return-spies-for-VP a second time', () => {
    // Battle for Arrakeen (Uprising) 1st:
    // "+1 Victory point and Arrakeen Control and Return 2 Spies for +1 Victory point"
    // With sandworms: base VP → 2; return-spies offered twice (4 spies → +2 VP).
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: { id: 'conflict-battle-for-arrakeen-uprising' },
      dennis: { spiesInSupply: 0, vp: 0 },
      objectives: { dennis: NO_ICON_OBJ },
      spyPosts: { A: ['dennis'], B: ['dennis'], C: ['dennis'], D: ['dennis'] },
      conflict: { deployedSandworms: { dennis: 1 } },
    })
    game.run()

    finishUntilNextRound(game)

    const dennis = game.players.byName('dennis')
    // 2 (doubled base VP) + 1 + 1 (return spies twice) = 4
    expect(dennis.vp).toBe(4)
    expect(dennis.spiesInSupply).toBe(4)
    expect(game.state.controlMarkers.arrakeen).toBe('dennis')
  })

  test('resources double but control does not', () => {
    // Secure Imperial Basin (Uprising) 1st: "+2 Spice and +1 Troop and Imperial Basin Control"
    // With sandworms: spice/troop double, control once.
    const game = t.fixture()
    t.setBoard(game, {
      conflictCard: { id: 'conflict-secure-imperial-basin-uprising' },
      dennis: { spice: 0, troopsInGarrison: 0, troopsInSupply: 10 },
      objectives: { dennis: NO_ICON_OBJ },
      conflict: { deployedSandworms: { dennis: 1 } },
    })
    game.run()

    finishUntilNextRound(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(4)
    expect(dennis.troopsInGarrison).toBe(2)
    expect(game.state.controlMarkers['imperial-basin']).toBe('dennis')
  })
})
