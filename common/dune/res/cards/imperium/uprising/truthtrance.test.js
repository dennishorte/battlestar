'use strict'

const t = require('../../../../testutil')
const card = require('./truthtrance.js')

describe('truthtrance', () => {

  test('data', () => {
    expect(card.id).toBe('truthtrance')
    expect(card.name).toBe('Truthtrance')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('bene-gesserit')
    expect(card.factionAccess).toEqual(['emperor', 'guild', 'bene-gesserit', 'fremen'])
    expect(card.agentIcons).toEqual([])
    expect(card.agentAbility).toBeNull()
    expect(card.revealPersuasion).toBe(1)
  })

  test('agent: can be sent to any faction space (no card ability fires)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Truthtrance'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Truthtrance')
    t.choose(game, 'Dutiful Service')   // Emperor faction, no cost

    const dennis = game.players.byName('dennis')
    // Standard +1 emperor influence from faction-space placement.
    expect(dennis.getInfluence('emperor')).toBe(1)
    // Dutiful Service contract effect resolves but no card ability fires.
    expect(game.state.boardSpaces['dutiful-service']).toContain('dennis')
  })

  test('reveal: +1 persuasion (no special ability)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Truthtrance'] },
    })
    game.run()
    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
