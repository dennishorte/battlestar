'use strict'

const t = require('../../../../testutil')
const card = require('./space-time-folding.js')

describe('space-time-folding', () => {
  test('data', () => {
    expect(card.id).toBe('space-time-folding')
    expect(card.name).toBe('Space-Time Folding')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAccess).toEqual(['guild'])
    expect(card.factionAffiliation).toBe('guild')
  })

  test('agent ability: discarding a non-Guild card draws 1 card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // 'Diplomacy' is a starter all-faction card with no faction affiliation.
      dennis: { handExact: ['Space-Time Folding', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Space-Time Folding')
    // The board-space prompt auto-resolves (Deliver Supplies is the only
    // valid free Guild space). Order prompt fires next.
    t.choose(game, 'Space-Time Folding')
    // The discard prompt auto-resolves: Diplomacy is the only card in hand
    // after Space-Time Folding moved to played.

    // Diplomacy is in discard, the player drew exactly 1 replacement card.
    const discard = game.zones.byId('dennis.discard').cardlist().map(c => c.name)
    expect(discard).toContain('Diplomacy')
    // Hand: Space-Time Folding moved to played, Diplomacy moved to discard,
    // and 1 new card drawn — so hand has 1 card.
    const hand = game.zones.byId('dennis.hand').cardlist()
    expect(hand.length).toBe(1)
  })

  test('agent ability: discarding a Guild card draws 2 cards (engine fix)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spacing Guild's Favor is null-affiliation per its definition; pair
      // Space-Time Folding with another Guild-affiliated card. Smuggler's
      // Harvester has factionAffiliation: 'guild'.
      dennis: { handExact: ['Space-Time Folding', "Smuggler's Harvester"] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Space-Time Folding')
    t.choose(game, 'Space-Time Folding')
    // Discard prompt auto-resolves: Smuggler's Harvester is the only card in
    // hand after Space-Time Folding moved to played.

    // Smuggler's Harvester ended up in discard; the player drew 2 cards.
    const discard = game.zones.byId('dennis.discard').cardlist().map(c => c.name)
    expect(discard).toContain("Smuggler's Harvester")
    const hand = game.zones.byId('dennis.hand').cardlist()
    expect(hand.length).toBe(2)
  })

  test('reveal: +1 Persuasion only', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Space-Time Folding'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
