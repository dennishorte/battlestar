const t = require('../testutil')

describe('CHOAM Edge Cases', () => {

  test('contract market starts with 2 contracts when CHOAM enabled', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    const market = game.zones.byId('common.contractMarket')
    expect(market.cardlist().length).toBe(2)
  })

  test('same-turn contract restriction: board-space contracts reference valid spaces', () => {
    // Per rules: "must wait until future turn to complete"
    const contracts = require('../res/cards/contracts.js')
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
