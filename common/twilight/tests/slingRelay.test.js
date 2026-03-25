const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Sling Relay', () => {
  test('produces 1 ship in system with space dock', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    // Nomad starts with sling-relay and space dock on Arcturus (4 resources)
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Component Action.sling-relay')
    // Only one system with a space dock — auto-selected
    t.action(game, 'produce-units', {
      units: [{ type: 'cruiser', count: 1 }],
    })

    const ships = game.state.units['nomad-home'].space
      .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
    expect(ships.length).toBe(1)
  })

  test('exhausts the tech after use', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Component Action.sling-relay')
    t.action(game, 'produce-units', {
      units: [{ type: 'fighter', count: 1 }],
    })

    const dennis = game.players.byName('dennis')
    expect(dennis.exhaustedTechs).toContain('sling-relay')
  })

  test('not available when tech is exhausted', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Use it once
    t.choose(game, 'Component Action.sling-relay')
    t.action(game, 'produce-units', {
      units: [{ type: 'fighter', count: 1 }],
    })

    // Should not be available again
    const choices = t.currentSubChoices(game, 'Component Action')
    expect(choices).not.toContain('sling-relay')
  })

  test('exhausts planets to pay for the ship', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Produce a dreadnought (cost 4) — Arcturus has exactly 4 resources
    t.choose(game, 'Component Action.sling-relay')
    t.action(game, 'produce-units', {
      units: [{ type: 'dreadnought', count: 1 }],
    })

    expect(game.state.planets['arcturus'].exhausted).toBe(true)
    const dreads = game.state.units['nomad-home'].space
      .filter(u => u.owner === 'dennis' && u.type === 'dreadnought')
    expect(dreads.length).toBe(1)
  })

  test('can spend trade goods to cover cost', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        tradeGoods: 5,
        planets: { 'arcturus': { exhausted: true } },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // All planets exhausted, must pay with trade goods
    t.choose(game, 'Component Action.sling-relay')
    t.action(game, 'produce-units', {
      units: [{ type: 'cruiser', count: 1 }],
    })

    const dennis = game.players.byName('dennis')
    expect(dennis.tradeGoods).toBe(3) // 5 - 2 (cruiser cost)
    const cruisers = game.state.units['nomad-home'].space
      .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
    expect(cruisers.length).toBe(1)
  })

  test('allows choosing between multiple systems with space docks', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'nomad-home': {
            space: ['flagship', 'carrier'],
            'arcturus': ['infantry', 'infantry', 'space-dock'],
          },
          '27': {
            space: ['destroyer'],
            'new-albion': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Component Action.sling-relay')
    // Two systems available — choose system 27
    t.choose(game, '*27')
    t.action(game, 'produce-units', {
      units: [{ type: 'fighter', count: 1 }],
    })

    const fighters = game.state.units['27'].space
      .filter(u => u.owner === 'dennis' && u.type === 'fighter')
    expect(fighters.length).toBe(1)
  })

  test('skipping production does not produce anything', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const shipsBefore = game.state.units['nomad-home'].space
      .filter(u => u.owner === 'dennis').length

    t.choose(game, 'Component Action.sling-relay')
    t.choose(game, 'Done') // skip production

    const shipsAfter = game.state.units['nomad-home'].space
      .filter(u => u.owner === 'dennis').length
    expect(shipsAfter).toBe(shipsBefore)

    // Tech is still exhausted even if skipped
    const dennis = game.players.byName('dennis')
    expect(dennis.exhaustedTechs).toContain('sling-relay')
  })

  test('non-nomad faction can use sling relay if researched', () => {
    const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'gravity-drive', 'sling-relay'],
        units: {
          'sol-home': {
            space: ['carrier'],
            'jord': ['infantry', 'infantry', 'space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const choices = t.currentSubChoices(game, 'Component Action')
    expect(choices).toContain('sling-relay')

    t.choose(game, 'Component Action.sling-relay')
    t.action(game, 'produce-units', {
      units: [{ type: 'destroyer', count: 1 }],
    })

    const destroyers = game.state.units['sol-home'].space
      .filter(u => u.owner === 'dennis' && u.type === 'destroyer')
    expect(destroyers.length).toBe(1)
  })
})
