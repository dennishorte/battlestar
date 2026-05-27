'use strict'

const t = require('../../../../testutil')
const card = require('./wheels-within-wheels.js')

describe('wheels-within-wheels', () => {

  test('data', () => {
    expect(card.id).toBe('wheels-within-wheels')
    expect(card.name).toBe('Wheels within Wheels')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toEqual(['emperor', 'guild'])
    expect(card.agentIcons).toEqual([])
    expect(card.spyAccess).toBe(true)
    expect(card.revealPersuasion).toBe(1)
    expect(card.revealAbility).toBe('+1 Spy')
    expect(typeof card.agentEffect).toBe('function')
  })

  test('agent ability: 2 emperor influence -> +2 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spy on Post I (assembly-hall, gather-support).
      spyPosts: { I: ['dennis'] },
      dennis: {
        handExact: ['Wheels within Wheels'],
        influence: { emperor: 2, guild: 0 },
        solari: 0,
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Wheels within Wheels')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')   // decline gather intelligence
    t.choose(game, 'Wheels within Wheels')   // resolve card first

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(2)
    expect(dennis.getCounter('spice')).toBe(0)
  })

  test('agent ability: 2 guild influence -> +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { I: ['dennis'] },
      dennis: {
        handExact: ['Wheels within Wheels'],
        influence: { emperor: 0, guild: 2 },
        solari: 0,
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Wheels within Wheels')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')
    t.choose(game, 'Wheels within Wheels')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(0)
    expect(dennis.getCounter('spice')).toBe(1)
  })

  test('agent ability: both factions at 2+ -> +2 Solari and +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { I: ['dennis'] },
      dennis: {
        handExact: ['Wheels within Wheels'],
        influence: { emperor: 2, guild: 2 },
        solari: 0,
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Wheels within Wheels')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')
    t.choose(game, 'Wheels within Wheels')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(2)
    expect(dennis.getCounter('spice')).toBe(1)
  })

  test('agent ability: neither faction at 2 -> no bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { I: ['dennis'] },
      dennis: {
        handExact: ['Wheels within Wheels'],
        influence: { emperor: 1, guild: 1 },
        solari: 0,
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Wheels within Wheels')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')
    t.choose(game, 'Wheels within Wheels')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(0)
    expect(dennis.getCounter('spice')).toBe(0)
  })

  test('reveal: +1 persuasion and +1 spy placed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Wheels within Wheels'], spiesInSupply: 3 },
    })
    game.run()
    // Spy-access-only card with no spies on the board → no valid placement,
    // so Agent Turn is suppressed and Reveal Turn auto-selects.
    // Reveal "+1 Spy" parses to a spy placement prompt.
    const choices = t.currentChoices(game)
    const post = choices.find(c => c.startsWith('Post '))
    t.choose(game, post)

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.spiesInSupply).toBe(2)
  })

  test('emperor multi-affiliation: counts toward Treacherous Maneuver trash list', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Treacherous Maneuver', 'Wheels within Wheels'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Treacherous Maneuver')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Treacherous Maneuver')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Wheels within Wheels')
  })
})
