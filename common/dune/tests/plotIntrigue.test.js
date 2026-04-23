const t = require('../testutil')

describe('Plot Intrigue Cards', () => {

  test('plot intrigue offered at start of turn, before agent/reveal choice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    // Plot intrigue is offered BEFORE the Agent/Reveal choice.
    const choices = t.currentChoices(game)
    expect(choices).toContain('Windfall')
    expect(choices).toContain('Pass')

    // Play Windfall: +2 Solari
    t.choose(game, 'Windfall')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(2)

    // Intrigue zone should be empty
    const intrigueZone = game.zones.byId('dennis.intrigue')
    expect(intrigueZone.cardlist().length).toBe(0)

    // Now the agent-turn choice appears.
    const nextChoices = t.currentChoices(game)
    expect(nextChoices.some(c => c === 'Reveal Turn' || c.startsWith?.('Agent Turn'))).toBe(true)
  })

  test('pass on plot intrigue and proceed with agent turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    // Pass on plot intrigue at start of turn
    t.choose(game, 'Pass')

    // Then choose Agent Turn.Dagger
    t.choose(game, 'Agent Turn.Dagger')

    // Should now be at board space choice — plot is NOT offered mid-action
    const choices = t.currentChoices(game)
    expect(choices).toContain('Assembly Hall')
    expect(choices).not.toContain('Windfall')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(0)

    // Intrigue card still in zone
    const intrigueZone = game.zones.byId('dennis.intrigue')
    expect(intrigueZone.cardlist().length).toBe(1)
  })

  test('plot intrigue offered at start of reveal turn, before the Reveal choice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 1, intrigue: ['Water Peddlers Union'] },
    })
    game.run()

    // Plot intrigue offered BEFORE picking Reveal Turn.
    const choices = t.currentChoices(game)
    expect(choices).toContain('Water Peddlers Union')

    t.choose(game, 'Water Peddlers Union')

    const player = game.players.byName('dennis')
    expect(player.water).toBe(2) // 1 starting + 1 from WPU
  })
})
