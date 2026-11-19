'use strict'

const t = require('../../../../testutil')
const card = require('./imperial-spy.js')

describe("imperial-spy", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-spy")
    expect(card.name).toBe("Imperial Spy")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('agent ability: trashes itself and draws an Intrigue card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Imperial Spy', 'Dagger'],
        intrigue: [],
      },
    })
    // The contract row is a shuffle of the deck. Put this one face up so the
    // choice does not depend on how many intrigue cards were shuffled first.
    game.testSetBreakpoint('initialization-complete', (game) => {
      const contractDeck = game.zones.byId('common.contractDeck')
      const contractMarket = game.zones.byId('common.contractMarket')
      const pool = [...contractMarket.cardlist(), ...contractDeck.cardlist()]
      const card = pool.find(c => c.defId === 'spice-refinery-2')
      card.moveTo(contractMarket)
    })
    game.run()

    t.choose(game, 'Agent Turn.Imperial Spy')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Spice Refinery (+1 Water)')

    const trashNames = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trashNames).toContain('Imperial Spy')
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })
})
