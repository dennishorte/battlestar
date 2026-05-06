'use strict'

const t = require('../../../testutil.js')
const card = require('./devour.js')

function driveToCombatIntrigue(game) {
  let safety = 80
  while (game.waiting && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Devour')) {
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

describe("devour", () => {
  test('data', () => {
    expect(card.id).toBe("devour")
    expect(card.name).toBe("Devour")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSandworms).toBe(true)
  })

  test('combat: +2 swords with no sandworm', () => {
    const game = t.fixture()
    // Pin a conflict card whose 1st-place reward is "Trash a card" so combat
    // pauses post-resolve, giving us a stable point to read the breakdown.
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Devour'],
      },
      conflict: {
        deployedTroops: { dennis: 2 },
      },
      conflictCard: { id: 'conflict-trade-dispute' },
    })
    game.run()

    driveToCombatIntrigue(game)
    expect(t.currentChoices(game)).toContain('Devour')
    t.choose(game, 'Devour')

    // After resolveCombat, dennis (sole combatant) wins and is prompted to
    // trash a card — the breakdown still exists because afterCombat hasn't
    // run yet.
    // Combat resolves, dennis (sole combatant) wins Trade Dispute and is
    // prompted to choose a contract — afterCombat hasn't run yet, so the
    // strength breakdown is still intact.
    expect(game.waiting.selectors[0]?.title).toBe('Choose a Contract to take')
    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label.startsWith('Devour')).reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(2)
  })

  test('combat: with sandworm in conflict, +4 swords and prompts to trash a card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Devour'],
      },
      micah: {
        troopsInGarrison: 5,
      },
      conflict: {
        deployedTroops: { dennis: 2, micah: 5 },
        deployedSandworms: { dennis: 1 },
      },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Devour')

    // Devour's sandworm branch prompts trash-card and addStrength runs before
    // resolveEffect — so the breakdown is intact at this pause.
    expect(game.waiting.selectors[0]?.title).toBe('Choose a card to trash')
    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label.startsWith('Devour')).reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(4)

    const trashChoices = t.currentChoices(game)
    const target = trashChoices.find(c => c !== 'Pass')
    expect(target).toBeTruthy()
    t.choose(game, target)

    const trash = game.zones.byId('common.trash').cardlist()
    expect(trash.length).toBeGreaterThan(0)
  })
})
