'use strict'

const t = require('../../../testutil.js')
const card = require('./mercenaries.js')

describe("mercenaries", () => {
  test('data', () => {
    expect(card.id).toBe("mercenaries")
    expect(card.name).toBe("Mercenaries")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('Pay 3 Solari → +1 Intrigue and +2 Troops', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Mercenaries'],
        solari: 5,
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Mercenaries')
    t.choose(game, 'Mercenaries')

    // Cost-effect parser opens a Pay/Decline prompt.
    const choices = t.currentChoices(game)
    const pay = choices.find(c => /Pay 3 Solari/i.test(c))
    expect(pay).toBeDefined()
    t.choose(game, pay)

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(2)
    expect(dennis.troopsInGarrison).toBe(2)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('declining costs nothing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Mercenaries'],
        solari: 5,
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    t.choose(game, 'Mercenaries')
    t.choose(game, 'Decline')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(5)
    expect(dennis.troopsInGarrison).toBe(0)
  })

  test('not enough Solari → Pay branch hidden', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Mercenaries'], solari: 2 },
    })
    game.run()

    t.choose(game, 'Mercenaries')
    // Cannot afford → choice prompt either filters or auto-skips.
    const choices = t.currentChoices(game)
    expect(choices.some(c => /Pay 3 Solari/i.test(c))).toBe(false)
  })
})
