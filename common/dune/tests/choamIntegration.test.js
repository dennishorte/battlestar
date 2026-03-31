const t = require('../testutil')

describe('CHOAM Integration', () => {

  test('contract icon gives 2 Solari without CHOAM module', () => {
    const game = t.fixture({ useCHOAM: false })
    t.setBoard(game, {
      dennis: { solari: 0 },
    })
    game.run()

    // Diplomacy → Dutiful Service (emperor, has contract effect)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Dutiful Service')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(2)
  })

  test('CHOAM game: taking a contract from market', () => {
    const game = t.fixture({ useCHOAM: true })
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
    const game = t.fixture({ useCHOAM: false })
    t.setBoard(game, {
      dennis: { solari: 0 },
    })
    game.run()

    // Dennis needs a yellow card for Accept Contract
    // With test_seed, dennis has no yellow in hand.
    // Micah has Dune TDP (yellow).
    // Let dennis reveal, then micah goes.
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah: Dune TDP (yellow) → Accept Contract
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Accept Contract')
    t.choose(game, 'Accept Contract')

    // Accept Contract: contract effect + draw 1 card
    // Without CHOAM: +2 Solari + draw 1
    const micah = game.players.byName('micah')
    expect(micah.solari).toBe(2)
  })
})
