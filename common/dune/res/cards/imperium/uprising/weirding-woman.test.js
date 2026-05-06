'use strict'

const t = require('../../../../testutil')
const card = require('./weirding-woman.js')

describe('weirding-woman', () => {

  test('data', () => {
    expect(card.id).toBe('weirding-woman')
    expect(card.name).toBe('Weirding Woman')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('bene-gesserit')
    expect(card.agentIcons).toEqual(['purple', 'yellow'])
    expect(card.revealPersuasion).toBe(1)
    expect(card.revealSwords).toBe(1)
    expect(typeof card.agentEffect).toBe('function')
  })

  test('agent ability: with another BG card in play — return Weirding Woman to hand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Weirding Woman'],
        played: ['Bene Gesserit Operative'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Weirding Woman')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Weirding Woman')   // resolve card before space

    // Card returned to hand from play.
    const handNames = game.zones.byId('dennis.hand').cardlist().map(c => c.name)
    const playedNames = game.zones.byId('dennis.played').cardlist().map(c => c.name)
    expect(handNames).toContain('Weirding Woman')
    expect(playedNames).not.toContain('Weirding Woman')
    // Bene Gesserit Operative remains in play.
    expect(playedNames).toContain('Bene Gesserit Operative')
  })

  test('agent ability: no other BG in play — card stays in play', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spy Network is Emperor, not BG.
      dennis: {
        handExact: ['Weirding Woman'],
        played: ['Spy Network'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Weirding Woman')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Weirding Woman')

    const handNames = game.zones.byId('dennis.hand').cardlist().map(c => c.name)
    const playedNames = game.zones.byId('dennis.played').cardlist().map(c => c.name)
    expect(handNames).not.toContain('Weirding Woman')
    expect(playedNames).toContain('Weirding Woman')
  })

  test('reveal: +1 persuasion, +1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Weirding Woman'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.getCounter('strength')).toBe(3)
  })
})
