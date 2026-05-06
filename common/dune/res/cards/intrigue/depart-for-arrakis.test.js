'use strict'

const t = require('../../../testutil.js')
const card = require('./depart-for-arrakis.js')

describe("depart-for-arrakis", () => {
  test('data', () => {
    expect(card.id).toBe("depart-for-arrakis")
    expect(card.name).toBe("Depart for Arrakis")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: pay 2 spice → +3 troops', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Depart for Arrakis'],
        spice: 4,
        troopsInGarrison: 0,
        troopsInSupply: 5,
      },
    })
    game.run()

    t.choose(game, 'Depart for Arrakis')
    t.choose(game, 'Pay 2 Spice for +3 Troops')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(2)
    expect(dennis.troopsInGarrison).toBe(3)
    expect(dennis.troopsInSupply).toBe(2)
  })

  test('plot: pass on payment leaves resources unchanged', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Depart for Arrakis'],
        spice: 4,
        troopsInGarrison: 0,
        troopsInSupply: 5,
      },
    })
    game.run()

    t.choose(game, 'Depart for Arrakis')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(4)
    expect(dennis.troopsInGarrison).toBe(0)
  })

  test('plot: with 3 Guild influence, also draws a card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Depart for Arrakis'],
        spice: 4,
        troopsInGarrison: 0,
        troopsInSupply: 5,
        influence: { guild: 3 },
      },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.choose(game, 'Depart for Arrakis')
    t.choose(game, 'Pay 2 Spice for +3 Troops')

    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore + 1)
    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(3)
  })

  test('plot: with insufficient spice, no payment option', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Depart for Arrakis'],
        spice: 1,
        troopsInGarrison: 0,
        troopsInSupply: 5,
      },
    })
    game.run()

    t.choose(game, 'Depart for Arrakis')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(1)
    expect(dennis.troopsInGarrison).toBe(0)
  })
})
