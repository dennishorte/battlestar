'use strict'

const t = require('../../../../testutil')
const card = require('./shishakli.js')

describe('shishakli', () => {
  test('data', () => {
    expect(card.id).toBe('shishakli')
    expect(card.name).toBe('Shishakli')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.agentIcons).toEqual(['purple', 'yellow'])
  })

  test('reveal: alone gives printed +2 swords (no Fremen Bond)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1 } },
      dennis: { handExact: ['Shishakli'], influence: { fremen: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Troop(2) + printed +2 swords(2) = 4
    expect(dennis.getCounter('strength')).toBe(4)
    // No Fremen bond — influence stays at 1.
    expect(dennis.getInfluence('fremen')).toBe(1)
  })

  test('reveal: Fremen Bond grants +1 Fremen Influence when another Fremen is revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1 } },
      dennis: { handExact: ['Shishakli', 'Stilgar, The Devoted'], influence: { fremen: 0 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar is fremen-affiliated → Fremen Bond on Shishakli fires → +1 Fremen.
    expect(dennis.getInfluence('fremen')).toBe(1)
  })

  test('reveal: Fremen Bond does not fire without another Fremen card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1 } },
      dennis: { handExact: ['Shishakli', 'Sardaukar Soldier'], influence: { fremen: 0 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(0)
  })
})
