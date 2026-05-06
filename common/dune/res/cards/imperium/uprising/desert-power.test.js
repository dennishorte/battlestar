'use strict'

const t = require('../../../../testutil')
const card = require('./desert-power.js')

describe('desert-power', () => {
  test('data', () => {
    expect(card.id).toBe('desert-power')
    expect(card.name).toBe('Desert Power')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.hasSandworms).toBe(true)
  })

  test('agent ability: +2 Spice when sent to a Maker space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Desert Power', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Desert Power')
    t.choose(game, 'Imperial Basin') // Maker space, free
    let choices = t.currentChoices(game)
    while (choices.includes('Desert Power') && choices.includes('Imperial Basin')) {
      t.choose(game, 'Desert Power')
      choices = t.currentChoices(game)
    }
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    const dennis = game.players.byName('dennis')
    // +2 Spice from Desert Power + 1 Spice from Imperial Basin's spice-harvest = 3
    expect(dennis.spice).toBe(3)
  })

  test('agent ability: no spice when sent to a non-Maker yellow space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Desert Power', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        spice: 0,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Desert Power')
    t.choose(game, 'Accept Contract')
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
      if (choices.length === 0) {
        break
      }
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
  })

  test('reveal: only +2 Persuasion option without Maker Hooks', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Power'], water: 5 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // No Maker Hook → only "+2 Persuasion" is offered; auto-resolved.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    // Water unchanged.
    expect(dennis.water).toBe(5)
  })

  test('reveal: with Maker Hook, may pay 1 water for 1 sandworm', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Power'], water: 3 },
      makerHooks: { dennis: 1 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Two-option choice now appears.
    const choices = t.currentChoices(game)
    expect(choices).toEqual(expect.arrayContaining(['+2 Persuasion', 'Pay 1 Water for 1 Sandworm']))
    t.choose(game, 'Pay 1 Water for 1 Sandworm')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(2)
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
    // Persuasion should not have been gained from this branch.
    expect(dennis.getCounter('persuasion')).toBe(0)
  })

  test('reveal: with Maker Hook, may still choose +2 Persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Power'], water: 3 },
      makerHooks: { dennis: 1 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, '+2 Persuasion')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    expect(dennis.water).toBe(3)
    expect(game.state.conflict.deployedSandworms.dennis || 0).toBe(0)
  })
})
