const t = require('../testutil')

// Replace the Imperium Row's first card with the named card pulled from the
// Imperium Deck, so reveal-turn buys can target it deterministically.
function injectIntoImperiumRow(game, cardName) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const row = g.zones.byId('common.imperiumRow')
    const deck = g.zones.byId('common.imperiumDeck')
    if (row.cardlist().some(c => c.name === cardName)) {
      return
    }
    const target = deck.cardlist().find(c => c.name === cardName)
    if (!target) {
      throw new Error(`Card "${cardName}" not in imperium deck — check compatibility/source flags`)
    }
    const displaced = row.cardlist()[0]
    if (displaced) {
      displaced.moveTo(deck)
    }
    target.moveTo(row)
  })
}

// Inject extra high-revealPersuasion cards into dennis's hand so cost > 5
// targets can be afforded. Both default boosters have null revealAbility.
function boostPersuasion(game, boosters = ['Lady Jessica', 'Piter De Vries']) {
  game.testSetBreakpoint('after-round-start', (g) => {
    const deck = g.zones.byId('common.imperiumDeck')
    const hand = g.zones.byId('dennis.hand')
    for (const name of boosters) {
      const card = deck.cardlist().find(c => c.name === name)
      if (card) {
        card.moveTo(hand)
      }
    }
  })
}

describe('onAcquire bonuses by effect category', () => {

  // ─── direct-resource counters ──────────────────────────────────────

  test('spy: Strike Fleet places a spy on a chosen post', () => {
    const game = t.fixture()
    injectIntoImperiumRow(game, 'Strike Fleet')
    game.run()

    const spiesBefore = game.players.byName('dennis').spiesInSupply
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Strike Fleet')

    const choices = t.currentChoices(game)
    expect(choices[0]).toMatch(/^Post [A-M] /)
    t.choose(game, choices[0])

    expect(game.players.byName('dennis').spiesInSupply).toBe(spiesBefore - 1)
    expect(
      game.zones.byId('dennis.discard').cardlist().some(c => c.name === 'Strike Fleet')
    ).toBe(true)
  })

  test('gain water: Chani grants +1 Water', () => {
    const game = t.fixture()
    injectIntoImperiumRow(game, 'Chani')
    game.run()

    const before = game.players.byName('dennis').getCounter('water')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Chani')

    expect(game.players.byName('dennis').getCounter('water')).toBe(before + 1)
  })

  test('gain spice: Lisan Al Gaib grants +1 Spice', () => {
    const game = t.fixture({ useImmortality: true })
    injectIntoImperiumRow(game, 'Lisan Al Gaib')
    game.run()

    const before = game.players.byName('dennis').getCounter('spice')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Lisan Al Gaib')

    expect(game.players.byName('dennis').getCounter('spice')).toBe(before + 1)
  })

  test('gain solari: Price is Not Object grants +2 Solari', () => {
    const game = t.fixture()
    boostPersuasion(game)
    injectIntoImperiumRow(game, 'Price is Not Object')
    game.run()

    const before = game.players.byName('dennis').getCounter('solari')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Price is Not Object')

    expect(game.players.byName('dennis').getCounter('solari')).toBe(before + 2)
  })

  test('troop: Negotiated Withdrawal moves +1 troop from supply to garrison', () => {
    const game = t.fixture({ useRiseOfIx: true })
    injectIntoImperiumRow(game, 'Negotiated Withdrawal')
    game.run()

    const dennis = game.players.byName('dennis')
    const supplyBefore = dennis.troopsInSupply
    const garrisonBefore = dennis.troopsInGarrison

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Negotiated Withdrawal')

    const after = game.players.byName('dennis')
    expect(after.troopsInSupply).toBe(supplyBefore - 1)
    expect(after.troopsInGarrison).toBe(garrisonBefore + 1)
  })

  test('intrigue: Overthrow grants +1 Intrigue card', () => {
    const game = t.fixture()
    boostPersuasion(game)
    injectIntoImperiumRow(game, 'Overthrow')
    game.run()

    const before = game.zones.byId('dennis.intrigue').cardlist().length
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Overthrow')

    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before + 1)
  })

  test('vp: The Spice Must Flow grants +1 Victory Point and checks contract completion', () => {
    const game = t.fixture()
    boostPersuasion(game) // 5 starter + 3 + 3 = 11 ≥ 9 (TSMF cost)
    game.run()

    const before = game.players.byName('dennis').getCounter('vp')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'The Spice Must Flow')

    expect(game.players.byName('dennis').getCounter('vp')).toBe(before + 1)
  })

  // ─── influence ─────────────────────────────────────────────────────

  test('influence (specific): Liet Kynes grants +1 with Emperor', () => {
    const game = t.fixture()
    injectIntoImperiumRow(game, 'Liet Kynes')
    game.run()

    const before = game.players.byName('dennis').getInfluence('emperor')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Liet Kynes')

    expect(game.players.byName('dennis').getInfluence('emperor')).toBe(before + 1)
  })

  test('influence (each faction): CHOAM Directorship grants +1 with all four factions', () => {
    const game = t.fixture()
    boostPersuasion(game)
    injectIntoImperiumRow(game, 'CHOAM Directorship')
    game.run()

    const before = ['emperor', 'guild', 'bene-gesserit', 'fremen'].map(
      f => game.players.byName('dennis').getInfluence(f)
    )

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'CHOAM Directorship')

    const after = game.players.byName('dennis')
    expect(after.getInfluence('emperor')).toBe(before[0] + 1)
    expect(after.getInfluence('guild')).toBe(before[1] + 1)
    expect(after.getInfluence('bene-gesserit')).toBe(before[2] + 1)
    expect(after.getInfluence('fremen')).toBe(before[3] + 1)
  })

  test('influence (choice): Lady Jessica prompts to pick a faction', () => {
    const game = t.fixture()
    // Lady Jessica is the test target; only Piter De Vries boosts persuasion.
    boostPersuasion(game, ['Piter De Vries']) // 5 + 3 = 8 ≥ 7 (Lady Jessica cost)
    injectIntoImperiumRow(game, 'Lady Jessica')
    game.run()

    const before = game.players.byName('dennis').getInfluence('fremen')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Lady Jessica')
    t.choose(game, 'fremen')

    expect(game.players.byName('dennis').getInfluence('fremen')).toBe(before + 1)
  })

  // ─── contract ──────────────────────────────────────────────────────

  test('contract: Mercantile Affairs prompts to take a contract from the market', () => {
    const game = t.fixture({ useBloodlines: true })
    injectIntoImperiumRow(game, 'Mercantile Affairs')
    game.run()

    // Some contracts ('Immediate') auto-complete on take; count both zones.
    const totalBefore = (
      game.zones.byId('dennis.contracts').cardlist().length +
      game.zones.byId('dennis.contractsCompleted').cardlist().length
    )

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Mercantile Affairs')

    const choices = t.currentChoices(game)
    t.choose(game, choices[0])

    const totalAfter = (
      game.zones.byId('dennis.contracts').cardlist().length +
      game.zones.byId('dennis.contractsCompleted').cardlist().length
    )
    expect(totalAfter).toBe(totalBefore + 1)
  })

  // ─── trash-card ────────────────────────────────────────────────────

  test('trash-card: Shai-Hulud prompts with Pass + hand cards', () => {
    const game = t.fixture({ useRiseOfIx: true })
    boostPersuasion(game)
    injectIntoImperiumRow(game, 'Shai-Hulud')
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Shai-Hulud')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Pass')
    t.choose(game, 'Pass')

    expect(
      game.zones.byId('dennis.discard').cardlist().some(c => c.name === 'Shai-Hulud')
    ).toBe(true)
  })

  // ─── unreachable through normal acquire flow ───────────────────────
  // The dispatcher fires only for imperium row + reserve cards, and the
  // imperium pool is filtered to compatibility "All" or "Uprising". The
  // following effect categories live exclusively on excluded cards (tech
  // tiles, expansion-specific compatibility), so they can't be exercised
  // end-to-end against the current engine. Smoke-check the hooks so any
  // typo or missing wiring surfaces immediately.

  test('smoke: hooks present on cards excluded from the standard acquire pool', () => {
    const cards = [
      // Tech tiles — not yet acquirable through the engine
      require('../res/cards/tech/delivery-bay.js'),       // draw 1
      require('../res/cards/tech/spaceport.js'),          // draw 2
      require('../res/cards/tech/servo-receivers.js'),    // signet ring
      require('../res/cards/tech/forbidden-weapons.js'),  // shield wall + troop
      require('../res/cards/tech/flagship.js'),           // +1 VP
      require('../res/cards/tech/spy-drones.js'),         // +2 spies (deep cover)
      // Expansion-only compatibility — filtered out of imperium pool
      require('../res/cards/imperium/immortality/spiritual-fervor.js'),  // +1 Research memo
      require('../res/cards/imperium/riseOfIx/full-scale-assault.js'),   // +1 Dreadnought memo
      require('../res/cards/imperium/riseOfIx/appropriate.js'),          // +1 Shipping memo
      require('../res/cards/tleilax/subject-x-137.js'),                  // +1 Beetle memo
    ]
    for (const card of cards) {
      expect(typeof card.onAcquire).toBe('function')
    }
  })
})
