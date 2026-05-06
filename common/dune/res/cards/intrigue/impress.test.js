'use strict'

const t = require('../../../testutil.js')
const card = require('./impress.js')

function driveToCombatIntrigue(game) {
  let safety = 80
  while (game.waiting && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Impress')) {
      return
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
}

describe("impress", () => {
  test('data', () => {
    expect(card.id).toBe("impress")
    expect(card.name).toBe("Impress")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('combat: +2 swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Impress'],
      },
      conflict: {
        deployedTroops: { dennis: 2 },
      },
      conflictCard: { id: 'conflict-trade-dispute' },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Impress')

    expect(game.waiting.selectors[0]?.title).toBe('Choose a Contract to take')
    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Impress').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(2)
  })

  // See common/dune/docs/known-bugs.md — Impress's "Acquire a card that
  // costs 3 Persuasion or less" has no combat-time acquire path. The current
  // implementation grants +3 persuasion at combat time, which is dead since
  // persuasion resets before the next acquire phase.
  it.skip('combat: acquire a card costing 3 Persuasion or less', () => {})
})
