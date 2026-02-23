const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Titans of Ul', () => {
  test('places sleeper token after exploration', () => {
    // Titans terragenesis: after exploring a planet, offer to place sleeper
    // We'll test the exploration flow with a carrier moving to a new planet
    const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'titans-home': {
            space: ['carrier'],
            'elysium': ['infantry', 'infantry', 'space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Move carrier + infantry to system 27 (New Albion + Starpoint)
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [
        { unitType: 'carrier', from: 'titans-home', count: 1 },
        { unitType: 'infantry', from: 'titans-home', count: 2 },
      ],
    })

    // After gaining planet and exploring, Titans get terragenesis prompt
    t.choose(game, 'Place sleeper')

    // Check sleeper placed
    const sleepers = Object.keys(game.state.sleeperTokens)
      .filter(pId => game.state.sleeperTokens[pId] === 'dennis')
    expect(sleepers.length).toBeGreaterThanOrEqual(1)
  })

  test('replaces sleeper with PDS on activation', () => {
    const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
    t.setBoard(game, {
      sleeperTokens: { 'new-albion': 'dennis' },
      dennis: {
        units: {
          'titans-home': {
            space: ['cruiser'],
            'elysium': ['space-dock'],
          },
        },
      },
    })
    game.run()

    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Activate system 27 (which contains new-albion)
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })

    // Sleeper should be replaced with PDS
    expect(game.state.sleeperTokens['new-albion']).toBeUndefined()
    const pdsOnNewAlbion = game.state.units['27'].planets['new-albion']
      .filter(u => u.owner === 'dennis' && u.type === 'pds')
    expect(pdsOnNewAlbion.length).toBe(1)
  })

  describe('Coalescence', () => {
    test('checkCoalescence detects Titans flagship in system', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        micah: {
          units: {
            '27': {
              space: ['flagship'],
            },
          },
        },
      })
      game.run()

      expect(game.factionAbilities.checkCoalescence('27', 'dennis')).toBe(true)
      // Titans own flagship — not triggered for Titans themselves
      expect(game.factionAbilities.checkCoalescence('27', 'micah')).toBe(false)
    })

    test('checkCoalescence detects Titans mech on planet', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        micah: {
          units: {
            '27': {
              'new-albion': ['mech'],
            },
          },
        },
      })
      game.run()

      expect(game.factionAbilities.checkCoalescence('27', 'dennis')).toBe(true)
      expect(game.factionAbilities.checkCoalescenceOnPlanet('27', 'new-albion', 'dennis')).toBe(true)
    })
  })
})
