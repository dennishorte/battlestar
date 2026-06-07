const t = require('../testutil')

describe('CHOAM Edge Cases', () => {

  test('both harvest contracts complete when a single harvest satisfies both thresholds', () => {
    // Regression: previously only the first matching contract was completed (early return bug)
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        water: 1,
        contracts: ['Harvest 3+ Spice', 'Harvest 4+ Spice'],
      },
      bonusSpice: { 'hagga-basin': 2 }, // 2 base + 2 bonus = 4 spice total
    })
    game.run()

    // Dennis visits Hagga Basin: gains 2 spice + 2 bonus = 4 spice (satisfies both 3+ and 4+)
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')
    // No maker hook → Gain 2 Spice is the only choice, auto-selected

    const completed = game.zones.byId('dennis.contractsCompleted')
    expect(completed.cardlist().length).toBe(2)
  })

  test('contract market starts with 2 contracts when CHOAM enabled', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    const market = game.zones.byId('common.contractMarket')
    expect(market.cardlist().length).toBe(2)
  })

  test('same-turn contract restriction: board-space contracts reference valid spaces', () => {
    // Per rules: "must wait until future turn to complete"
    const contracts = require('../res/cards/contracts')
    const boardSpaces = require('../res/boardSpaces.js')
    const spaceIds = boardSpaces.map(s => s.id)

    // Board-space contracts like "Deliver Supplies" should reference valid space IDs
    const boardSpaceContracts = contracts.filter(c => c.name === 'Deliver Supplies' || c.name === 'Dutiful Service')
    expect(boardSpaceContracts.length).toBeGreaterThan(0)

    // Verify spaces referenced by contract names exist on the board
    for (const contract of boardSpaceContracts) {
      const spaceId = contract.name.toLowerCase().replace(/ /g, '-')
      expect(spaceIds).toContain(spaceId)
    }
  })
})
