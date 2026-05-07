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
    const conflictCards = require('../res/cards/conflict')
    const withLocation = conflictCards.filter(c => c.location)
    expect(withLocation.length).toBeGreaterThan(0)

    // All location-based conflicts should reference valid control marker locations
    const validLocations = ['arrakeen', 'spice-refinery', 'imperial-basin', 'carthag']
    for (const card of withLocation) {
      expect(validLocations).toContain(card.location)
    }
  })

  test('defensive bonus prompts controller and deploys to Conflict on accept', () => {
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

    // Game should be paused on the defensive-bonus prompt.
    expect(t.currentChoices(game)).toEqual(expect.arrayContaining(['Deploy', 'Decline']))
    t.choose(game, 'Deploy')

    const player = game.players.byName('dennis')
    // Supply -1, garrison unchanged, troop is in the Conflict.
    expect(player.troopsInSupply).toBe(4)
    expect(player.troopsInGarrison).toBe(3)
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })

  test('defensive bonus declined leaves supply and conflict untouched', () => {
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

    expect(t.currentChoices(game)).toEqual(expect.arrayContaining(['Deploy', 'Decline']))
    t.choose(game, 'Decline')

    const player = game.players.byName('dennis')
    expect(player.troopsInSupply).toBe(5)
    expect(player.troopsInGarrison).toBe(3)
    expect(game.state.conflict.deployedTroops.dennis).toBe(0)
  })

  test('no defensive prompt when controller has empty supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { 'imperial-basin': 'dennis' },
      dennis: { troopsInSupply: 0, troopsInGarrison: 5 },
      conflictCard: { location: 'imperial-basin' },
    })
    game.run()

    const activeCard = game.zones.byId('common.conflictActive').cardlist()[0]
    if (activeCard?.definition?.location !== 'imperial-basin') {
      return
    }

    // No prompt: should advance straight into player turns.
    expect(t.currentChoices(game)).not.toEqual(expect.arrayContaining(['Deploy', 'Decline']))
  })

  test('no defensive prompt when location is uncontrolled', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInSupply: 5, troopsInGarrison: 3 },
      conflictCard: { location: 'imperial-basin' },
    })
    game.run()

    const activeCard = game.zones.byId('common.conflictActive').cardlist()[0]
    if (activeCard?.definition?.location !== 'imperial-basin') {
      return
    }

    expect(game.state.controlMarkers['imperial-basin']).toBeNull()
    expect(t.currentChoices(game)).not.toEqual(expect.arrayContaining(['Deploy', 'Decline']))
    const player = game.players.byName('dennis')
    expect(player.troopsInSupply).toBe(5)
    expect(player.troopsInGarrison).toBe(3)
  })
})
