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

    // Start-of-turn plot prompt: pass (spiceGained=0 so Leverage no-ops here).
    expect(t.currentChoices(game)).toContain('Leverage')
    t.choose(game, 'Pass')

    t.choose(game, 'Reveal Turn')

    // End-of-reveal plot prompt: spiceGained=1 from Rebel Supplier reveal.
    expect(t.currentChoices(game)).toContain('Leverage')
    t.choose(game, 'Leverage')

    // takeContract opens a chooser — pick the first available contract.
    const contractChoices = t.currentChoices(game)
    t.choose(game, contractChoices[0])

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
    expect(dennis.spice).toBe(1)
    expect(game.zones.byId('dennis.contracts').cardlist().length).toBe(1)
  })

  test('does nothing if no Spice was gained this turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Leverage'],
        solari: 0,
      },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Leverage')
    t.choose(game, 'Leverage')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(game.zones.byId('dennis.contracts').cardlist().length).toBe(0)
  })
})
