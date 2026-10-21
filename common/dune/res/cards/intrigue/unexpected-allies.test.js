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

    t.playPlot(game, 'Unexpected Allies')
    t.choose(game, 'Pay 2 Water: Blow Shield Wall + 1 Sandworm')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(0)
    expect(game.state.shieldWall).toBe(false)
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
  })

  test('plot: not offered without 2 water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Unexpected Allies'], water: 1 },
      shieldWall: true,
    })
    game.run()

    const plots = (game.waiting.selectors[0].plotActions || []).map(p => p.title)
    expect(plots).not.toContain('Unexpected Allies')
    const held = game.zones.byId('dennis.intrigue').cardlist()
    expect(held.some(c => c.name === 'Unexpected Allies')).toBe(true)
    expect(game.state.shieldWall).toBe(true)
  })

  test('plot: explicit Pass keeps water and shield wall intact', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Unexpected Allies'], water: 5 },
      shieldWall: true,
    })
    game.run()

    t.playPlot(game, 'Unexpected Allies')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(5)
    expect(game.state.shieldWall).toBe(true)
    expect(game.state.conflict.deployedSandworms.dennis || 0).toBe(0)
  })
})
