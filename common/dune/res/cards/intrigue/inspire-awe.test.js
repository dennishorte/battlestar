'use strict'

const t = require('../../../testutil.js')
const card = require('./inspire-awe.js')

describe("inspire-awe", () => {
  test('data', () => {
    expect(card.id).toBe("inspire-awe")
    expect(card.name).toBe("Inspire Awe")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSandworms).toBe(true)
  })

  test('plot: prompts to acquire a card costing 3 or less', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
    })
    game.run()

    t.choose(game, 'Inspire Awe')

    // Should now be prompting for an imperium row card
    const title = game.waiting?.selectors[0]?.title || ''
    expect(title).toMatch(/Inspire Awe/)
  })

  test('plot: acquired card goes to discard without sandworm', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
    })
    game.run()

    t.choose(game, 'Inspire Awe')

    const rowZone = game.zones.byId('common.imperiumRow')
    const cheap = rowZone.cardlist().find(c => (c.persuasionCost || 0) <= 3)
    expect(cheap).toBeTruthy()
    const acquiredName = cheap.name
    t.choose(game, acquiredName)

    const inDiscard = game.zones.byId('dennis.discard').cardlist().some(c => c.name === acquiredName)
    const inHand = game.zones.byId('dennis.hand').cardlist().some(c => c.name === acquiredName)
    expect(inDiscard).toBe(true)
    expect(inHand).toBe(false)
  })

  test('plot: acquired card goes to hand with sandworm in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
      conflict: {
        deployedSandworms: { dennis: 1 },
      },
    })
    game.run()

    t.choose(game, 'Inspire Awe')

    const rowZone = game.zones.byId('common.imperiumRow')
    const cheap = rowZone.cardlist().find(c => (c.persuasionCost || 0) <= 3)
    expect(cheap).toBeTruthy()
    const acquiredName = cheap.name
    t.choose(game, acquiredName)

    const inHand = game.zones.byId('dennis.hand').cardlist().some(c => c.name === acquiredName)
    const inDiscard = game.zones.byId('dennis.discard').cardlist().some(c => c.name === acquiredName)
    expect(inHand).toBe(true)
    expect(inDiscard).toBe(false)
  })

  test('plot: pass is allowed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
    })
    game.run()

    t.choose(game, 'Inspire Awe')
    t.choose(game, 'Pass')

    // Game continues normally after passing
    expect(game.waiting).toBeTruthy()
  })
})
