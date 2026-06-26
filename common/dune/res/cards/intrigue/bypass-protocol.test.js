'use strict'

const t = require('../../../testutil.js')
const card = require('./bypass-protocol.js')

describe("bypass-protocol", () => {
  test('data', () => {
    expect(card.id).toBe("bypass-protocol")
    expect(card.name).toBe("Bypass Protocol")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('plot: cheap option acquires card costing 3 or less to discard', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Bypass Protocol'] },
    })
    game.run()

    t.choose(game, 'Bypass Protocol')
    t.choose(game, 'Acquire card costing 3 Persuasion or less')

    const rowZone = game.zones.byId('common.imperiumRow')
    const cheap = rowZone.cardlist().find(c => (c.persuasionCost || 0) <= 3)
    expect(cheap).toBeTruthy()
    const acquiredName = cheap.name
    t.choose(game, acquiredName)

    const inDiscard = game.zones.byId('dennis.discard').cardlist().some(c => c.name === acquiredName)
    expect(inDiscard).toBe(true)
  })

  test('plot: expensive option acquires card costing 5 or less to top of deck', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Bypass Protocol'], spice: 5 },
    })
    game.run()

    t.choose(game, 'Bypass Protocol')
    t.choose(game, 'Pay 2 Spice: Acquire card costing 5 or less (to top of deck)')

    const rowZone = game.zones.byId('common.imperiumRow')
    const medium = rowZone.cardlist().find(c => (c.persuasionCost || 0) <= 5)
    expect(medium).toBeTruthy()
    const acquiredName = medium.name
    t.choose(game, acquiredName)

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(3)
    const inDeck = game.zones.byId('dennis.deck').cardlist().some(c => c.name === acquiredName)
    expect(inDeck).toBe(true)
  })

  test('plot: pass is allowed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Bypass Protocol'] },
    })
    game.run()

    t.choose(game, 'Bypass Protocol')
    t.choose(game, 'Pass')

    expect(game.waiting).toBeTruthy()
  })
})
