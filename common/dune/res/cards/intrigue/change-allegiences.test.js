'use strict'

const t = require('../../../testutil.js')
const card = require('./change-allegiences.js')

describe("change-allegiences", () => {
  test('data', () => {
    expect(card.id).toBe("change-allegiences")
    expect(card.name).toBe("Change Allegiences")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: swap influence and pay 3 spice for second swap', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Change Allegiences'],
        influence: { fremen: 2 },
        spice: 5,
      },
    })
    game.run()

    t.choose(game, 'Change Allegiences')

    // First swap: choose to lose influence on a faction
    let choices = t.currentChoices(game)
    expect(choices.find(c => c.includes('fremen'))).toBeDefined()
    t.choose(game, choices.find(c => c.includes('fremen')))

    // Then pick faction to gain
    choices = t.currentChoices(game)
    expect(choices).toContain('emperor')
    t.choose(game, 'emperor')

    // Second offer: pay 3 spice
    choices = t.currentChoices(game)
    const payChoice = choices.find(c => /3 Spice/i.test(c))
    expect(payChoice).toBeDefined()
    t.choose(game, payChoice)

    // Faction to gain from spice
    choices = t.currentChoices(game)
    t.choose(game, 'guild')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(1)
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.getInfluence('guild')).toBe(1)
    expect(dennis.spice).toBe(2)
  })

  test('plot: pass on swap, also pass on spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Change Allegiences'],
        influence: { fremen: 2 },
        spice: 5,
      },
    })
    game.run()

    t.choose(game, 'Change Allegiences')
    t.choose(game, 'Pass')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(2)
    expect(dennis.spice).toBe(5)
  })

  test('plot: with 0 influence, only spice option offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Change Allegiences'],
        spice: 5,
      },
    })
    game.run()

    t.choose(game, 'Change Allegiences')

    // No swap branch because no influence — only spice offer.
    const payChoice = t.currentChoices(game).find(c => /3 Spice/i.test(c))
    expect(payChoice).toBeDefined()
    t.choose(game, payChoice)
    t.choose(game, 'bene-gesserit')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(2)
    expect(dennis.getInfluence('bene-gesserit')).toBe(1)
  })
})
