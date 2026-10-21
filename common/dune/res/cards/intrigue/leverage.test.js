'use strict'

const t = require('../../../testutil.js')
const card = require('./leverage.js')

describe("leverage", () => {
  test('data', () => {
    expect(card.id).toBe("leverage")
    expect(card.name).toBe("Leverage")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('grants +1 Contract and +1 Solari when Spice was gained this turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Rebel Supplier reveal: +1 Spice. After all reveals, end-of-reveal plot
      // prompt fires with spiceGained=1.
      dennis: {
        handExact: ['Rebel Supplier'],
        intrigue: ['Leverage'],
        solari: 0,
      },
    })
    game.run()

    // No spice yet, so Leverage is not a legal plot.
    const before = (game.waiting.selectors[0].plotActions || []).map(p => p.title)
    expect(before).not.toContain('Leverage')

    t.choose(game, 'Reveal Turn')

    // Rebel Supplier's spice makes Leverage legal on the next decision.
    expect(game.waiting.selectors[0].plotActions.map(p => p.title)).toContain('Leverage')
    t.playPlot(game, 'Leverage')

    // takeContract opens a chooser — pick the first available contract.
    const contractChoices = t.currentChoices(game)
    t.choose(game, contractChoices[0])

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
    expect(dennis.spice).toBe(1)
    expect(game.zones.byId('dennis.contracts').cardlist().length).toBe(1)
  })

  test('is not offered when no Spice was gained this turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Leverage'],
        solari: 0,
      },
    })
    game.run()

    const plots = (game.waiting.selectors[0].plotActions || []).map(p => p.title)
    expect(plots).not.toContain('Leverage')
    const held = game.zones.byId('dennis.intrigue').cardlist()
    expect(held.some(c => c.name === 'Leverage')).toBe(true)
  })
})
