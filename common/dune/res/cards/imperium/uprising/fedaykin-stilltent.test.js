'use strict'

const t = require('../../../../testutil')
const card = require('./fedaykin-stilltent.js')

describe('fedaykin-stilltent', () => {
  test('data', () => {
    expect(card.id).toBe('fedaykin-stilltent')
    expect(card.name).toBe('Fedaykin Stilltent')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('agent ability: gains 1 Troop when sent to a Maker space (Imperial Basin)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Fedaykin Stilltent', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    // Imperial Basin is a yellow Maker space (no cost).
    t.choose(game, 'Agent Turn.Fedaykin Stilltent')
    t.choose(game, 'Imperial Basin')
    let choices = t.currentChoices(game)
    while (choices.includes('Fedaykin Stilltent') && choices.includes('Imperial Basin')) {
      t.choose(game, 'Fedaykin Stilltent')
      choices = t.currentChoices(game)
    }
    // Imperial Basin is a combat space — deploy 0.
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(dennis.troopsInSupply).toBe(11)
  })

  test('agent ability: no Troop when sent to a non-Maker yellow space (Accept Contract)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Fedaykin Stilltent', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        troopsInGarrison: 0,
        troopsInSupply: 12,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Fedaykin Stilltent')
    t.choose(game, 'Accept Contract')
    // Resolve any contract-pick prompt by choosing the first option.
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
      if (choices.length === 0) {
        break
      }
    }

    const dennis = game.players.byName('dennis')
    // No troop gained from the conditional ability.
    expect(dennis.troopsInGarrison).toBe(0)
    expect(dennis.troopsInSupply).toBe(12)
  })

  test('reveal: +1 Water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Fedaykin Stilltent'],
        water: 1,
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(2)
  })
})
