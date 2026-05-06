'use strict'

const t = require('../../../../testutil')
const card = require('./dangerous-rhetoric.js')

describe('dangerous-rhetoric', () => {

  test('data', () => {
    expect(card.id).toBe('dangerous-rhetoric')
    expect(card.name).toBe('Dangerous Rhetoric')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.agentIcons).toEqual(['green'])
    expect(card.spyAccess).toBe(true)
  })

  test('agent ability: gain +1 influence with chosen faction and trash itself', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Dangerous Rhetoric'],
        influence: { fremen: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dangerous Rhetoric')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Dangerous Rhetoric')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(1)
    const trashed = game.zones.byId('common.trash').cardlist()
    expect(trashed.some(c => c.name === 'Dangerous Rhetoric')).toBe(true)
    // Card was trashed, not in played zone.
    const played = game.zones.byId('dennis.played').cardlist()
    expect(played.some(c => c.name === 'Dangerous Rhetoric')).toBe(false)
  })

  test('agent ability: chosen emperor faction grants +1 emperor', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Dangerous Rhetoric'],
        influence: { emperor: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dangerous Rhetoric')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Dangerous Rhetoric')
    t.choose(game, 'emperor')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(1)
  })

  test('reveal grants 1 persuasion and 1 sword (with deployed troop)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Dangerous Rhetoric'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    // 1 troop × 2 + 1 sword = 3
    expect(dennis.getCounter('strength')).toBe(3)
  })

  test('reveal: with no units in conflict, sword does not contribute to strength', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Dangerous Rhetoric'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.getCounter('strength')).toBe(0)
  })
})
