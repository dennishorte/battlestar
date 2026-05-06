'use strict'

const t = require('../../../testutil.js')
const card = require('./reach-agreement.js')

function driveToCombat(game) {
  let safety = 80
  while (safety-- > 0 && game.waiting && game.state.phase !== 'combat') {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      break
    }
  }
}

describe("reach-agreement", () => {
  test('data', () => {
    expect(card.id).toBe("reach-agreement")
    expect(card.name).toBe("Reach Agreement")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('combat: retreat 1 troop → +1 Contract', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 2, micah: 1 } },
      dennis: { intrigue: ['Reach Agreement'], troopsInSupply: 8 },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)

    expect(t.currentChoices(game)).toContain('Reach Agreement')
    t.choose(game, 'Reach Agreement')

    expect(t.currentChoices(game)).toContain('Retreat 1')
    t.choose(game, 'Retreat 1')
    // takeContract opens chooser.
    t.choose(game, t.currentChoices(game)[0])

    const dennis = game.players.byName('dennis')
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
    expect(dennis.troopsInSupply).toBe(9)
    expect(game.zones.byId('dennis.contracts').cardlist().length).toBe(1)
  })

  test('combat: retreat 2 troops → +1 Contract', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 3, micah: 1 } },
      dennis: { intrigue: ['Reach Agreement'], troopsInSupply: 8 },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)
    t.choose(game, 'Reach Agreement')

    expect(t.currentChoices(game)).toContain('Retreat 2')
    t.choose(game, 'Retreat 2')
    t.choose(game, t.currentChoices(game)[0])

    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })

  test('combat: declining keeps troops in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 2, micah: 1 } },
      dennis: { intrigue: ['Reach Agreement'] },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)
    t.choose(game, 'Reach Agreement')
    t.choose(game, 'Pass')

    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
    expect(game.zones.byId('dennis.contracts').cardlist().length).toBe(0)
  })

  test('combat: with only 1 troop deployed, only Retreat 1 is offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1, micah: 1 } },
      dennis: { intrigue: ['Reach Agreement'] },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)
    t.choose(game, 'Reach Agreement')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Retreat 1')
    expect(choices).not.toContain('Retreat 2')
  })
})
