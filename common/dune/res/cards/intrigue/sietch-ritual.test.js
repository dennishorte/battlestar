'use strict'

const t = require('../../../testutil.js')
const card = require('./sietch-ritual.js')

describe("sietch-ritual", () => {
  test('data', () => {
    expect(card.id).toBe("sietch-ritual")
    expect(card.name).toBe("Sietch Ritual")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: discard a card, +1 influence with Bene Gesserit', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Sietch Ritual'] },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Sietch Ritual')
    t.choose(game, 'Sietch Ritual')

    const handBefore = game.zones.byId('dennis.hand').cardlist().map(c => c.name)
    const handSizeBefore = handBefore.length
    expect(handSizeBefore).toBeGreaterThan(0)
    t.choose(game, handBefore[0])
    t.choose(game, 'Bene Gesserit')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('bene-gesserit')).toBe(1)
    expect(dennis.getInfluence('fremen')).toBe(0)
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handSizeBefore - 1)
    expect(game.zones.byId('dennis.discard').cardlist().some(c => c.name === handBefore[0])).toBe(true)
    expect(game.zones.byId('dennis.intrigue').cardlist()).toHaveLength(0)
  })

  test('plot: discard a card, +1 influence with Fremen', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Sietch Ritual'] },
    })
    game.run()

    t.choose(game, 'Sietch Ritual')
    const handBefore = game.zones.byId('dennis.hand').cardlist().map(c => c.name)
    t.choose(game, handBefore[0])
    t.choose(game, 'Fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(1)
    expect(dennis.getInfluence('bene-gesserit')).toBe(0)
  })
})
