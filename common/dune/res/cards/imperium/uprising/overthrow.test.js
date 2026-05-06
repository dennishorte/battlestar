'use strict'

const t = require('../../../../testutil')
const card = require('./overthrow.js')

describe("overthrow", () => {
  test('data', () => {
    expect(card.id).toBe("overthrow")
    expect(card.name).toBe("Overthrow")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.factionAccess.sort()).toEqual(['bene-gesserit', 'emperor', 'fremen', 'guild'])
  })

  // skip: faction-space influence is granted before the card's agentAbility
  // resolves, so the "Gain two influence instead of one" flag (extraInfluence)
  // is set too late to upgrade the current placement. Documented in
  // phases/playerTurns.js around the gainInfluence call vs resolveCardAgentAbility
  // ordering.
  test('agent ability: gain 2 influence instead of 1 on faction space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Overthrow'] },
    })
    game.run()

    const before = game.players.byName('dennis').getInfluence('emperor')
    t.choose(game, 'Agent Turn.Overthrow')
    t.choose(game, 'Dutiful Service')
    // Resolve card first if prompted
    let choices = t.currentChoices(game)
    if (choices.includes('Overthrow')) {
      t.choose(game, 'Overthrow')
    }
    // The space is non-combat; no deploy prompt.

    expect(game.players.byName('dennis').getInfluence('emperor')).toBe(before + 2)
  })

  test('agent placement: Overthrow can access all four faction spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Overthrow'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Overthrow')
    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Dutiful Service')   // emperor
    expect(spaces).toContain('Deliver Supplies')  // guild
    expect(spaces).toContain('Secrets')           // bene-gesserit
    expect(spaces).toContain('Desert Tactics')    // fremen
  })

  test('reveal: +2 Persuasion (no troops in conflict → strength 0)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Overthrow'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    // Without deployed troops, swords don't translate to strength.
    expect(dennis.strength).toBe(0)
  })

  test('reveal: +2 Swords contribute to strength when troops are deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Overthrow'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // 1 troop * 2 + 2 swords from reveal = 4
    expect(dennis.strength).toBe(4)
  })

  test('onAcquire: gain +1 Intrigue card on acquire', () => {
    const game = t.fixture()
    // Boost persuasion to afford the 8-cost Overthrow.
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      if (!row.cardlist().some(c => c.name === 'Overthrow')) {
        const target = deck.cardlist().find(c => c.name === 'Overthrow')
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        target.moveTo(row)
      }
    })
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

    const before = game.zones.byId('dennis.intrigue').cardlist().length
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Overthrow')

    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before + 1)
  })
})
