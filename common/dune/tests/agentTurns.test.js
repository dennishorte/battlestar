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

  test('card not offered when no valid placement exists (all green spaces occupied, no solari)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // All five green-icon spaces taken by opponents. Dagger (green-only)
      // has no spy connections in the default fixture, so it cannot
      // infiltrate any of them. With 0 solari Dennis also cannot pay the
      // cost-bearing green spaces. Pair Dagger with Diplomacy (faction
      // access to all four factions) so the Choose Turn prompt still
      // fires and we can inspect what's offered.
      boardSpaces: {
        'assembly-hall': 'micah',
        'gather-support': 'micah',
        'high-council': 'scott',
        'imperial-privilege': 'scott',
        'sword-master': 'micah',
      },
      dennis: { handExact: ['Dagger', 'Diplomacy'], solari: 0 },
    })
    game.run()

    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    // Diplomacy still has valid placements; Dagger does not.
    expect(cardTitles).toContain('Diplomacy')
    expect(cardTitles).not.toContain('Dagger')
  })

  test('card not offered when cost-bearing green spaces are unaffordable and free ones are taken', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Free green spaces taken; High Council (5 solari), Imperial Privilege
      // (3 solari + emperor influence), Sword Master (8 solari) unreachable
      // with 2 solari and no emperor influence.
      boardSpaces: {
        'assembly-hall': 'micah',
        'gather-support': 'scott',
      },
      dennis: { handExact: ['Dagger', 'Diplomacy'], solari: 2 },
    })
    game.run()

    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    expect(cardTitles).toContain('Diplomacy')
    expect(cardTitles).not.toContain('Dagger')
  })

  test('card is offered when at least one green space is reachable', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Four of five green spaces occupied; Gather Support is open and free.
      boardSpaces: {
        'assembly-hall': 'micah',
        'high-council': 'scott',
        'imperial-privilege': 'scott',
        'sword-master': 'micah',
      },
      dennis: { handExact: ['Dagger'], solari: 0 },
    })
    game.run()

    // Dagger is the only card in hand. Since it has a valid placement
    // (Gather Support) the Agent Turn option must be offered alongside
    // Reveal Turn.
    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    expect(cardTitles).toContain('Dagger')
  })

  test('mixed hand: only cards with valid placements appear under Agent Turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Public Spectacle has no spy connections → invalid. Dagger has at
      // least one free green space → valid.
      dennis: { handExact: ['Dagger', 'Public Spectacle'], spiesInSupply: 3 },
    })
    game.run()

    // Inspect the nested Agent Turn choice list directly.
    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    expect(cardTitles).toContain('Dagger')
    expect(cardTitles).not.toContain('Public Spectacle')
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

    // Now it should be micah's turn (or scott's), not dennis's again
    const actor = game.waiting.selectors[0]?.actor
    expect(actor).not.toBe('dennis')
  })
})
