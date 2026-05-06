'use strict'

const t = require('../../../testutil.js')
const card = require('./weirding-combat.js')

function driveToDennisCombatIntrigue(game) {
  let safety = 30
  while (game.waiting && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes(card.name) || (choices.includes('Pass') && choices.length === 1)) {
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

describe("weirding-combat", () => {
  test('data', () => {
    expect(card.id).toBe("weirding-combat")
    expect(card.name).toBe("Weirding Combat")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  // Probe Weirding Combat's strength contribution by reading the breakdown
  // entry it records, captured pre-combat-resolution via a breakpoint on
  // the combat phase end.
  function strengthFromWeirding(game, playerName = 'dennis') {
    const breakdown = game.state.conflict.strengthBreakdown[playerName] || []
    return breakdown
      .filter(e => e.label === 'Weirding Combat')
      .reduce((sum, e) => sum + e.amount, 0)
  }

  test('combat: +3 swords without BG influence', () => {
    const game = t.fixture()
    // Pair Weirding Combat with a non-combat intrigue (CHOAM Profits) so the
    // combat-intrigue round pauses again on dennis after he plays — letting
    // us read the strength contribution before combat resolution wipes it.
    t.setBoard(game, {
      dennis: { troopsInGarrison: 4, intrigue: ['Weirding Combat', 'CHOAM Profits'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    t.choose(game, 'Weirding Combat')

    expect(strengthFromWeirding(game)).toBe(3)
    expect(game.zones.byId('common.intrigueDiscard').cardlist().some(c => c.name === 'Weirding Combat')).toBe(true)
  })

  test('combat: +5 swords (3 base + 2 bonus) with 3 BG influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 4,
        intrigue: ['Weirding Combat', 'CHOAM Profits'],
        influence: { 'bene-gesserit': 3 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    t.choose(game, 'Weirding Combat')

    expect(strengthFromWeirding(game)).toBe(5)
  })

  test('combat: BG bonus only applies at 3+ — exactly 2 gives no bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 4,
        intrigue: ['Weirding Combat', 'CHOAM Profits'],
        influence: { 'bene-gesserit': 2 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    t.choose(game, 'Weirding Combat')

    expect(strengthFromWeirding(game)).toBe(3)
  })
})
