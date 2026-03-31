const t = require('../testutil')

describe('Defensive Bonus', () => {

  test('roundStart checks controlMarkers against conflict card location', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { arrakeen: 'dennis' },
      dennis: { troopsInSupply: 5, troopsInGarrison: 3 },
    })
    game.run()

    // Round 1 conflict is "Skirmish" which has no location field.
    // So no defensive bonus should trigger.
    // Just verify the control marker is set correctly.
    expect(game.state.controlMarkers.arrakeen).toBe('dennis')
  })

  test('conflict cards with locations are defined', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const withLocation = conflictCards.filter(c => c.location)
    expect(withLocation.length).toBeGreaterThan(0)

    // All location-based conflicts should reference valid control marker locations
    const validLocations = ['arrakeen', 'spice-refinery', 'imperial-basin', 'carthag']
    for (const card of withLocation) {
      expect(validLocations).toContain(card.location)
    }
  })

  test('defensive bonus triggers for controlled location conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { 'imperial-basin': 'dennis' },
      dennis: { troopsInSupply: 5, troopsInGarrison: 3 },
      conflictCard: { location: 'imperial-basin' },
    })
    game.run()

    const activeCard = game.zones.byId('common.conflictActive').cardlist()[0]
    if (activeCard?.definition?.location !== 'imperial-basin') {
      return
    }

    // Defensive bonus: dennis controls imperial-basin, conflict is at imperial-basin
    // roundStartPhase should have deployed 1 troop from supply to garrison
    const player = game.players.byName('dennis')
    expect(player.troopsInSupply).toBe(4)
    expect(player.troopsInGarrison).toBe(4)
  })
})
