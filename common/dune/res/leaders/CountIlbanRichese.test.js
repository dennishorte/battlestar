'use strict'

const leader = require('./CountIlbanRichese.js')
const t = require('../../testutil')

describe('Count Ilban Richese', () => {
  test('data', () => {
    expect(leader.name).toBe('Count Ilban Richese')
    expect(leader.leaderAbility).toContain('Ruthless Negotiator')
  })

  test('Ruthless Negotiator: draws 1 card when paying solari via Gather Support paid choice', () => {
    const leaderData = require('../leaders/index.js')
    const richese = leaderData.find(l => l.name === 'Count Ilban Richese')

    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      leaders: { dennis: richese },
      dennis: {
        solari: 5,
        handExact: ['Guild Bankers'],
      },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    // Dennis: Agent Turn with Guild Bankers (green icon)
    t.choose(game, 'Agent Turn.Guild Bankers')
    t.choose(game, 'Gather Support')
    t.choose(game, 'Pay 2 Solari for 2 troops and 1 water')

    const dennis = game.players.byName('dennis')
    // 5 - 2 = 3 solari remaining
    expect(dennis.solari).toBe(3)
    // Ruthless Negotiator should have drawn 1 card into hand
    // handBefore was 0 (Guild Bankers was played as agent), now 1 from draw
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore) // net: -1 played +1 drawn = same count
  })

  test('Ruthless Negotiator: does NOT trigger when taking free Gather Support option', () => {
    const leaderData = require('../leaders/index.js')
    const richese = leaderData.find(l => l.name === 'Count Ilban Richese')

    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      leaders: { dennis: richese },
      dennis: {
        solari: 5,
        handExact: ['Guild Bankers'],
      },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    t.choose(game, 'Agent Turn.Guild Bankers')
    t.choose(game, 'Gather Support')
    t.choose(game, 'Gain 2 troops')

    const dennis = game.players.byName('dennis')
    // Solari unchanged
    expect(dennis.solari).toBe(5)
    // No card draw from Ruthless Negotiator
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter).toBe(handBefore - 1) // only -1 for the played agent card
  })
})
