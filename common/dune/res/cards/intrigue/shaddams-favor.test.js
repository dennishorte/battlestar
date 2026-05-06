'use strict'

const t = require('../../../testutil.js')
const card = require('./shaddams-favor.js')

describe("shaddams-favor", () => {
  test('data', () => {
    expect(card.id).toBe("shaddams-favor")
    expect(card.name).toBe("Shaddam's Favor")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: +1 Troop, no Emperor synergy bonus when influence < 3', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ["Shaddam's Favor"],
        troopsInGarrison: 0,
        troopsInSupply: 12,
        solari: 0,
        influence: { emperor: 2 },
      },
    })
    game.run()

    expect(t.currentChoices(game)).toContain("Shaddam's Favor")
    t.choose(game, "Shaddam's Favor")

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(dennis.solari).toBe(0)
  })

  test('plot: +1 Troop and +3 Solari with 3 Emperor influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ["Shaddam's Favor"],
        troopsInGarrison: 0,
        troopsInSupply: 12,
        solari: 0,
        influence: { emperor: 3 },
      },
    })
    game.run()

    t.choose(game, "Shaddam's Favor")

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(dennis.solari).toBe(3)
  })

  test('plot: no troops in supply still grants the Emperor synergy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ["Shaddam's Favor"],
        troopsInGarrison: 0,
        troopsInSupply: 0,
        solari: 0,
        influence: { emperor: 3 },
      },
    })
    game.run()

    t.choose(game, "Shaddam's Favor")

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(0)
    expect(dennis.solari).toBe(3)
  })
})
