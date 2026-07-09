'use strict'

const t = require('../../../../testutil')
const card = require('./price-is-no-object.js')

describe("price-is-no-object", () => {
  test('data', () => {
    expect(card.id).toBe("price-is-no-object")
    expect(card.name).toBe("Price Is No Object")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.factionAccess.sort()).toEqual(['bene-gesserit', 'emperor'])
  })

  // Helper: replace the imperium row with a single low-cost target card so
  // we can deterministically acquire it during the agent's acquire phase.
  function injectIntoRow(game, cardName) {
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      if (!row.cardlist().some(c => c.name === cardName)) {
        const target = deck.cardlist().find(c => c.name === cardName)
        if (!target) {
          throw new Error(`Card "${cardName}" not in imperium deck`)
        }
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        target.moveTo(row)
      }
    })
  }

  // Drive through space-effect prompts that arise from Secrets (BG) until we
  // reach the Acquire phase. Secrets grants +1 Intrigue and triggers steal-
  // intrigue (no-op against players holding 0 intrigue).
  function resolveAgentToSecrets(game) {
    t.choose(game, 'Agent Turn.Price Is No Object')
    t.choose(game, 'Secrets')
    let choices = t.currentChoices(game)
    if (choices.includes('Price Is No Object')) {
      t.choose(game, 'Price Is No Object')
    }
  }

  test('agent ability: acquires inline (during the Agent Turn) for Solari, into hand', () => {
    const game = t.fixture()
    // Reliable Informant is cost-3 and "All"-compatible, so it'll be in the
    // imperium deck for our default fixture.
    injectIntoRow(game, 'Reliable Informant')
    t.setBoard(game, {
      // Empty opponent hands so their turns auto-resolve to Reveal Turn.
      dennis: { handExact: ['Price Is No Object', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'], solari: 10 },
      micah: { handExact: [] },
      scott: { handExact: [] },
    })
    game.run()

    // Playing the card on the Agent Turn immediately offers the acquisition.
    resolveAgentToSecrets(game)

    let choices = t.currentChoices(game)
    expect(choices).toContain('Reliable Informant')

    const persuasionBeforeAcquire = game.players.byName('dennis').getCounter('persuasion')

    t.choose(game, 'Reliable Informant')
    // Reliable Informant costs 2; with the agent ability that 2 is taken from
    // Solari (10 - 2 = 8) and Persuasion is unchanged.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(8)
    expect(dennis.getCounter('persuasion')).toBe(persuasionBeforeAcquire)
    // Acquired card lands in HAND, not discard.
    expect(
      game.zones.byId('dennis.hand').cardlist().some(c => c.name === 'Reliable Informant')
    ).toBe(true)
    expect(
      game.zones.byId('dennis.discard').cardlist().some(c => c.name === 'Reliable Informant')
    ).toBe(false)
  })

  test('agent ability: acquisition does not carry over to the Reveal Turn', () => {
    // Regression: the ability used to defer to acquireCardsPhase via persisted
    // flags that only cleared after a successful acquire — passing leaked the
    // Solari-acquire offer into every future Reveal Turn. It must now resolve
    // entirely inline on the Agent Turn and spend Solari only once.
    const game = t.fixture()
    injectIntoRow(game, 'Reliable Informant')
    t.setBoard(game, {
      dennis: { handExact: ['Price Is No Object', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'], solari: 10 },
      micah: { handExact: [] },
      scott: { handExact: [] },
    })
    game.run()

    // Acquire inline during the Agent Turn (10 - 2 = 8 Solari).
    resolveAgentToSecrets(game)
    t.choose(game, 'Reliable Informant')
    expect(game.players.byName('dennis').getCounter('solari')).toBe(8)

    // Now take the Reveal Turn. Acquisition here is Persuasion-only; Solari is
    // never offered again, so it can only go up (turn income), never down from
    // a leaked second Solari acquisition.
    const solariBeforeReveal = game.players.byName('dennis').getCounter('solari')
    t.choose(game, 'Reveal Turn')
    let choices = t.currentChoices(game)
    while (game.waiting && choices.includes('Pass')) {
      t.choose(game, 'Pass')
      choices = t.currentChoices(game)
    }

    expect(game.players.byName('dennis').getCounter('solari')).toBeGreaterThanOrEqual(solariBeforeReveal)
    expect(game.state.persistentFlags).toBeUndefined()
  })

  test('reveal: +2 Persuasion, +2 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Price Is No Object'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(dennis.getCounter('solari')).toBe(2)
  })

  test('onAcquire: +2 Solari when acquired through normal flow', () => {
    const game = t.fixture()
    injectIntoRow(game, 'Price Is No Object')
    // Boost persuasion to afford 6.
    game.testSetBreakpoint('after-round-start', (g) => {
      const deck = g.zones.byId('common.imperiumDeck')
      const hand = g.zones.byId('dennis.hand')
      for (const name of ['Lady Jessica', 'Piter De Vries']) {
        const c = deck.cardlist().find(x => x.name === name)
        if (c) {
          c.moveTo(hand)
        }
      }
    })
    game.run()

    const before = game.players.byName('dennis').getCounter('solari')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Price Is No Object')

    expect(game.players.byName('dennis').getCounter('solari')).toBe(before + 2)
  })
})
