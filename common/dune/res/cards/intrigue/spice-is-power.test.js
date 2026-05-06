'use strict'

const t = require('../../../testutil.js')
const card = require('./spice-is-power.js')

// Walks the dennis-deploys-then-everyone-reveals dance until dennis is asked
// to play a combat intrigue.
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

describe("spice-is-power", () => {
  test('data', () => {
    expect(card.id).toBe("spice-is-power")
    expect(card.name).toBe("Spice is Power")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('combat: Retreat 3 Troops -> +3 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 6, intrigue: ['Spice is Power'], spice: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 3 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)

    expect(t.currentChoices(game)).toContain('Spice is Power')
    t.choose(game, 'Spice is Power')

    // OR-prompt
    t.choose(game, 'Retreat 3 of your Troops -> +3 Spice')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(3)
    expect(game.state.conflict.deployedTroops.dennis).toBe(0)
  })

  test('combat: Pay 3 Spice -> +6 Swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 4, intrigue: ['Spice is Power'], spice: 5 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    expect(t.currentChoices(game)).toContain('Spice is Power')
    t.choose(game, 'Spice is Power')

    t.choose(game, 'Pay 3 Spice -> +6 Swords')
    // The OR branch's effect re-prompts as a nested cost-choice (Pay vs Decline).
    t.choose(game, 'Pay 3 Spice -> +6 Swords')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(2)
    // Card consumed
    expect(game.zones.byId('dennis.intrigue').cardlist().some(c => c.name === 'Spice is Power')).toBe(false)
    // Card moved to intrigue discard
    expect(game.zones.byId('common.intrigueDiscard').cardlist().some(c => c.name === 'Spice is Power')).toBe(true)
  })
})
