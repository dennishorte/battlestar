'use strict'

const t = require('../../../testutil.js')
const card = require('./contingency-plan.js')

describe("contingency-plan", () => {
  test('data', () => {
    expect(card.id).toBe("contingency-plan")
    expect(card.name).toBe("Contingency Plan")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.count).toBe(3)
  })

  test('plot: +2 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Contingency Plan'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Contingency Plan')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(2)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Contingency Plan')).toBe(true)
  })

  test('combat: +3 Swords added to strength breakdown', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        // Pair with Bribery so combat-intrigue loop pauses again before resolution.
        intrigue: ['Contingency Plan', 'Bribery'],
      },
    })
    game.run()

    t.choose(game, 'Pass')
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    let safety = 60
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Contingency Plan')) {
        break
      }
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    expect(t.currentChoices(game)).toContain('Contingency Plan')
    t.choose(game, 'Contingency Plan')

    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Contingency Plan').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(3)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Contingency Plan')).toBe(true)
  })
})
