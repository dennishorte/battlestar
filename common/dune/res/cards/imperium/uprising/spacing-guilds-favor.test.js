'use strict'

const t = require('../../../../testutil')
const card = require('./spacing-guilds-favor.js')

describe('spacing-guilds-favor', () => {
  test('data', () => {
    expect(card.id).toBe('spacing-guilds-favor')
    expect(card.name).toBe("Spacing Guild's Favor")
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe(null)
    expect(typeof card.onDiscard).toBe('function')
    expect(card.passiveAbility).toMatch(/discarded/i)
  })

  test('reveal: +2 base persuasion, no spice spent → no influence change', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Spacing Guild's Favor"], spice: 0, influence: { guild: 0 } },
    })
    game.run()

    // No agent-icon/faction-access cards in hand → "Choose Turn" auto-resolves
    // to Reveal Turn. With <3 spice, the reveal-effect prompt does not fire.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(dennis.getInfluence('guild')).toBe(0)
  })

  test('reveal: spend 3 Spice for +1 Influence with chosen faction', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Spacing Guild's Favor"], spice: 3, influence: { fremen: 0 } },
    })
    game.run()

    // Choose Turn auto-resolves; reveal-effect prompt fires next.
    t.choose(game, 'Pay 3 Spice for +1 Influence')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(dennis.spice).toBe(0)
    expect(dennis.getInfluence('fremen')).toBe(1)
  })

  test('reveal: passing keeps spice and skips influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Spacing Guild's Favor"], spice: 3 },
    })
    game.run()

    // Choose Turn auto-resolves; reveal-effect prompt fires next.
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(3)
  })

  test('onDiscard: +2 Spice when this card is discarded mid-turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Use Space-Time Folding's "Discard a card" agent ability to discard
      // Spacing Guild's Favor mid-turn, which fires onDiscard.
      dennis: { handExact: ['Space-Time Folding', "Spacing Guild's Favor"], spice: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Space-Time Folding')
    t.choose(game, 'Space-Time Folding')
    // Discard prompt auto-resolves: Spacing Guild's Favor is the only card in
    // hand after Space-Time Folding moved to played.

    const dennis = game.players.byName('dennis')
    // onDiscard grants +2 spice. Space-Time Folding then draws cards.
    expect(dennis.spice).toBe(2)
    const discard = game.zones.byId('dennis.discard').cardlist().map(c => c.name)
    expect(discard).toContain("Spacing Guild's Favor")
  })
})
