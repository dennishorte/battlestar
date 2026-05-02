'use strict'

const t = require('../../../../testutil')
const card = require('./stilgar-the-devoted.js')

describe('Stilgar, The Devoted', () => {

  test('data', () => {
    expect(card.id).toBe('stilgar-the-devoted')
    expect(card.name).toBe('Stilgar, The Devoted')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('reveal alone gives base 2 persuasion (does not count itself)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar reveal(2) + 0 other Fremen × 2 = 2
    expect(dennis.getCounter('persuasion')).toBe(2)
  })

  test('one other Fremen card in hand gives +2 bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted', 'Desert Survival'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + Desert Survival(1) + 1 other Fremen × 2 = 5
    expect(dennis.getCounter('persuasion')).toBe(5)
  })

  test('two other Fremen cards in hand give +4 bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted', 'Desert Survival', 'Maula Pistol'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + Desert Survival(1) + Maula Pistol(1) + 2 other Fremen × 2 = 8
    expect(dennis.getCounter('persuasion')).toBe(8)
  })

  test('counts a Fremen card already played as an agent this round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Stilgar, The Devoted'],
        played: ['Desert Survival'],
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + 1 other Fremen (Desert Survival in played) × 2 = 4
    expect(dennis.getCounter('persuasion')).toBe(4)
  })

  test('counts Fremen cards across both played and revealed zones', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Stilgar, The Devoted', 'Maula Pistol'],
        played: ['Desert Survival'],
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + Maula Pistol(1) + 2 other Fremen (Maula Pistol + Desert Survival) × 2 = 7
    expect(dennis.getCounter('persuasion')).toBe(7)
  })

  test('does not count opponent\'s Fremen cards in their played zone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted'] },
      micah: { played: ['Desert Survival'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + 0 other Fremen (micah's card doesn't count) × 2 = 2
    expect(dennis.getCounter('persuasion')).toBe(2)
  })

  test('non-Fremen cards in revealed hand do not contribute to bonus', () => {
    const game = t.fixture()
    // Southern Elders has factionAccess fremen but factionAffiliation
    // bene-gesserit — should NOT count toward Stilgar's bonus.
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted', 'Southern Elders'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Stilgar(2) + Southern Elders(0) + 0 other Fremen × 2 = 2.
    // Note: Southern Elders' Fremen Bond fires (Stilgar is Fremen) → +2.
    // Total: 4.
    expect(dennis.getCounter('persuasion')).toBe(4)
  })
})
