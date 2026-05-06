'use strict'

const t = require('../../../../testutil')
const card = require('./subversive-advisor.js')

describe('subversive-advisor', () => {

  test('data', () => {
    expect(card.id).toBe('subversive-advisor')
    expect(card.name).toBe('Subversive Advisor')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spyAccess).toBe(true)
    expect(card.agentIcons).toEqual([])
    expect(card.acquisitionBonus).toBe('+1 Spy')
    expect(typeof card.agentEffect).toBe('function')
  })

  test('agent ability: faction space — +2 influence total and self-trashes', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post K connects to Heighliner / Deliver Supplies (Spacing Guild faction).
      spyPosts: { K: ['dennis'] },
      dennis: { handExact: ['Subversive Advisor'], influence: { guild: 0 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Subversive Advisor')
    // Only Post K's spaces are reachable; Heighliner costs 5 spice so the
    // sole valid option is Deliver Supplies — auto-resolved.
    // Gather Intelligence is then offered (post K is empty besides dennis's spy).
    t.choose(game, 'No')
    // Card-vs-space ordering (Deliver Supplies has effects -> water +1).
    t.choose(game, 'Subversive Advisor')

    const dennis = game.players.byName('dennis')
    // +1 from placing on faction space, +1 from card's agentEffect = 2.
    expect(dennis.getInfluence('guild')).toBe(2)
    // Card was trashed -> no longer in any of dennis's zones.
    const allZones = ['hand', 'played', 'discard', 'deck', 'revealed']
      .map(z => game.zones.byId(`dennis.${z}`).cardlist().map(c => c.name))
      .flat()
    expect(allZones).not.toContain('Subversive Advisor')
  })

  test('agent ability: non-faction space — no extra influence, card not trashed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post I connects to Assembly Hall / Gather Support (no faction).
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Subversive Advisor'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Subversive Advisor')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')                  // decline Gather Intelligence
    t.choose(game, 'Subversive Advisor')  // resolve card before space

    const dennis = game.players.byName('dennis')
    // No faction influence gained.
    for (const f of ['emperor', 'guild', 'bene-gesserit', 'fremen']) {
      expect(dennis.getInfluence(f)).toBe(0)
    }
    // Card is in played zone (still in play, not trashed).
    const playedNames = game.zones.byId('dennis.played').cardlist().map(c => c.name)
    expect(playedNames).toContain('Subversive Advisor')
  })
})
