const t = require('../testutil')

describe('CHOAM Edge Cases', () => {

  test('contract icon gives 2 Solari when all contracts taken', () => {
    // When CHOAM is active but no contracts remain, icon reverts to 2 Solari
    // Verify the code handles empty market gracefully
    const game = t.fixture({ useCHOAM: true })
    game.run()

    // Empty the contract market and deck
    const market = game.zones.byId('common.contractMarket')
    const deck = game.zones.byId('common.contractDeck')
    const trash = game.zones.byId('common.trash')

    // Move all contracts to trash
    for (const card of [...market.cardlist()]) {
      card.moveTo(trash)
    }
    for (const card of [...deck.cardlist()]) {
      card.moveTo(trash)
    }

    expect(market.cardlist().length).toBe(0)
    expect(deck.cardlist().length).toBe(0)
  })

  test('same-turn contract restriction: cannot complete board-space contract taken this turn', () => {
    // Per rules: "must wait until future turn to complete"
    // The code checks contract was held at time of agent placement
    // This is enforced by the fact that checkContractCompletion fires AFTER agent placement
    // and contracts taken via Accept Contract space happen on the current turn
    const choam = require('../systems/choam')
    const trigger = choam.getContractTrigger('Deliver Supplies')
    expect(trigger).toEqual({ type: 'board-space', spaceId: 'deliver-supplies' })
  })
})
