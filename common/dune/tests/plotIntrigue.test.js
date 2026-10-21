const t = require('../testutil')

describe('Plot Intrigue Cards', () => {

  test('plot intrigue is offered beside the turn choice, not inside it', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Windfall')
    expect(choices.some(c => c === 'Reveal Turn' || c === 'Agent Turn')).toBe(true)

    const plots = game.waiting.selectors[0].plotActions.map(p => p.title)
    expect(plots).toContain('Windfall')

    t.playPlot(game, 'Windfall')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(2)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(0)

    // The turn choice is still waiting.
    const nextChoices = t.currentChoices(game)
    expect(nextChoices.some(c => c === 'Reveal Turn' || c === 'Agent Turn')).toBe(true)
  })

  test('a plot can be played from the board-space decision', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Assembly Hall')
    expect(choices).not.toContain('Windfall')
    expect(game.waiting.selectors[0].plotActions.map(p => p.title)).toContain('Windfall')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(0)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('plot played beside the turn choice resolves before Reveal', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 1, intrigue: ['Water Peddlers Union'] },
    })
    game.run()

    const plots = game.waiting.selectors[0].plotActions.map(p => p.title)
    expect(plots).toContain('Water Peddlers Union')
    expect(t.currentChoices(game)).not.toContain('Water Peddlers Union')

    t.playPlot(game, 'Water Peddlers Union')

    const player = game.players.byName('dennis')
    expect(player.water).toBe(2)
  })

  test('version 4 still offers the plot prompt and does not set plotActions', () => {
    const game = t.fixture({ version: 4 })
    t.setBoard(game, {
      dennis: { intrigue: ['Windfall'] },
    })
    game.run()

    const selector = game.waiting.selectors[0]
    expect(t.currentChoices(game)).toContain('Windfall')
    expect(t.currentChoices(game)).toContain('Pass')
    expect(selector.plotActions).toBeUndefined()
    expect(game.settings.version).toBe(4)
  })

  test('an explicit older version stays on that version', () => {
    const game = t.fixture({ version: 3 })
    expect(game.settings.version).toBe(3)
  })
})
