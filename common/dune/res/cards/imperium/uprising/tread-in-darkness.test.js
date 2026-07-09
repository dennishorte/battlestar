'use strict'

const t = require('../../../../testutil')
const card = require('./tread-in-darkness.js')

describe('tread-in-darkness', () => {

  test('data', () => {
    expect(card.id).toBe('tread-in-darkness')
    expect(card.name).toBe('Tread in Darkness')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('bene-gesserit')
    expect(card.agentIcons).toEqual(['green', 'purple', 'yellow'])
    expect(card.revealPersuasion).toBe(2)
    expect(card.revealSwords).toBe(1)
    expect(typeof card.agentEffect).toBe('function')
  })

  test('agent ability: with another BG card in play — trash + draw fires', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Tread in Darkness'],
        played: ['Bene Gesserit Operative'],
      },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length

    t.choose(game, 'Agent Turn.Tread in Darkness')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Tread in Darkness')   // resolve card before space
    // trash-card prompts: dennis can pick a card to trash (or Pass).
    t.choose(game, 'Pass')

    // After Pass, draw a card fires.
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    // Hand: -1 (played Tread) + 1 (drew) = handBefore. handBefore was 0 (only TiD).
    expect(handAfter).toBe(handBefore + 0)   // played 1, drew 1
  })

  test('agent ability: with another BG in play — trash hand card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Tread in Darkness', 'Spy Network'],
        played: ['Bene Gesserit Operative'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Tread in Darkness')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Tread in Darkness')
    t.choose(game, 'Spy Network (Hand)')

    const allZones = ['hand', 'played', 'discard', 'deck', 'revealed']
      .map(z => game.zones.byId(`dennis.${z}`).cardlist().map(c => c.name))
      .flat()
    expect(allZones).not.toContain('Spy Network')
  })

  test('agent ability: no other BG in play — no trash, no draw', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spy Network is Emperor-affiliated, not BG.
      dennis: {
        handExact: ['Tread in Darkness'],
        played: ['Spy Network'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Tread in Darkness')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Tread in Darkness')
    // No trash prompt expected — agentEffect's condition fails.

    // Assembly Hall: +1 persuasion, +1 intrigue card.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('reveal: +2 persuasion, +1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Tread in Darkness'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    // 1 troop ×2 + 1 sword = 3 strength
    expect(dennis.strength).toBe(3)
  })
})
