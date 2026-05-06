'use strict'

const t = require('../../../testutil.js')
const card = require('./unexpected-allies.js')

describe("unexpected-allies", () => {
  test('data', () => {
    expect(card.id).toBe("unexpected-allies")
    expect(card.name).toBe("Unexpected Allies")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSandworms).toBe(true)
  })

  test('plot: pay 2 water, blow shield wall, +1 sandworm', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Unexpected Allies'], water: 2 },
      shieldWall: true,
    })
    game.run()

    t.choose(game, 'Unexpected Allies')
    t.choose(game, 'Pay 2 Water: Blow Shield Wall + 1 Sandworm')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(0)
    expect(game.state.shieldWall).toBe(false)
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
  })

  test('plot: cannot pay (not enough water) — choice not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Unexpected Allies'], water: 1 },
      shieldWall: true,
    })
    game.run()

    t.choose(game, 'Unexpected Allies')
    // No Pay choice; effect resolves to nothing (player goes back to next prompt)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Pay 2 Water: Blow Shield Wall + 1 Sandworm')
    expect(game.state.shieldWall).toBe(true)
  })

  test('plot: explicit Pass keeps water and shield wall intact', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Unexpected Allies'], water: 5 },
      shieldWall: true,
    })
    game.run()

    t.choose(game, 'Unexpected Allies')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(5)
    expect(game.state.shieldWall).toBe(true)
    expect(game.state.conflict.deployedSandworms.dennis || 0).toBe(0)
  })
})
