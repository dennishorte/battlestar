'use strict'

const t = require('../../../testutil.js')
const card = require('./councilors-ambition.js')

describe("councilors-ambition", () => {
  test('data', () => {
    expect(card.id).toBe("councilors-ambition")
    expect(card.name).toBe("Councilor's Ambition")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: with High Council seat, +2 Water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ["Councilor's Ambition"],
        hasHighCouncil: true,
        water: 1,
      },
    })
    game.run()

    t.choose(game, "Councilor's Ambition")

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(3)
  })

  test('plot: without High Council seat, no Water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ["Councilor's Ambition"],
        hasHighCouncil: false,
        water: 1,
      },
    })
    game.run()

    t.choose(game, "Councilor's Ambition")

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(1)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === "Councilor's Ambition")).toBe(true)
  })
})
