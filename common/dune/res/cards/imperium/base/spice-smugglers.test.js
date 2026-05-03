'use strict'

const t = require('../../../../testutil')
const card = require('./spice-smugglers.js')

describe('spice-smugglers', () => {

  test('data', () => {
    expect(card.id).toBe('spice-smugglers')
    expect(card.name).toBe('Spice Smugglers')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('All')
    expect(card.persuasionCost).toBe(2)
    expect(card.agentIcons).toEqual(['purple'])
    expect(card.factionAffiliation).toBe('guild')
    expect(card.revealPersuasion).toBe(1)
    expect(card.revealSwords).toBe(1)
  })

  test('reveal grants +1 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Spice Smugglers'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })

  test('reveal contributes +1 sword to combat strength when units are deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Spice Smugglers'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // 1 troop (×2) + 1 sword (×1) = 3
    expect(dennis.getCounter('strength')).toBe(3)
  })

  test('agent ability: pay 2 spice → +1 Guild Influence and +3 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Spice Smugglers'],
        spice: 2,
        solari: 0,
        influence: { guild: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Spice Smugglers')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Spice Smugglers')   // resolve card before space
    t.choose(game, 'Pay 2 Spice')

    t.testBoard(game, {
      dennis: {
        spice: 0,
        solari: 3,
        influence: { guild: 1 },
      },
    })
  })

  test('agent ability: decline leaves resources untouched', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Spice Smugglers'],
        spice: 2,
        solari: 0,
        influence: { guild: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Spice Smugglers')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Spice Smugglers')
    t.choose(game, 'Pass')

    t.testBoard(game, {
      dennis: {
        spice: 2,
        solari: 0,
        influence: { guild: 0 },
      },
    })
  })

  test('agent ability: insufficient spice — no prompt, no effect', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Spice Smugglers'],
        spice: 1,
        solari: 0,
        influence: { guild: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Spice Smugglers')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Spice Smugglers')   // resolve card first; effect is a no-op

    // Arrakeen's draw will produce no prompt; spice remains 1, solari/influence unchanged.
    t.testBoard(game, {
      dennis: {
        spice: 1,
        solari: 0,
        influence: { guild: 0 },
      },
    })
  })
})
