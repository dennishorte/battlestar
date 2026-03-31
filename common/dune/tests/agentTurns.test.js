const t = require('../testutil')

describe('Agent Turns', () => {

  test('first player acts first', () => {
    const game = t.fixture()
    game.run()

    // First prompt should be for dennis (first player)
    const selector = game.waiting.selectors[0]
    expect(selector.actor).toBe('dennis')
  })

  test('can choose Reveal Turn while agents remain', () => {
    const game = t.fixture()
    game.run()

    // Dennis has 2 agents available but can choose to reveal
    const choices = t.currentChoices(game)
    expect(choices).toContain('Reveal Turn')
    expect(choices).toContain('Agent Turn')
  })

  test('occupied space blocks agent placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      boardSpaces: { 'assembly-hall': 'micah' },
    })
    game.run()

    // Dennis plays Dagger (green), should not see Assembly Hall
    t.choose(game, 'Agent Turn.Dagger')

    const spaces = t.currentChoices(game)
    expect(spaces).not.toContain('Assembly Hall')
  })

  test('agent icon matching enforced — green card cannot visit purple space', () => {
    const game = t.fixture()
    game.run()

    // Dennis plays Dagger (green only)
    t.choose(game, 'Agent Turn.Dagger')

    const spaces = t.currentChoices(game)
    // Green spaces: Assembly Hall, Gather Support, High Council, Imperial Privilege, Sword Master
    expect(spaces).toContain('Assembly Hall')
    expect(spaces).toContain('Gather Support')
    // Purple spaces should NOT be available
    expect(spaces).not.toContain('Arrakeen')
    expect(spaces).not.toContain('Spice Refinery')
  })

  test('faction card accesses faction spaces (cost-free ones)', () => {
    const game = t.fixture()
    game.run()

    // Dennis plays Diplomacy (factionAccess: all 4 factions)
    t.choose(game, 'Agent Turn.Diplomacy')

    const spaces = t.currentChoices(game)
    // All no-cost faction spaces should be available
    expect(spaces).toContain('Dutiful Service')  // emperor
    expect(spaces).toContain('Deliver Supplies')  // guild
    expect(spaces).toContain('Secrets')            // bene-gesserit
    expect(spaces).toContain('Desert Tactics')     // fremen
    expect(spaces).toContain('Fremkit')            // fremen
    // Sardaukar (4 spice) and Heighliner (5 spice) blocked by cost
    expect(spaces).not.toContain('Sardaukar')
    expect(spaces).not.toContain('Heighliner')
  })

  test('influence requirement blocks access without sufficient influence', () => {
    const game = t.fixture()
    game.run()

    // Reconnaissance (purple) — Sietch Tabr requires 2+ Fremen influence
    t.choose(game, 'Agent Turn.Reconnaissance')

    const spaces = t.currentChoices(game)
    expect(spaces).not.toContain('Sietch Tabr')
  })

  test('influence requirement met allows access', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 2 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Sietch Tabr')
  })

  test('once revealed, player turns are skipped', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals immediately
    t.choose(game, 'Reveal Turn')
    // Pass on all acquires
    while (game.waiting) {
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Acquire')) {
        t.choose(game, 'Pass')
      }
      else {
        break
      }
    }

    // Now it should be micah's turn, not dennis's again
    const actor = game.waiting.selectors[0]?.actor
    expect(actor).toBe('micah')
  })
})
