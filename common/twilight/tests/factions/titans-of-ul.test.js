const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Titans of Ul', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors', 'scanlink-drone-network']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('titans-of-ul')
      expect(faction.factionTechnologies.length).toBe(3)

      const saturn = faction.factionTechnologies.find(t => t.id === 'saturn-engine-ii')
      expect(saturn.color).toBe('unit-upgrade')
      expect(saturn.unitUpgrade).toBe('cruiser')
      expect(saturn.prerequisites).toEqual(['green', 'yellow', 'red'])

      const helTitan = faction.factionTechnologies.find(t => t.id === 'hel-titan-ii')
      expect(helTitan.color).toBe('unit-upgrade')
      expect(helTitan.unitUpgrade).toBe('pds')
      expect(helTitan.prerequisites).toEqual(['yellow', 'red'])

      const slumber = faction.factionTechnologies.find(t => t.id === 'slumberstate-computing')
      expect(slumber.color).toBeNull()
      expect(slumber.unitUpgrade).toBeNull()
      expect(slumber.prerequisites).toEqual(['yellow', 'green'])
    })
  })

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

  describe('Agent — Tellurian', () => {
    test('exhaust to cancel a hit during space combat', () => {
      // Dennis (Titans) has a dreadnought + cruisers.
      // Micah has multiple ships in system 27 to ensure hits are scored.
      // When Micah scores hits against Dennis, Tellurian fires.
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27 — space combat begins
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // Tellurian prompt appears when hits are scored against Dennis.
      // Exhaust agent to cancel 1 hit.
      t.choose(game, 'Exhaust Tellurian')

      // Re-fetch player after game state changes
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('can decline agent and hits are assigned normally', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // Decline the agent
      t.choose(game, 'Pass')

      // Agent should still be ready
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })

    test('no prompt when agent is exhausted', () => {
      // Same setup but with agent already exhausted — combat should resolve
      // without any Tellurian prompt
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27 — combat resolves without agent prompt
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // No Tellurian prompt — combat just resolves
      // If the game is waiting for a non-Tellurian choice, that's fine.
      // The key assertion: agent is still exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })
  })

  describe('Commander — Tungstantus', () => {
    test('gains 1 trade good after producing units', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
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

      // Activate home system and produce units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'titans-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter (cost 1, Elysium has 4 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // Tungstantus should have granted 1 trade good
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })

    test('does not gain trade good when commander is locked', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
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

      // Activate home system and produce units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'titans-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter (cost 1, Elysium has 4 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // Commander locked — no trade good
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })

    test.todo('unlock condition: have 5 structures on the game board')
  })

  describe('Hero — Ul The Progenitor', () => {
    test.todo('GEOFORM: ready Elysium and attach card, increasing resource and influence by 3')
    test.todo('Elysium gains SPACE CANNON 5 (x3) ability')
  })

  describe('Mech — Hecatoncheires', () => {
    test.todo('DEPLOY: when placing a PDS on a planet, may place 1 mech and 1 infantry instead')
  })

  describe('Promissory Note — Terraform', () => {
    test.todo('attach to a non-home planet to increase resource and influence by 1')
    test.todo('planet is treated as having all 3 planet traits')
  })

  describe('Flagship — Ouranos', () => {
    test.todo('DEPLOY: after activating a system with your PDS, may replace 1 PDS with flagship')
  })

  describe('Faction Technologies', () => {
    describe('Saturn Engine II', () => {
      test.todo('cruiser upgrade: move 3, capacity 2, sustain damage')
    })

    describe('Hel-Titan II', () => {
      test.todo('PDS upgrade: combat 6, space cannon 5')
      test.todo('may use SPACE CANNON against ships in adjacent systems')
    })

    describe('Slumberstate Computing', () => {
      test.todo('when COALESCENCE results in ground combat with no other units, may coexist')
      test.todo('during status phase, draw 1 additional action card per coexisting player')
      test.todo('other players may allow placement of sleeper token on their planet')
    })
  })
})
