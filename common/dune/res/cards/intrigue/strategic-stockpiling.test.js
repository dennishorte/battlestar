'use strict'

const t = require('../../../testutil.js')
const card = require('./strategic-stockpiling.js')

describe("strategic-stockpiling", () => {
  test('data', () => {
    expect(card.id).toBe("strategic-stockpiling")
    expect(card.name).toBe("Strategic Stockpiling")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.vpsAvailable).toBe(2)
  })

  test('plot: pay 5 spice for +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Strategic Stockpiling'], spice: 5, water: 0 },
    })
    game.run()

    t.choose(game, 'Strategic Stockpiling')
    expect(t.currentChoices(game)).toEqual(['Pass', 'Pay 5 Spice: +1 VP'])
    t.choose(game, 'Pay 5 Spice: +1 VP')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(dennis.vp).toBe(1)
  })

  test('plot: spice leg can be declined', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Strategic Stockpiling'], spice: 5, water: 0 },
    })
    game.run()

    t.choose(game, 'Strategic Stockpiling')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(5)
    expect(dennis.vp).toBe(0)
  })

  test('plot: water leg gated on Fremen 3+ — offered when met', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Strategic Stockpiling'],
        spice: 5,
        water: 3,
        influence: { fremen: 3 },
      },
    })
    game.run()

    t.choose(game, 'Strategic Stockpiling')
    // Spice leg
    t.choose(game, 'Pay 5 Spice: +1 VP')
    // Water leg offered
    expect(t.currentChoices(game)).toEqual(['Pass', 'Pay 3 Water: +1 VP'])
    t.choose(game, 'Pay 3 Water: +1 VP')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(dennis.water).toBe(0)
    expect(dennis.vp).toBe(2)
  })

  test('plot: water leg not offered without 3 Fremen influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Strategic Stockpiling'],
        spice: 5,
        water: 5,
        influence: { fremen: 2 },
      },
    })
    game.run()

    t.choose(game, 'Strategic Stockpiling')
    t.choose(game, 'Pay 5 Spice: +1 VP')
    // No water-leg prompt — flow continues to agent/reveal selection
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Pay 3 Water: +1 VP')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(dennis.water).toBe(5)
    expect(dennis.vp).toBe(1)
  })

  test('plot: spice leg not offered without 5 spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Strategic Stockpiling'],
        spice: 4,
        water: 3,
        influence: { fremen: 3 },
      },
    })
    game.run()

    t.choose(game, 'Strategic Stockpiling')
    // Spice leg skipped, water leg offered first
    expect(t.currentChoices(game)).toEqual(['Pass', 'Pay 3 Water: +1 VP'])
    t.choose(game, 'Pay 3 Water: +1 VP')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(4)
    expect(dennis.water).toBe(0)
    expect(dennis.vp).toBe(1)
  })
})
