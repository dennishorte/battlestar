const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe("Vuil'raith Cabal", () => {
  test('captures destroyed units during combat', () => {
    const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'cabal-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'acheron': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          '27': {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'cabal-home', count: 5 }],
    })

    // Vuil'raith destroys fighter — Devour captures it
    const captured = game.state.capturedUnits['dennis'] || []
    expect(captured.length).toBeGreaterThanOrEqual(1)
    expect(captured[0].type).toBe('fighter')
    expect(captured[0].originalOwner).toBe('micah')
  })

  test('returns captured unit to place own unit (Amalgamation)', () => {
    const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
    t.setBoard(game, {
      capturedUnits: {
        dennis: [{ type: 'cruiser', originalOwner: 'micah' }],
      },
    })
    game.run()

    const startShips = game.state.units['cabal-home'].space
      .filter(u => u.owner === 'dennis').length

    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis uses Component Action → Amalgamation
    t.choose(game, 'Component Action')
    t.choose(game, 'amalgamation')

    // Choose captured unit to return (only 1, auto-selected)
    // Choose system (auto: cabal-home, only system with ships)
    // Cruiser placed in cabal-home space
    const endShips = game.state.units['cabal-home'].space
      .filter(u => u.owner === 'dennis').length
    expect(endShips).toBe(startShips + 1)

    // Captured units should be empty
    expect(game.state.capturedUnits['dennis'].length).toBe(0)
  })

  test('returns captured unit to research upgrade (Riftmeld)', () => {
    const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
    t.setBoard(game, {
      capturedUnits: {
        dennis: [{ type: 'fighter', originalOwner: 'micah' }],
      },
    })
    game.run()

    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis uses Component Action → Riftmeld
    t.choose(game, 'Component Action')
    t.choose(game, 'riftmeld')

    // Captured unit choice auto-responds (only 1), then choose unit upgrade tech
    t.choose(game, 'infantry-ii')

    // Should gain a unit upgrade tech
    const dennis = game.players.byName('dennis')
    const techs = dennis.getTechIds()
    expect(techs).toContain('self-assembly-routines')
    expect(techs).toContain('infantry-ii')

    // Captured units depleted
    expect(game.state.capturedUnits['dennis'].length).toBe(0)
  })
})
