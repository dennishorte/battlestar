'use strict'

const t = require('../../../../testutil')
const card = require('./price-is-not-object.js')

describe("price-is-not-object", () => {
  test('data', () => {
    expect(card.id).toBe("price-is-not-object")
    expect(card.name).toBe("Price is Not Object")
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
    t.choose(game, 'Agent Turn.Price is Not Object')
    t.choose(game, 'Secrets')
    let choices = t.currentChoices(game)
    if (choices.includes('Price is Not Object')) {
      t.choose(game, 'Price is Not Object')
    }
  }

  test('agent ability: next acquire spends Solari (not Persuasion) and lands in hand', () => {
    const game = t.fixture()
    // Reliable Informant is cost-3 and "All"-compatible, so it'll be in the
    // imperium deck for our default fixture.
    injectIntoRow(game, 'Reliable Informant')
    t.setBoard(game, {
      // Empty opponent hands so their turns auto-resolve to Reveal Turn —
      // keeps the flow short enough to assert dennis's reveal-turn acquire
      // behavior without driving every other player's prompts.
      dennis: { handExact: ['Price is Not Object', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'], solari: 10 },
      micah: { handExact: [] },
      scott: { handExact: [] },
    })
    game.run()

    resolveAgentToSecrets(game)

    // After agent turn, dennis still has 1 agent. Take a Reveal Turn now —
    // acquireWithSolari is still set, so the acquire phase uses Solari.
    t.choose(game, 'Reveal Turn')

    let choices = t.currentChoices(game)
    expect(choices).toContain('Reliable Informant')

    const persuasionBeforeAcquire = game.players.byName('dennis').getCounter('persuasion')

    t.choose(game, 'Reliable Informant')
    // Reliable Informant costs 2 persuasion; with the flag set, that 2 is
    // taken from solari (10 - 2 = 8) and persuasion is unchanged. Capture
    // both immediately — passing through the rest of the acquire phase will
    // eventually advance to the next round, which resets persuasion.
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

  test('agent ability: flag clears after one acquisition', () => {
    const game = t.fixture()
    injectIntoRow(game, 'Reliable Informant')
    t.setBoard(game, {
      dennis: { handExact: ['Price is Not Object', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'], solari: 10 },
      micah: { handExact: [] },
      scott: { handExact: [] },
    })
    game.run()

    resolveAgentToSecrets(game)
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Reliable Informant')
    // Pass remaining acquire budget (solari + persuasion).
    let choices = t.currentChoices(game)
    while (game.waiting && choices.includes('Pass')) {
      t.choose(game, 'Pass')
      choices = t.currentChoices(game)
    }

    // After the acquire, both flags should clear.
    expect(game.state.turnTracking.acquireWithSolari).toBeFalsy()
    expect(game.state.turnTracking.acquireToHand).toBeFalsy()
  })

  test('reveal: +2 Persuasion, +2 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Price is Not Object'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(dennis.getCounter('solari')).toBe(2)
  })

  test('onAcquire: +2 Solari when acquired through normal flow', () => {
    const game = t.fixture()
    injectIntoRow(game, 'Price is Not Object')
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
    t.choose(game, 'Price is Not Object')

    expect(game.players.byName('dennis').getCounter('solari')).toBe(before + 2)
  })
})
