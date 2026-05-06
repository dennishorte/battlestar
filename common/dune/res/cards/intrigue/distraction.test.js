'use strict'

const t = require('../../../testutil.js')
const card = require('./distraction.js')

describe("distraction", () => {
  test('data', () => {
    expect(card.id).toBe("distraction")
    expect(card.name).toBe("Distraction")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.count).toBe(2)
    expect(card.hasSpies).toBe(true)
  })

  test('plot: card is offered and plays without error (smoke)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Distraction'] },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Distraction')
    t.choose(game, 'Distraction')

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Distraction')).toBe(true)
  })

  // See common/dune/docs/known-bugs.md — Distraction needs per-turn deploy
  // tracking and a consumer that grants +1 Spy when the threshold is met.
  // Currently sets a flag nothing reads.
  it.skip('plot: arms +1 Spy trigger when 3+ units are deployed in one turn', () => {})

  it.skip('Spy from Distraction may co-locate with another player\'s Spy', () => {})
})
