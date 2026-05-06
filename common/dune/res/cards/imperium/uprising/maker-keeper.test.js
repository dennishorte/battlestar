'use strict'

const t = require('../../../../testutil')
const card = require('./maker-keeper.js')

describe('maker-keeper', () => {

  test('data', () => {
    expect(card.id).toBe('maker-keeper')
    expect(card.name).toBe('Maker Keeper')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toEqual(['bene-gesserit', 'fremen'])
    expect(card.agentIcons).toEqual(['purple'])
  })

  function playMakerKeeper(game) {
    t.choose(game, 'Agent Turn.Maker Keeper')
    // Research Station is a purple combat space (water cost 2). After agent
    // resolution, we'll be prompted to deploy units, then maybe the typical
    // post-turn prompts. Drain to next major decision point.
    t.choose(game, 'Research Station')
    let choices = t.currentChoices(game)
    if (choices.includes('Maker Keeper')) {
      t.choose(game, 'Maker Keeper')
    }
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }
  }

  test('agent ability: no bonuses when influence below 2', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Maker Keeper'],
        spice: 0, water: 2,
        influence: { 'bene-gesserit': 1, fremen: 1 },
      },
    })
    game.run()
    playMakerKeeper(game)
    const dennis = game.players.byName('dennis')
    // Started with 2 water, paid 2 for Research Station, no bonus from card
    expect(dennis.water).toBe(0)
    expect(dennis.spice).toBe(0)
  })

  test('agent ability: BG ≥ 2 grants +1 Water only', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Maker Keeper'],
        spice: 0, water: 2,
        influence: { 'bene-gesserit': 2, fremen: 0 },
      },
    })
    game.run()
    playMakerKeeper(game)
    const dennis = game.players.byName('dennis')
    // Paid 2 water; BG bonus +1 ⇒ net 1
    expect(dennis.water).toBe(1)
    expect(dennis.spice).toBe(0)
  })

  test('agent ability: Fremen ≥ 2 grants +1 Spice only', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Maker Keeper'],
        spice: 0, water: 2,
        influence: { 'bene-gesserit': 0, fremen: 2 },
      },
    })
    game.run()
    playMakerKeeper(game)
    const dennis = game.players.byName('dennis')
    // Paid 2 water; no BG bonus ⇒ water 0; +1 Spice from Fremen
    expect(dennis.water).toBe(0)
    expect(dennis.spice).toBe(1)
  })

  test('agent ability: both ≥ 2 grants +1 Water and +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Maker Keeper'],
        spice: 0, water: 2,
        influence: { 'bene-gesserit': 2, fremen: 2 },
      },
    })
    game.run()
    playMakerKeeper(game)
    const dennis = game.players.byName('dennis')
    // Paid 2 water; +1 BG ⇒ 1 water; +1 Fremen ⇒ 1 spice
    expect(dennis.water).toBe(1)
    expect(dennis.spice).toBe(1)
  })

  test('reveal: +2 persuasion (no reveal ability)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Maker Keeper'] },
    })
    game.run()
    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
