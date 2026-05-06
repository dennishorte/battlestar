'use strict'

const t = require('../../../testutil.js')
const card = require('./find-weakness.js')

function driveToCombatIntrigue(game) {
  let safety = 80
  while (game.waiting && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Find Weakness')) {
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

describe("find-weakness", () => {
  test('data', () => {
    expect(card.id).toBe("find-weakness")
    expect(card.name).toBe("Find Weakness")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSpies).toBe(true)
  })

  test('combat: +2 swords with no spy on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Find Weakness'],
      },
      conflict: {
        deployedTroops: { dennis: 2 },
      },
      conflictCard: { id: 'conflict-trade-dispute' },
      spyPosts: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [] },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Find Weakness')

    expect(game.waiting.selectors[0]?.title).toBe('Choose a Contract to take')
    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label.startsWith('Find Weakness')).reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(2)
  })

  test('combat: with spy on the board, recalls spy and grants +5 swords total', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Find Weakness'],
        spiesInSupply: 0,
      },
      conflict: {
        deployedTroops: { dennis: 2 },
      },
      conflictCard: { id: 'conflict-trade-dispute' },
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Find Weakness')

    // recallSpy prompts to choose which post to recall from when there's
    // exactly one, the engine auto-resolves; otherwise drive past it.
    let safety = 10
    while (game.waiting && safety-- > 0) {
      const title = game.waiting.selectors[0]?.title || ''
      if (title === 'Choose a Contract to take') {
        break
      }
      const choices = t.currentChoices(game)
      t.choose(game, choices[0])
    }

    expect(game.waiting.selectors[0]?.title).toBe('Choose a Contract to take')

    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label.startsWith('Find Weakness')).reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(5)

    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(1)
    expect((game.state.spyPosts.A || []).includes('dennis')).toBe(false)
  })
})
