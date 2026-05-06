'use strict'

const t = require('../../../testutil.js')
const card = require('./tactical-option.js')

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

describe("tactical-option", () => {
  test('data', () => {
    expect(card.id).toBe("tactical-option")
    expect(card.name).toBe("Tactical Option")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('combat: choose +2 swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 4, intrigue: ['Tactical Option'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    expect(t.currentChoices(game)).toContain('Tactical Option')
    t.choose(game, 'Tactical Option')

    expect(t.currentChoices(game)).toEqual(expect.arrayContaining(['+2 Swords', 'Retreat any number of your Troops']))
    t.choose(game, '+2 Swords')

    expect(game.zones.byId('common.intrigueDiscard').cardlist().some(c => c.name === 'Tactical Option')).toBe(true)
    // Troops still deployed (no retreat)
    // (deployedTroops gets reset on combat resolution; verify pre-resolution by
    // checking that troopsInSupply hasn't been replenished from a retreat — i.e.
    // it's still at the post-deploy value of 0 base since we used everything.)
  })

  test('combat: choose retreat — all deployed troops return to supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 4, troopsInSupply: 0, intrigue: ['Tactical Option'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    t.choose(game, 'Tactical Option')
    t.choose(game, 'Retreat any number of your Troops')

    const dennis = game.players.byName('dennis')
    // Recon recruited 1 to garrison, 2 deployed: troopsInSupply 0 -> after retreat += 2 = 2
    expect(dennis.troopsInSupply).toBe(2)
  })
})
