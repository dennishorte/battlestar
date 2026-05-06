'use strict'

const t = require('../../../../testutil')
const card = require('./unswerving-loyalty.js')

describe('unswerving-loyalty', () => {

  test('data', () => {
    expect(card.id).toBe('unswerving-loyalty')
    expect(card.name).toBe('Unswerving Loyalty')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.persuasionCost).toBe(1)
    expect(card.agentIcons).toEqual([])
    expect(card.revealPersuasion).toBe(1)
    expect(typeof card.revealEffect).toBe('function')
  })

  test('reveal alone: +1 troop and +1 persuasion (no Fremen Bond — no other Fremen)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Unswerving Loyalty'], troopsInGarrison: 0, troopsInSupply: 5 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.troopsInGarrison).toBe(1)
    expect(dennis.troopsInSupply).toBe(4)
  })

  test('reveal with another Fremen card: bond offers deploy choice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Desert Survival is Fremen-affiliated.
      dennis: {
        handExact: ['Unswerving Loyalty', 'Desert Survival'],
        troopsInGarrison: 1,
        troopsInSupply: 5,
      },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    // Reveal happens; bond offers Pass / Deploy 1 troop / Retreat 1 troop.
    t.choose(game, 'Deploy 1 troop')

    const dennis = game.players.byName('dennis')
    // After reveal: +1 troop from Unswerving Loyalty (garrison 1->2), then deploy 1 -> 1.
    expect(dennis.troopsInGarrison).toBe(1)
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })

  test('reveal with another Fremen card: bond offers retreat choice when deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Unswerving Loyalty', 'Desert Survival'],
        troopsInGarrison: 0,
        troopsInSupply: 5,
      },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    t.choose(game, 'Retreat 1 troop')

    const dennis = game.players.byName('dennis')
    // After reveal: +1 troop -> garrison 1, deployed 1, then retreat -> garrison 1, deployed 0, supply +1.
    expect(game.state.conflict.deployedTroops.dennis).toBe(0)
    expect(dennis.troopsInSupply).toBe(5)   // 5 -> 4 (gain) -> 5 (retreat)
    expect(dennis.troopsInGarrison).toBe(1)
  })

  test('reveal with another Fremen, decline bond: pass leaves troops untouched', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Unswerving Loyalty', 'Desert Survival'],
        troopsInGarrison: 0,
        troopsInSupply: 5,
      },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
  })
})
