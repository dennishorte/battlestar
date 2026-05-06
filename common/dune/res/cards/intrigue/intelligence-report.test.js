'use strict'

const t = require('../../../testutil.js')
const card = require('./intelligence-report.js')

describe("intelligence-report", () => {
  test('data', () => {
    expect(card.id).toBe("intelligence-report")
    expect(card.name).toBe("Intelligence Report")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSpies).toBe(true)
  })

  test('plot: draws 1 card with 0 spies on board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Intelligence Report'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length

    expect(t.currentChoices(game)).toContain('Intelligence Report')
    t.choose(game, 'Intelligence Report')

    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore + 1)
  })

  test('plot: draws 1 card with 1 spy on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Intelligence Report'] },
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.choose(game, 'Intelligence Report')
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore + 1)
  })

  test('plot: draws 2 cards with 2+ spies on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Intelligence Report'] },
      spyPosts: { A: ['dennis'], B: ['dennis'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.choose(game, 'Intelligence Report')
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore + 2)
  })

  test('plot: only counts dennis\'s own spies, not opponents\'', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Intelligence Report'] },
      spyPosts: { A: ['dennis'], B: ['micah'], C: ['micah'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.choose(game, 'Intelligence Report')
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    // Dennis has only 1 spy of his own, so only 1 draw.
    expect(handAfter).toBe(handBefore + 1)
  })
})
