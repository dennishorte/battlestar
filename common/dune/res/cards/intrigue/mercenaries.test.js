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

    expect(game.waiting.selectors[0].plotActions.map(p => p.title)).toContain('Mercenaries')
    t.playPlot(game, 'Mercenaries')

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

    t.playPlot(game, 'Mercenaries')
    t.choose(game, 'Decline')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(5)
    expect(dennis.troopsInGarrison).toBe(0)
  })

  test('not offered without 3 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Mercenaries'], solari: 2 },
    })
    game.run()

    const plots = (game.waiting.selectors[0].plotActions || []).map(p => p.title)
    expect(plots).not.toContain('Mercenaries')
    const held = game.zones.byId('dennis.intrigue').cardlist()
    expect(held.some(c => c.name === 'Mercenaries')).toBe(true)
    expect(game.players.byName('dennis').solari).toBe(2)
  })
})
