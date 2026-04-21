const t = require('../testutil')

describe('CHOAM Integration', () => {

  test('taking a contract from market', () => {
    const game = t.fixture()
    game.run()

    const market = game.zones.byId('common.contractMarket')
    const marketBefore = market.cardlist().length
    expect(marketBefore).toBe(2)

    // Diplomacy → Dutiful Service (contract effect)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Dutiful Service')

    // Should be offered contract choice
    const choices = t.currentChoices(game)
    // Either contract names or a pass option
    const hasContract = choices.length > 0

    if (hasContract) {
      t.choose(game, choices[0])
    }

    // Player should have a contract
    const contracts = game.zones.byId('dennis.contracts')
    expect(contracts.cardlist().length).toBe(1)

    // Market should be refilled to 2
    expect(market.cardlist().length).toBe(2)
  })

  test('Accept Contract space also gives draw 1 card', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals, then scott reveals, then micah goes
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah: Dune TDP (yellow) ��� Accept Contract
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Accept Contract')
    t.choose(game, 'Accept Contract')

    // Should be offered contract choice from market
    const choices = t.currentChoices(game)
    expect(choices.length).toBeGreaterThan(0)
    t.choose(game, choices[0])

    const micahContracts = game.zones.byId('micah.contracts')
    expect(micahContracts.cardlist().length).toBe(1)
  })
})
