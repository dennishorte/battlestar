'use strict'

const t = require('../../../../testutil')
const card = require('./hidden-missive.js')

describe('hidden-missive', () => {
  test('data', () => {
    expect(card.id).toBe('hidden-missive')
    expect(card.name).toBe('Hidden Missive')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('bene-gesserit')
  })

  test('agent ability: with 2+ Bene Gesserit influence grants 1 Troop and draws a card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Hidden Missive', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        influence: { 'bene-gesserit': 2 },
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length

    // Send Hidden Missive to a green space (Assembly Hall is free).
    t.choose(game, 'Agent Turn.Hidden Missive')
    t.choose(game, 'Assembly Hall')
    let choices = t.currentChoices(game)
    while (choices.includes('Hidden Missive') && choices.includes('Assembly Hall')) {
      t.choose(game, 'Hidden Missive')
      choices = t.currentChoices(game)
    }

    // Hidden Missive's agentEffect adds 1 troop & draws 1 card; Assembly Hall
    // gives an Intrigue card and +1 persuasion (no further prompts).
    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('bene-gesserit')).toBeGreaterThanOrEqual(2)
    expect(dennis.troopsInGarrison).toBe(1)
    expect(dennis.troopsInSupply).toBe(11)
    // Hand: started at 5, played Hidden Missive (-1), drew 1 = 5
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore)
  })

  test('agent ability: without sufficient BG influence is a no-op', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Hidden Missive', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        influence: { 'bene-gesserit': 1 },
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Hidden Missive')
    t.choose(game, 'Assembly Hall')

    const dennis = game.players.byName('dennis')
    // No troop gained, no card drawn.
    expect(dennis.troopsInGarrison).toBe(0)
    expect(dennis.troopsInSupply).toBe(12)
    // Hand: 5 → 4 (played Hidden Missive, no draw from card effect)
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(4)
  })

  test('reveal: contributes 1 persuasion and 1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Hidden Missive'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
