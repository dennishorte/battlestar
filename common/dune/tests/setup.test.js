const t = require('../testutil')

describe('Setup', () => {

  test('conflict deck has correct composition: 1 tier-I + 5 tier-II + 4 tier-III = 10', () => {
    const game = t.fixture()
    // Before run, conflict deck is fully built
    // After run, round 1 starts and top card is revealed, leaving 9
    game.run()

    const deck = game.zones.byId('common.conflictDeck')
    const active = game.zones.byId('common.conflictActive')
    expect(deck.cardlist().length + active.cardlist().length).toBe(10)
    expect(active.cardlist().length).toBe(1)
    expect(deck.cardlist().length).toBe(9)
  })

  test('imperium row has 5 cards', () => {
    const game = t.fixture()
    game.run()
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)
  })

  test('reserve stacks exist with cards', () => {
    const game = t.fixture()
    game.run()
    const ptw = game.zones.byId('common.reserve.prepareTheWay')
    const tsmf = game.zones.byId('common.reserve.spiceMustFlow')
    expect(ptw.cardlist().length).toBeGreaterThan(0)
    expect(tsmf.cardlist().length).toBeGreaterThan(0)
    expect(ptw.cardlist()[0].name).toBe('Prepare the Way')
    expect(tsmf.cardlist()[0].name).toBe('The Spice Must Flow')
  })

  test('intrigue deck exists and is non-empty', () => {
    const game = t.fixture()
    game.run()
    const deck = game.zones.byId('common.intrigueDeck')
    expect(deck.cardlist().length).toBeGreaterThan(0)
  })

  test('starting deck has correct 10-card composition', () => {
    const game = t.fixture()
    game.run()

    // Collect all cards across hand and deck
    const allCards = [
      ...game.zones.byId('dennis.hand').cardlist(),
      ...game.zones.byId('dennis.deck').cardlist(),
    ].map(c => c.name).sort()

    expect(allCards).toEqual([
      'Convincing Argument',
      'Convincing Argument',
      'Dagger',
      'Dagger',
      'Diplomacy',
      'Dune, The Desert Planet',
      'Dune, The Desert Planet',
      'Reconnaissance',
      'Seek Allies',
      'Signet Ring',
    ])
  })

  test('faction influence starts at 0 for all factions', () => {
    const game = t.fixture()
    game.run()

    t.testBoard(game, {
      dennis: { influence: { emperor: 0, guild: 0, 'bene-gesserit': 0, fremen: 0 } },
      micah: { influence: { emperor: 0, guild: 0, 'bene-gesserit': 0, fremen: 0 } },
    })
  })

  test('shield wall is in place at start', () => {
    const game = t.fixture()
    game.run()
    t.testBoard(game, { shieldWall: true })
  })

  test('control markers are unowned at start', () => {
    const game = t.fixture()
    game.run()
    expect(game.state.controlMarkers.arrakeen).toBeNull()
    expect(game.state.controlMarkers['spice-refinery']).toBeNull()
    expect(game.state.controlMarkers['imperial-basin']).toBeNull()
  })

  test('alliances are unclaimed at start', () => {
    const game = t.fixture()
    game.run()
    expect(game.state.alliances.emperor).toBeNull()
    expect(game.state.alliances.guild).toBeNull()
    expect(game.state.alliances['bene-gesserit']).toBeNull()
    expect(game.state.alliances.fremen).toBeNull()
  })
})
