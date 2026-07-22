'use strict'

const t = require('../../../../testutil')
const card = require('./guild-envoy.js')

describe('guild-envoy', () => {
  test('data', () => {
    expect(card.id).toBe('guild-envoy')
    expect(card.name).toBe('Guild Envoy')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('guild')
    expect(card.factionAccess).toEqual(['emperor', 'guild', 'bene-gesserit', 'fremen'])
  })

  test('agent ability: discarding a non-Guild card draws no cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Guild Envoy', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        influence: { guild: 2 },
      },
    })
    game.run()

    // Heighliner (guild faction space) requires 2 Guild influence + 5 spice. Use
    // Deliver Supplies (guild) instead — also faction-access card target.
    // Guild Envoy has no agentIcon, but factionAccess includes guild → can go
    // to guild-affiliated spaces. Deliver Supplies is free.
    t.choose(game, 'Agent Turn.Guild Envoy')
    t.choose(game, 'Deliver Supplies')
    let choices = t.currentChoices(game)
    while (choices.includes('Guild Envoy') && choices.includes('Deliver Supplies')) {
      t.choose(game, 'Guild Envoy')
      choices = t.currentChoices(game)
    }
    // Discard prompt — pick a non-Guild card (Dagger).
    expect(choices).toContain('Dagger')
    t.choose(game, 'Dagger')

    // Hand: 5 - 1 (played) - 1 (discarded) = 3, no extra draws
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(3)
    const discard = game.zones.byId('dennis.discard')
    expect(discard.cardlist().some(c => c.name === 'Dagger')).toBe(true)
    const logs = game.log.getLog().filter(e => e.template).map(e => e.template)
    expect(logs).toContain('{player} discards {card}')
  })

  test('agent ability: discarding a Spacing Guild card draws 2 cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Cargo Runner has factionAffiliation: 'guild'. Use it as the discard target.
      dennis: {
        handExact: ['Guild Envoy', 'Cargo Runner', 'Diplomacy', 'Convincing Argument', 'Dagger'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Guild Envoy')
    t.choose(game, 'Deliver Supplies')
    let choices = t.currentChoices(game)
    while (choices.includes('Guild Envoy') && choices.includes('Deliver Supplies')) {
      t.choose(game, 'Guild Envoy')
      choices = t.currentChoices(game)
    }
    expect(choices).toContain('Cargo Runner')
    t.choose(game, 'Cargo Runner')

    // Hand: 5 - 1 (played) - 1 (discarded) + 2 (drew from guild synergy) = 5
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(5)
  })

  test('reveal: contributes 1 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Guild Envoy'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
