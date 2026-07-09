'use strict'

const t = require('../../../../testutil')
const card = require('./sardaukar-coordination.js')

describe('sardaukar-coordination', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-coordination')
    expect(card.name).toBe('Sardaukar Coordination')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAccess).toEqual(['emperor'])
    expect(card.factionAffiliation).toBe('emperor')
  })

  test('agent ability: troops recruited at the chosen space go to the conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Sardaukar Coordination'],
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Sardaukar Coordination')
    // Gather Support is a green Landsraad space granting 2 troops.
    t.choose(game, 'Gather Support')
    // Resolve order: card-first ensures recruitToConflict flag is set when the
    // space's troop effect resolves.
    t.choose(game, 'Sardaukar Coordination')
    // The choice between "Gain 2 troops" / "Pay 2 Solari..." auto-resolves
    // because dennis has 0 solari (the paid branch is gated).

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(0)
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
  })

  test('agent ability resolved after the space still routes recruits to conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Sardaukar Coordination'],
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Sardaukar Coordination')
    t.choose(game, 'Gather Support')
    // Resolve space first — the space's "Gain 2 troops" runs BEFORE the card
    // sets recruitToConflict, so those troops land in the garrison.
    t.choose(game, 'Gather Support')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(2)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
  })

  test('reveal: +1 Sword when only this Emperor card is revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Pre-deploy a troop so reveal swords are added to strength via
      // setRevealStrength (which is gated on hasUnits).
      conflict: { deployedTroops: { dennis: 1 } },
      dennis: { handExact: ['Sardaukar Coordination'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Troop (2) + printed +1 sword (1) + per-Emperor "(including this one)" ×1 (1) = 4
    expect(dennis.strength).toBe(4)
  })

  test('reveal: +1 Sword per other Emperor card also revealed (engine fix)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1 } },
      // Sardaukar Soldier is emperor-affiliated; revealing it alongside
      // Sardaukar Coordination should give per-Emperor count = 2.
      dennis: { handExact: ['Sardaukar Coordination', 'Sardaukar Soldier'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Troop(2) + Coordination printed +1(1) + Soldier printed +1(1)
    // + per-Emperor revealed ×2 (2) = 6
    expect(dennis.strength).toBe(6)
  })
})
