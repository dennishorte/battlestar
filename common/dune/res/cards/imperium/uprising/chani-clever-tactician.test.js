'use strict'

const t = require('../../../../testutil')
const card = require('./chani-clever-tactician.js')

describe('chani-clever-tactician', () => {

  test('data', () => {
    expect(card.id).toBe('chani-clever-tactician')
    expect(card.name).toBe('Chani, Clever Tactician')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('agent ability with 3+ units in conflict: +1 intrigue', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician'] },
      conflict: { deployedTroops: { dennis: 3 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Chani, Clever Tactician')
    t.choose(game, 'Accept Contract')
    t.choose(game, 'Chani, Clever Tactician')
    // Accept Contract prompts to choose from market — auto-resolved if 1
    // option, otherwise pick the first contract listed below.
    let choices = t.currentChoices(game)
    if (choices.length > 1 && !choices.some(c => c.startsWith('Agent Turn'))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // +1 intrigue from card. Accept Contract gives a contract + draw, no
    // intrigue.
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('agent ability with fewer than 3 units in conflict: no intrigue', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician'] },
      conflict: { deployedTroops: { dennis: 2 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Chani, Clever Tactician')
    t.choose(game, 'Accept Contract')
    t.choose(game, 'Chani, Clever Tactician')
    // Accept Contract prompts to choose from market — auto-resolved if 1
    // option, otherwise pick the first contract listed below.
    let choices = t.currentChoices(game)
    if (choices.length > 1 && !choices.some(c => c.startsWith('Agent Turn'))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(0)
  })

  test('reveal: retreat 2 troops for +4 swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Chani, Clever Tactician'],
        troopsInSupply: 0,
      },
      conflict: { deployedTroops: { dennis: 3 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Retreat 2 troops for +4 Swords')

    const dennis = game.players.byName('dennis')
    // addStrength(+4) from Chani card, then setRevealStrength adds 2 per
    // remaining deployed troop (1 left after retreat) → 4 + 2 = 6.
    expect(dennis.getCounter('strength')).toBe(6)
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
    expect(dennis.troopsInSupply).toBe(2)
  })

  test('reveal: pass retreat option keeps troops deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Chani, Clever Tactician'],
        troopsInSupply: 0,
      },
      conflict: { deployedTroops: { dennis: 3 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    // 3 deployed troops × 2 strength each, no card swords.
    expect(dennis.getCounter('strength')).toBe(6)
    expect(game.state.conflict.deployedTroops.dennis).toBe(3)
  })

  test('reveal: with fewer than 2 deployed troops, no retreat prompt', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('strength')).toBe(2)
  })

  test('reveal: Fremen Bond fires when another Fremen card is revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician', 'Desert Survival'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Chani has revealPersuasion 0, Desert Survival 1; Fremen Bond grants +2.
    expect(dennis.getCounter('persuasion')).toBe(3)
  })

  test('reveal alone: no Fremen Bond bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(0)
  })
})
