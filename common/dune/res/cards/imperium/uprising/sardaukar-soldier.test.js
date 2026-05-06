'use strict'

const t = require('../../../../testutil')
const card = require('./sardaukar-soldier.js')

describe('sardaukar-soldier', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-soldier')
    expect(card.name).toBe('Sardaukar Soldier')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('emperor')
    expect(typeof card.onTrash).toBe('function')
  })

  test('reveal: +1 Persuasion and +1 Sword (no reveal ability)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      conflict: { deployedTroops: { dennis: 1 } },
      dennis: { handExact: ['Sardaukar Soldier'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    // Troop(2) + printed +1 sword(1) = 3
    expect(dennis.getCounter('strength')).toBe(3)
  })

  test('onTrash: trashing this card grants +1 Intrigue card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Diplomacy is a starter card with factionAccess to all four factions
      // and no agent ability of its own — use it to send an agent to Desert
      // Tactics, which has a built-in trash-card effect.
      dennis: { handExact: ['Diplomacy', 'Sardaukar Soldier'], water: 5 },
    })
    game.run()

    const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Desert Tactics')
    // Desert Tactics: gain 1 troop, then trash-card prompt.
    let choices = t.currentChoices(game)
    const soldierChoice = choices.find(c => c.startsWith('Sardaukar Soldier'))
    expect(soldierChoice).toBeDefined()
    t.choose(game, soldierChoice)

    const intrigueAfter = game.zones.byId('dennis.intrigue').cardlist().length
    expect(intrigueAfter - intrigueBefore).toBe(1)
    const trashed = game.zones.byId('common.trash').cardlist().some(c => c.name === 'Sardaukar Soldier')
    expect(trashed).toBe(true)
  })
})
