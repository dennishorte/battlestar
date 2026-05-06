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

    // After Impress: prompt is the inline acquire (cost <= 3) — pass it.
    t.choose(game, { id: '__pass__' })

    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Impress').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(2)
  })

  test('combat: acquires a row card costing <= 3 Persuasion', () => {
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

    const acquireSelector = game.waiting.selectors.find(
      s => s.title && s.title.startsWith('Impress: acquire')
    )
    expect(acquireSelector).toBeDefined()
    const cheap = acquireSelector.choices.find(c => c.id !== '__pass__')
    expect(cheap).toBeDefined()
    t.choose(game, { id: cheap.id })

    const allCards = [
      ...game.zones.byId('dennis.discard').cardlist(),
      ...game.zones.byId('dennis.deck').cardlist(),
      ...game.zones.byId('dennis.hand').cardlist(),
      ...game.zones.byId('dennis.played').cardlist(),
    ]
    expect(allCards.some(c => c.id === cheap.id)).toBe(true)
  })

  test('combat: pass on acquire still grants the +2 swords', () => {
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

    const acquireSelector = game.waiting.selectors.find(
      s => s.title && s.title.startsWith('Impress: acquire')
    )
    expect(acquireSelector).toBeDefined()
    t.choose(game, { id: '__pass__' })

    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Impress').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(2)
  })
})
