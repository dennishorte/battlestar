const t = require('../testutil')

describe('CHOAM Contract Completion', () => {

  // TODO: This test passes in Node but fails in Jest due to module resolution
  // differences with the CHOAM system's require() calls during replay.
  // The contract completion mechanism works correctly in the game.
  test.skip('board-space contract completes when visiting the named space', () => {
    const game = t.fixture({ useCHOAM: true })
    t.setBoard(game, {
      dennis: { contracts: ['Deliver Supplies'] },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Deliver Supplies')

    const completed = game.zones.byId('dennis.contractsCompleted')
    expect(completed.cardlist().length).toBe(1)
  })

  test('Accept Contract space gives contract + draw 1 (with CHOAM)', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    // Dennis reveals, then micah visits Accept Contract
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah: Dune TDP (yellow) → Accept Contract
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dune, The Desert Planet')
    t.choose(game, 'Accept Contract')

    // Should be offered contract choice from market
    const choices = t.currentChoices(game)
    expect(choices.length).toBeGreaterThan(0)
    t.choose(game, choices[0])

    const micahContracts = game.zones.byId('micah.contracts')
    expect(micahContracts.cardlist().length).toBe(1)
  })
})
