'use strict'

const t = require('../../../testutil.js')
const card = require('./call-to-arms.js')

describe("call-to-arms", () => {
  test('data', () => {
    expect(card.id).toBe("call-to-arms")
    expect(card.name).toBe("Call to Arms")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot during reveal: acquiring a card grants +1 Troop', () => {
    const game = t.fixture()
    // Place a cheap acquirable card in the imperium row.
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      const cheap = deck.cardlist().find(c => (c.persuasionCost || c.definition?.persuasionCost || 99) <= 2)
        || row.cardlist().find(c => (c.persuasionCost || c.definition?.persuasionCost || 99) <= 2)
      if (cheap && cheap.zone !== row) {
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        cheap.moveTo(row)
      }
    })
    t.setBoard(game, {
      dennis: { intrigue: ['Call to Arms'], troopsInSupply: 5, troopsInGarrison: 0 },
    })
    game.run()

    // At start of turn, plot intrigue is offered.
    expect(t.currentChoices(game)).toContain('Call to Arms')
    t.choose(game, 'Call to Arms')

    // Then choose Reveal Turn
    t.choose(game, 'Reveal Turn')

    // Acquire the cheap card. Hand has 5 starter cards (5 persuasion total).
    const choices = t.currentChoices(game)
    const acquirable = choices.find(c => c !== 'Pass' && c !== 'Reveal Turn')
    expect(acquirable).toBeDefined()

    const garrisonBefore = game.players.byName('dennis').troopsInGarrison
    t.choose(game, acquirable)

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(garrisonBefore + 1)
    expect(dennis.troopsInSupply).toBe(4)
  })

  test('plot: not playing the card means no troop on acquire', () => {
    const game = t.fixture()
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      const cheap = deck.cardlist().find(c => (c.persuasionCost || c.definition?.persuasionCost || 99) <= 2)
        || row.cardlist().find(c => (c.persuasionCost || c.definition?.persuasionCost || 99) <= 2)
      if (cheap && cheap.zone !== row) {
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        cheap.moveTo(row)
      }
    })
    t.setBoard(game, {
      dennis: { intrigue: ['Call to Arms'], troopsInSupply: 5, troopsInGarrison: 0 },
    })
    game.run()

    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')

    const choices = t.currentChoices(game)
    const acquirable = choices.find(c => c !== 'Pass' && c !== 'Reveal Turn')
    expect(acquirable).toBeDefined()
    t.choose(game, acquirable)

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(0)
    expect(dennis.troopsInSupply).toBe(5)
  })

  test('plot: troop bonus also applies when a card is acquired via another plot card (Inspire Awe) the same turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Call to Arms', 'Inspire Awe'], troopsInSupply: 5, troopsInGarrison: 0 },
    })
    game.run()

    // Play Call to Arms, then Inspire Awe, both as plot intrigues before
    // committing to this turn's Agent/Reveal choice.
    expect(t.currentChoices(game)).toContain('Call to Arms')
    t.choose(game, 'Call to Arms')

    expect(t.currentChoices(game)).toContain('Inspire Awe')
    t.choose(game, 'Inspire Awe')

    const rowZone = game.zones.byId('common.imperiumRow')
    const cheap = rowZone.cardlist().find(c => (c.persuasionCost || 0) <= 3)
    expect(cheap).toBeTruthy()

    const garrisonBefore = game.players.byName('dennis').troopsInGarrison
    t.choose(game, cheap.name)

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(garrisonBefore + 1)
    expect(dennis.troopsInSupply).toBe(4)
  })
})
