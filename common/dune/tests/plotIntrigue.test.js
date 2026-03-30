const t = require('../testutil')

describe('Plot Intrigue Cards', () => {

  test('plot intrigue offered at start of agent turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    // Dennis takes agent turn
    t.choose(game, 'Agent Turn')

    // Plot intrigue is offered before card choice
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
  })

  test('can pass on plot intrigue and proceed with agent turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    t.choose(game, 'Agent Turn')

    // Pass on plot intrigue
    t.choose(game, 'Pass')

    // Should now be at card choice
    const choices = t.currentChoices(game)
    expect(choices).toContain('Dagger')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(0)

    // Intrigue card still in zone
    const intrigueZone = game.zones.byId('dennis.intrigue')
    expect(intrigueZone.cardlist().length).toBe(1)
  })

  test('plot intrigue offered during reveal turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 1, intrigue: ['Water Peddlers Union'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    // Plot intrigue offered at start of reveal
    const choices = t.currentChoices(game)
    const hasWPU = choices.includes('Water Peddlers Union')
    expect(hasWPU).toBe(true)

    t.choose(game, 'Water Peddlers Union')

    const player = game.players.byName('dennis')
    expect(player.water).toBe(2) // 1 starting + 1 from WPU
  })
})
