'use strict'

const t = require('../../../testutil.js')
const card = require('./buy-access.js')

describe("buy-access", () => {
  test('data', () => {
    expect(card.id).toBe("buy-access")
    expect(card.name).toBe("Buy Access")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: Pay 5 Solari -> +1 Influence in 2 chosen factions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Buy Access'], solari: 7 },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Buy Access')
    t.choose(game, 'Buy Access')

    // Two consecutive faction prompts
    expect(t.currentChoices(game)).toContain('emperor')
    t.choose(game, 'emperor')
    expect(t.currentChoices(game)).toContain('fremen')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(2)
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.getInfluence('fremen')).toBe(1)
  })

  test('plot: insufficient Solari — effect does nothing, card still discarded', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Buy Access'], solari: 4 },
    })
    game.run()

    t.choose(game, 'Buy Access')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(4)
    expect(dennis.getInfluence('emperor')).toBe(0)
    expect(dennis.getInfluence('fremen')).toBe(0)
    expect(dennis.getInfluence('guild')).toBe(0)
    expect(dennis.getInfluence('bene-gesserit')).toBe(0)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Buy Access')).toBe(true)
  })

  test('plot: same faction can be chosen twice for +2 influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Buy Access'], solari: 5 },
    })
    game.run()

    t.choose(game, 'Buy Access')
    t.choose(game, 'guild')
    t.choose(game, 'guild')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('guild')).toBe(2)
    expect(dennis.solari).toBe(0)
  })
})
