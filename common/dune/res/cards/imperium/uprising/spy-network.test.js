'use strict'

const t = require('../../../../testutil')
const card = require('./spy-network.js')

describe('spy-network', () => {

  test('data', () => {
    expect(card.id).toBe('spy-network')
    expect(card.name).toBe('Spy Network')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.persuasionCost).toBe(2)
    expect(card.factionAffiliation).toBe('emperor')
    expect(card.agentIcons).toEqual([])
    expect(card.revealPersuasion).toBe(2)
    expect(card.revealSwords).toBe(1)
    expect(card.acquisitionBonus).toBe('+1 Spy')
    expect(typeof card.onAcquire).toBe('function')
  })

  test('reveal alone gives +2 persuasion (no spy condition met)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Spy Network'] },
    })
    game.run()
    // No Agent Turn option (empty agentIcons + alone in hand). Reveal auto-resolves.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(0)
  })

  // skip: reveal text uses Unicode arrow "→" which is not normalized by
  // parseAgentAbility (only "->", "-->", and ":" are recognized), so the
  // "Recall a Spy → Get an Intrigue card" cost-effect never parses and the
  // condition is logged as memo only. Pre-existing parser limitation.
  test('reveal with 2 spies on board: recall a spy then gain an Intrigue card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Spy Network'], spiesInSupply: 1 },
      spyPosts: { A: ['dennis'], B: ['dennis'] },
    })
    game.run()
    // Spy Network reveal triggers: choose which spy to recall.
    t.choose(game, 'Post A')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(game.state.spyPosts.A).toEqual([])
    expect(game.state.spyPosts.B).toEqual(['dennis'])
    expect(dennis.spiesInSupply).toBe(2)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('reveal with only 1 spy on board: condition not met, no recall', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Spy Network'], spiesInSupply: 2 },
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(game.state.spyPosts.A).toEqual(['dennis'])
    expect(dennis.spiesInSupply).toBe(2)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(0)
  })
})
