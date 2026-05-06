'use strict'

const t = require('../../../../testutil')
const card = require('./junction-headquarters.js')

describe('junction-headquarters', () => {

  test('data', () => {
    expect(card.id).toBe('junction-headquarters')
    expect(card.name).toBe('Junction Headquarters')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('guild')
    expect(card.agentIcons).toEqual(['green', 'purple', 'yellow'])
    expect(card.vpsAvailable).toBe(9)
  })

  function placeAgent(game, target = 'Assembly Hall') {
    t.choose(game, 'Agent Turn.Junction Headquarters')
    t.choose(game, target)
    let choices = t.currentChoices(game)
    if (choices.includes('Junction Headquarters')) {
      t.choose(game, 'Junction Headquarters')
    }
  }

  function drainToTurnEnd(game) {
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }
  }

  test('agent ability: no VP gain when guild influence < 2', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        spice: 5, vp: 0,
        influence: { guild: 1 },
        intrigue: ['Allied Armada'],
      },
    })
    game.run()
    placeAgent(game)
    drainToTurnEnd(game)
    const dennis = game.players.byName('dennis')
    // No prompt to trash intrigue should fire — dennis still has the intrigue
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(5)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBeGreaterThan(0)
  })

  test('agent ability: prompt skipped when no intrigue cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        spice: 5, vp: 0,
        influence: { guild: 2 },
      },
    })
    game.run()
    placeAgent(game)
    drainToTurnEnd(game)
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(5)
  })

  test('agent ability: prompt skipped when spice < 2', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        spice: 1, vp: 0,
        influence: { guild: 2 },
        intrigue: ['Allied Armada'],
      },
    })
    game.run()
    placeAgent(game)
    drainToTurnEnd(game)
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(1)
  })

  test('agent ability: pass declines the trade', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        spice: 5, vp: 0,
        influence: { guild: 2 },
        intrigue: ['Allied Armada'],
      },
    })
    game.run()
    placeAgent(game)
    // Trash-Intrigue prompt: choose Pass
    let choices = t.currentChoices(game)
    expect(choices).toContain('Pass')
    t.choose(game, 'Pass')
    drainToTurnEnd(game)
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.spice).toBe(5)
    // Assembly Hall draws +1 intrigue; original Allied Armada still in zone.
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(2)
  })

  test('agent ability: trash intrigue + 2 spice → +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        spice: 5, vp: 0,
        influence: { guild: 2 },
        intrigue: ['Allied Armada'],
      },
    })
    game.run()
    placeAgent(game)
    let choices = t.currentChoices(game)
    expect(choices).toContain('Allied Armada')
    t.choose(game, 'Allied Armada')
    drainToTurnEnd(game)
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(1)
    expect(dennis.spice).toBe(3)
    // Trashed Allied Armada; Assembly Hall draws a fresh intrigue ⇒ 1 left.
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('reveal: +1 Water and +1 Troop, +1 persuasion base', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Junction Headquarters'],
        water: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const troopsBefore = dennis.troopsInGarrison
    t.choose(game, 'Reveal Turn')
    const dennisAfter = game.players.byName('dennis')
    expect(dennisAfter.water).toBe(1)
    expect(dennisAfter.troopsInGarrison).toBe(troopsBefore + 1)
    expect(dennisAfter.getCounter('persuasion')).toBe(1)
  })
})
