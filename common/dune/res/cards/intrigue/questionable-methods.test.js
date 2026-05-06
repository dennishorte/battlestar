'use strict'

const t = require('../../../testutil.js')
const card = require('./questionable-methods.js')

function driveToCombat(game) {
  // All players: Pass plot (auto-skips with no intrigue plot for non-dennis),
  // Reveal Turn. Combat intrigue prompt opens for each combatant.
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

describe("questionable-methods", () => {
  test('data', () => {
    expect(card.id).toBe("questionable-methods")
    expect(card.name).toBe("Questionable Methods")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('combat: +1 sword always, +4 swords for losing 1 influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Two combatants and micah has a dummy intrigue so the combat-intrigue
      // loop pauses for input after dennis plays Q. Methods (instead of
      // immediately running resolveCombat).
      conflict: { deployedTroops: { dennis: 1, micah: 1 } },
      dennis: {
        intrigue: ['Questionable Methods'],
        influence: { emperor: 1 },
      },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)

    expect(t.currentChoices(game)).toContain('Questionable Methods')
    t.choose(game, 'Questionable Methods')

    const choices = t.currentChoices(game)
    const loseEmperor = choices.find(c => /emperor/i.test(c))
    expect(loseEmperor).toBeDefined()
    t.choose(game, loseEmperor)

    // Capture strength before the combat-intrigue loop exits and afterCombat
    // resets it to 0. Next prompt is micah's combat-intrigue Pass.
    const dennis = game.players.byName('dennis')
    // 2 troop + 1 Dagger reveal sword + Q.M. (1 + 4) = 8
    expect(dennis.getCounter('strength')).toBe(8)
    expect(dennis.getInfluence('emperor')).toBe(0)
  })

  test('combat: declining the influence-loss yields only +1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Two combatants so the combat-intrigue loop pauses for input after
      // dennis plays Q. Methods (instead of immediately running resolveCombat).
      conflict: { deployedTroops: { dennis: 1, micah: 1 } },
      dennis: {
        intrigue: ['Questionable Methods'],
        influence: { emperor: 1 },
      },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)
    t.choose(game, 'Questionable Methods')
    // Inner Pass — decline influence loss.
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    // 2 troop + 1 Dagger + 1 Q.M. = 4
    expect(dennis.getCounter('strength')).toBe(4)
    expect(dennis.getInfluence('emperor')).toBe(1)
  })

  test('combat: with no faction influence, the +4 branch is not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Two combatants so the combat-intrigue loop pauses for input after
      // dennis plays Q. Methods (instead of immediately running resolveCombat).
      conflict: { deployedTroops: { dennis: 1, micah: 1 } },
      dennis: {
        intrigue: ['Questionable Methods'],
        influence: { emperor: 0, fremen: 0, guild: 0, 'bene-gesserit': 0 },
      },
      micah: { intrigue: ['Leverage'] },
    })
    game.run()

    driveToCombat(game)
    t.choose(game, 'Questionable Methods')

    const dennis = game.players.byName('dennis')
    // 2 troop + 1 Dagger + 1 Q.M. = 4 (no faction → no +4 branch)
    expect(dennis.getCounter('strength')).toBe(4)
  })
})
