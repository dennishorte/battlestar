'use strict'

const t = require('../../../../testutil')
const card = require('./smugglers-haven.js')

describe('smugglers-haven', () => {
  test('data', () => {
    expect(card.id).toBe('smugglers-haven')
    expect(card.name).toBe("Smuggler's Haven")
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAccess).toEqual(['guild'])
  })

  test('agent ability: pay 4 Spice for +1 VP at a free Guild space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Haven"], spice: 4, vp: 0 },
    })
    game.run()

    t.choose(game, "Agent Turn.Smuggler's Haven")
    // Deliver Supplies is a free Guild faction space (cost: none).
    t.choose(game, 'Deliver Supplies')
    t.choose(game, "Smuggler's Haven")
    t.choose(game, 'Pay 4 Spice for +1 Victory Point')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(1)
    expect(dennis.spice).toBe(0)
  })

  test('agent ability: passing leaves spice and VP unchanged', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Haven"], spice: 4, vp: 0 },
    })
    game.run()

    t.choose(game, "Agent Turn.Smuggler's Haven")
    t.choose(game, 'Deliver Supplies')
    t.choose(game, "Smuggler's Haven")
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(4)
  })

  test('agent ability: prompt does not appear when player has fewer than 4 spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Haven"], spice: 3, vp: 0 },
    })
    game.run()

    t.choose(game, "Agent Turn.Smuggler's Haven")
    t.choose(game, 'Deliver Supplies')
    t.choose(game, "Smuggler's Haven")
    // No spice prompt — the agentEffect short-circuits when spice < 4.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(3)
  })

  test('reveal: +2 Spice when occupying a Maker space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Place dennis on Imperial Basin (a Maker space) before reveal.
      boardSpaces: { 'imperial-basin': ['dennis'] },
      dennis: { handExact: ["Smuggler's Haven"], spice: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(2)
  })

  test('reveal: no spice when not occupying a Maker space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Haven"], spice: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
  })
})
