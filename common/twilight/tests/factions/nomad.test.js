const t = require('../../testutil.js')


describe('Nomad', () => {
  test('gains TG when voted-for outcome wins', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()

    // Test the helper directly
    const nomad = game.players.byName('dennis')
    const startTG = nomad.tradeGoods
    const playerVotes = { dennis: { outcome: 'For', count: 3 } }
    game.factionAbilities._nomadFutureSight('For', playerVotes)

    expect(nomad.tradeGoods).toBe(startTG + 1)
  })

  describe('The Company', () => {
    test('Nomad starts with 3 agents', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agents).toBeDefined()
      expect(dennis.leaders.agents.length).toBe(3)
      expect(dennis.leaders.agents.map(a => a.id)).toEqual(['artuno', 'thundarian', 'mercer'])
      expect(dennis.leaders.agents.every(a => a.status === 'ready')).toBe(true)
      // Should not have the single-agent field
      expect(dennis.leaders.agent).toBeUndefined()
    })

    test('each agent is independently exhaustible', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')

      // Exhaust artuno specifically
      dennis.exhaustAgent('artuno')
      expect(dennis.isAgentReady('artuno')).toBe(false)
      expect(dennis.isAgentReady('thundarian')).toBe(true)
      expect(dennis.isAgentReady('mercer')).toBe(true)

      // isAgentReady() with no args: true if any agent is ready
      expect(dennis.isAgentReady()).toBe(true)

      // Exhaust all
      dennis.exhaustAgent('thundarian')
      dennis.exhaustAgent('mercer')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('all agents readied in status phase', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: {
            agents: [
              { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
              { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
              { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
            ],
            commander: 'locked',
            hero: 'locked',
          },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses leadership (strategic action)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')              // micah declines leadership secondary

      // Micah uses diplomacy (strategic action)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'sol-home')           // micah picks system to protect
      t.choose(game, 'Pass')              // dennis declines diplomacy secondary

      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute tokens
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // After status phase, all agents should be ready (re-fetch player after state change)
      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agents.every(a => a.status === 'ready')).toBe(true)
    })

    test('Artuno: exhaust after commodity replenishment to gain 1 TG', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      // Pick trade for dennis, imperial for micah
      t.choose(game, 'trade')
      t.choose(game, 'imperial')

      // Dennis goes first (trade=5), uses strategic action
      t.choose(game, 'Strategic Action')
      // Trade primary replenishes all commodities — Artuno fires
      t.choose(game, 'Exhaust Artuno')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(4)  // 3 from trade + 1 from Artuno
      expect(dennis.isAgentReady('artuno')).toBe(false)
    })

    test('Thundarian: exhaust after winning space combat to place cruiser', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          units: {
            27: { space: ['cruiser', 'cruiser'] },
          },
        },
        micah: {
          units: {
            26: { space: ['fighter'] },
          },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate system 26 (adjacent to 27)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Move cruisers from 27 to 26
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '27', count: 2 }],
      })

      // Space combat auto-resolves (2 cruisers vs 1 fighter)
      // After combat, Thundarian prompt fires
      t.choose(game, 'Exhaust Thundarian')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady('thundarian')).toBe(false)

      // Should have 3 cruisers in system 26 (2 moved + 1 from Thundarian)
      const system26Units = game.state.units['26'].space.filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(system26Units.length).toBe(3)
    })

    test('Mercer: exhaust at start of ground combat to remove enemy ground force', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'nomad-home': {
              space: ['carrier'],
              arcturus: ['infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
        micah: {
          units: {
            27: { 'new-albion': ['infantry', 'infantry'] },
          },
          planets: { 'new-albion': { exhausted: false } },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate system 27 (adjacent to nomad-home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Move carrier + infantry from nomad-home to system 27
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'nomad-home', count: 1 },
          { unitType: 'infantry', from: 'nomad-home', count: 4 },
        ],
      })

      // Mercer prompt fires at ground combat start on new-albion
      t.choose(game, 'Exhaust Mercer')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady('mercer')).toBe(false)

      // Dennis should control new-albion after combat (4 infantry vs 1 after Mercer removed 1)
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Micah should have no infantry left (Mercer removed 1, combat killed the rest)
      const micahGround = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'micah')
      expect(micahGround.length).toBe(0)
    })
  })
})
