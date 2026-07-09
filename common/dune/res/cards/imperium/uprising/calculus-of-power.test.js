'use strict'

const t = require('../../../../testutil')
const card = require('./calculus-of-power.js')

describe('calculus-of-power', () => {

  test('data', () => {
    expect(card.id).toBe('calculus-of-power')
    expect(card.name).toBe('Calculus of Power')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('emperor')
  })

  test('agent ability: Trash a card removes a hand card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Calculus of Power', 'Dagger'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Calculus of Power')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Calculus of Power')
    const choices = t.currentChoices(game)
    const target = choices.find(c => c.startsWith('Dagger '))
    t.choose(game, target)

    const trashed = game.zones.byId('common.trash').cardlist()
    expect(trashed.some(c => c.name === 'Dagger')).toBe(true)
  })

  test('agent ability: Pass leaves hand intact', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Calculus of Power', 'Dagger'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Calculus of Power')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Calculus of Power')
    t.choose(game, 'Pass')

    const trashed = game.zones.byId('common.trash').cardlist()
    expect(trashed.some(c => c.name === 'Dagger')).toBe(false)
  })

  test('reveal: trash another emperor card grants 3 swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Calculus of Power'],
        played: ['Imperial Spymaster'],
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Imperial Spymaster')

    const dennis = game.players.byName('dennis')
    expect(dennis.strength).toBe(3)
    const trashed = game.zones.byId('common.trash').cardlist()
    expect(trashed.some(c => c.name === 'Imperial Spymaster')).toBe(true)
  })

  test('reveal: pass keeps emperor card and gives no swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Calculus of Power'],
        played: ['Imperial Spymaster'],
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.strength).toBe(0)
  })

  test('reveal: with no other emperor card in play, no prompt and no swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Calculus of Power'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.strength).toBe(0)
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
