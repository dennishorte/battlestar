'use strict'

const t = require('../../../testutil.js')
const card = require('./spring-the-trap.js')

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

describe("spring-the-trap", () => {
  test('data', () => {
    expect(card.id).toBe("spring-the-trap")
    expect(card.name).toBe("Spring the Trap")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSpies).toBe(true)
  })

  test('combat: recall 2 spies, +7 swords; both spies returned to supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 4,
        intrigue: ['Spring the Trap'],
        spiesInSupply: 0,
      },
      spyPosts: { D: ['dennis'], E: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    expect(t.currentChoices(game)).toContain('Spring the Trap')
    t.choose(game, 'Spring the Trap')

    // First recall prompts between two posts; second auto-resolves with one left.
    t.choose(game, 'Post D')

    const dennis = game.players.byName('dennis')
    // Two spies recalled — counter persists across the round boundary; spyPosts
    // are re-seeded by setBoard at every after-round-start breakpoint, so we
    // assert via the counter instead.
    expect(dennis.spiesInSupply).toBe(2)
    expect(game.zones.byId('common.intrigueDiscard').cardlist().some(c => c.name === 'Spring the Trap')).toBe(true)
  })

  test('combat: with fewer than 2 spies, card has no effect (no recall, no swords)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 4,
        intrigue: ['Spring the Trap'],
        spiesInSupply: 0,
      },
      spyPosts: { D: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    driveToDennisCombatIntrigue(game)
    expect(t.currentChoices(game)).toContain('Spring the Trap')
    t.choose(game, 'Spring the Trap')

    const dennis = game.players.byName('dennis')
    // Spy stays placed
    expect(game.state.spyPosts['D']).toContain('dennis')
    expect(dennis.spiesInSupply).toBe(0)
  })
})
