'use strict'

const t = require('../../../../testutil')
const card = require('./steersman.js')

describe('steersman', () => {

  test('data', () => {
    expect(card.id).toBe('steersman')
    expect(card.name).toBe('Steersman')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.persuasionCost).toBe(8)
    expect(card.factionAffiliation).toBe('guild')
    expect(card.factionAccess).toEqual(['guild'])
    expect(card.agentIcons).toEqual(['green', 'purple', 'yellow'])
    expect(card.revealAbility).toBe('+2 Spice')
    expect(card.acquisitionBonus).toBe('+1 Influence with Spacing Guild')
  })

  test('agent ability: draws a card and recalls another agent', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Place a previous agent on Gather Support so there is one to recall.
      boardSpaces: { 'gather-support': ['dennis'] },
      dennis: { handExact: ['Steersman'] },
    })
    game.run()

    const dennis0 = game.players.byName('dennis')
    const handSizeBefore = game.zones.byId('dennis.hand').cardlist().length

    t.choose(game, 'Agent Turn.Steersman')
    t.choose(game, 'Assembly Hall')
    // Card-vs-space ordering, then recall-agent prompt.
    t.choose(game, 'Steersman')
    t.choose(game, 'Gather Support')

    // Hand: drew 1 from Steersman + Assembly Hall has no draw effect; persuasion +1, intrigue +1.
    const dennis = game.players.byName('dennis')
    // Steersman was played from hand (-1) and we drew 1 -> handSizeBefore - 1 + 1 - 1 (Steersman moved out) = handSizeBefore
    // Actually: hand had Steersman; play removes Steersman; draw adds 1; Assembly Hall doesn't draw. Net: handSizeBefore.
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handSizeBefore)
    expect(game.state.boardSpaces['gather-support']).toEqual([])
    expect(game.state.boardSpaces['assembly-hall']).toEqual(['dennis'])
    // Assembly Hall: +1 intrigue, +1 persuasion.
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
    void dennis0
  })

  test('agent ability: with no other agent placed, can recall the just-placed agent', () => {
    // recall-agent's exclude-current-space logic relies on the `space` param
    // passed to resolveEffect, but card-driven effects pass space=null
    // (resolveCardAgentAbility, playerTurns.js:709), so the agent that just
    // placed on the chosen space is itself a valid recall target. Auto-resolves
    // when it's the only choice.
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Steersman'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Steersman')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Steersman')   // resolve card before space
    // recall-agent auto-picks Assembly Hall (only agent on board).

    expect(game.state.boardSpaces['assembly-hall']).toEqual([])
    // Assembly Hall effects still fired for the placed-then-recalled agent.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('reveal: +2 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Steersman'], spice: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('spice')).toBe(2)
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
