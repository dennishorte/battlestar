const t = require('../testutil')

function plotTitles(game) {
  return (game.waiting.selectors[0].plotActions || []).map(p => p.title)
}

describe('Plot cards during the turn', () => {
  test('Resourceful played before the agent card reaches a yellow space', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Resourceful'] },
    })
    game.run()

    // Dagger is green. Imperial Basin is yellow, so it is not a legal
    // space until Resourceful adds the other colors.
    t.playPlot(game, 'Resourceful')
    t.choose(game, 'Agent Turn.Dagger')

    expect(t.currentChoices(game)).toContain('Imperial Basin')
    expect(plotTitles(game)).not.toContain('Resourceful')
  })

  test('a persuasion plot drawn during reveal can be played before acquire', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { agents: 0, handExact: ['Thufir Hawat'] },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.intrigueDeck')
      const card = deck.cardlist().find(c => c.name === 'Charisma')
      card.moveTo(deck, 0)
    })
    game.run()

    expect(game.waiting.selectors[0].title).toBe('Continue')
    expect(plotTitles(game)).toContain('Charisma')
    t.playPlot(game, 'Charisma')

    expect(game.waiting.selectors[0].title).toContain('3 Persuasion available')
    const row = game.zones.byId('common.imperiumRow').cardlist()
    const newly = row.find(c => {
      const cost = c.persuasionCost || 0
      return cost > 1 && cost <= 3 && t.currentChoices(game).includes(c.name)
    })
    expect(newly).toBeTruthy()
  })

  test('Recruitment Mission played from the acquire prompt puts the card on top of the deck', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Convincing Argument'], intrigue: ['Recruitment Mission'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    expect(plotTitles(game)).toContain('Recruitment Mission')
    t.playPlot(game, 'Recruitment Mission')

    const row = game.zones.byId('common.imperiumRow').cardlist()
    const buy = row.find(c => t.currentChoices(game).includes(c.name))
    expect(buy).toBeTruthy()
    t.choose(game, buy.name)

    const top = game.zones.byId('dennis.deck').cardlist()[0]
    expect(top.name).toBe(buy.name)
  })

  test('Honor Guard played from the empty-garrison pause can deploy that troop', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0, troopsInSupply: 9, intrigue: ['Honor Guard'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Fremkit')

    expect(plotTitles(game)).toContain('Honor Guard')
    t.playPlot(game, 'Honor Guard')
    expect(t.currentChoices(game)).toContain('Deploy 1 troop(s) from garrison')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })

  test('Bribery and Double Cross stay in hand when their effects would do nothing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Bribery', 'Double Cross'], solari: 1 },
    })
    game.run()

    const offered = plotTitles(game)
    expect(offered).not.toContain('Bribery')
    expect(offered).not.toContain('Double Cross')
    const held = game.zones.byId('dennis.intrigue').cardlist().map(c => c.name)
    expect(held).toEqual(expect.arrayContaining(['Bribery', 'Double Cross']))
  })

  test('Bindu Suspension can skip the turn and is not offered on its own question', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Bindu Suspension', 'Withdrawn'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.playPlot(game, 'Bindu Suspension')

    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore + 1)
    expect(t.currentChoices(game)).toEqual(expect.arrayContaining(['Continue Turn', 'Pass Turn']))
    expect(plotTitles(game)).not.toContain('Bindu Suspension')
    expect(plotTitles(game)).not.toContain('Withdrawn')

    t.choose(game, 'Pass Turn')
    expect(game.waiting.selectors[0].actor).not.toBe('dennis')
  })

  test('Withdrawn skips the turn without a question', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Withdrawn'] },
    })
    game.run()

    t.playPlot(game, 'Withdrawn')

    expect(game.log.getLog().some(e => e.template === '{player} passes their turn')).toBe(true)
    expect(game.waiting.selectors[0].actor).not.toBe('dennis')
    expect(game.waiting.selectors[0].title).not.toBe('Pass Turn')
  })

  test("an opponent's prompt does not list the active player's plots", () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Test of Humanity'], intrigue: ['Windfall'] },
      scott: { troopsInGarrison: 2 },
      micah: { troopsInGarrison: 2 },
    })
    game.run()

    expect(plotTitles(game)).toContain('Windfall')
    t.choose(game, 'Agent Turn.Test of Humanity')
    t.choose(game, 'Gather Support')

    let safety = 8
    while (safety-- > 0 && game.waiting && game.waiting.selectors[0].actor === 'dennis') {
      const choices = t.currentChoices(game)
      if (choices.includes('Test of Humanity')) {
        t.choose(game, 'Test of Humanity')
      }
      else if (choices.includes('Gain 2 troops')) {
        t.choose(game, 'Gain 2 troops')
      }
      else if (choices.includes('Continue')) {
        t.choose(game, 'Continue')
      }
      else {
        break
      }
    }

    expect(game.waiting.selectors[0].actor).not.toBe('dennis')
    expect(plotTitles(game)).not.toContain('Windfall')
  })

  test('a combat reward that draws an intrigue does not open a plot pause', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { agents: 0, handExact: [] },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [] },
      conflict: { deployedTroops: { dennis: 2 } },
      conflictCard: { id: 'conflict-skirmish-ornithopter' },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.intrigueDeck')
      const card = deck.cardlist().find(c => c.name === 'Charisma')
      card.moveTo(deck, 0)
    })
    game.run()

    // The reward draw finished and the next round started. A plot pause
    // would have stopped inside the reward, before round 2.
    const templates = game.log.getLog().map(e => e.template)
    const drawAt = templates.findIndex(tpl => tpl === '{player} draws Intrigue: {cards}')
    expect(drawAt).toBeGreaterThan(-1)
    expect(templates[drawAt + 1]).toBe('{player} gains {amount} {resource}')
    expect(game.state.round).toBe(2)
    const held = game.zones.byId('dennis.intrigue').cardlist()
    expect(held.some(c => c.name === 'Charisma')).toBe(true)
  })
})
