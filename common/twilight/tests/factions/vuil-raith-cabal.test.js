const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe("Vuil'raith Cabal", () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['self-assembly-routines']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('vuil-raith-cabal')
      expect(faction.factionTechnologies.length).toBe(3)

      const vortex = faction.factionTechnologies.find(t => t.id === 'vortex')
      expect(vortex.color).toBe('red')
      expect(vortex.prerequisites).toEqual(['red'])
      expect(vortex.unitUpgrade).toBeNull()

      const dt2 = faction.factionTechnologies.find(t => t.id === 'dimensional-tear-ii')
      expect(dt2.color).toBe('unit-upgrade')
      expect(dt2.prerequisites).toEqual(['yellow', 'yellow'])
      expect(dt2.unitUpgrade).toBe('space-dock')

      const alraith = faction.factionTechnologies.find(t => t.id === 'alraith-ix-ianovar')
      expect(alraith.color).toBeNull()
      expect(alraith.prerequisites).toEqual(['red', 'green'])
      expect(alraith.unitUpgrade).toBeNull()
    })
  })

  describe('Devour', () => {
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

    test('does not capture own units', () => {
      // Directly invoke the handler to verify own-unit filtering
      const handler = require('../../systems/factions/vuil-raith-cabal.js')
      const mockCtx = {
        game: { res: require('../../res/index.js') },
        state: { capturedUnits: {} },
        log: { add: jest.fn() },
      }
      const player = { name: 'dennis' }
      const ownUnit = { type: 'fighter', owner: 'dennis' }
      handler.onUnitDestroyed(player, mockCtx, { systemId: '27', unit: ownUnit })
      expect(mockCtx.state.capturedUnits['dennis'] || []).toEqual([])
    })

    test('does not capture structures', () => {
      const handler = require('../../systems/factions/vuil-raith-cabal.js')
      const mockCtx = {
        game: { res: require('../../res/index.js') },
        state: { capturedUnits: {} },
        log: { add: jest.fn() },
      }
      const player = { name: 'dennis' }
      const structureUnit = { type: 'space-dock', owner: 'micah' }
      handler.onUnitDestroyed(player, mockCtx, { systemId: '27', unit: structureUnit })
      expect(mockCtx.state.capturedUnits['dennis'] || []).toEqual([])
    })
  })

  describe('Amalgamation', () => {
    test('returns captured unit to place own unit', () => {
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

      // Dennis uses Component Action > Amalgamation
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
  })

  describe('Riftmeld', () => {
    test('returns captured unit to research upgrade', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        capturedUnits: {
          dennis: [{ type: 'fighter', originalOwner: 'micah' }],
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action > Riftmeld
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

  describe('Agent — The Stillness of Stars', () => {
    test('after another player replenishes commodities, convert their commodities to trade goods and capture 1 unit from reinforcements', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
        micah: {
          commodities: 0,
        },
      })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis uses Trade primary → everyone replenishes commodities
      t.choose(game, 'Strategic Action')

      // Agent fires for Micah's commodity replenish
      t.choose(game, 'Exhaust Stillness of Stars')
      // Choose unit type to capture from Micah's reinforcements
      t.choose(game, 'infantry')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(0)  // Converted to TG
      expect(micah.tradeGoods).toBeGreaterThanOrEqual(6)  // Hacan has 6 commodities

      // Dennis captured 1 infantry from Micah
      expect(game.state.capturedUnits['dennis']).toEqual(
        expect.arrayContaining([{ type: 'infantry', originalOwner: 'micah' }])
      )
    })
  })

  describe('Commander — That Which Molds Flesh', () => {
    test('when producing fighters, up to 2 do not count against PRODUCTION limit', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 10,
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'cabal-home': {
              space: ['carrier'],
              'acheron': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action > activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'cabal-home' })
      t.choose(game, 'Done')  // skip movement

      // Acheron: 4 resources + 2 productionValue = 6 PRODUCTION capacity
      // Commander: up to 2 fighters don't count against limit
      // So we can produce 8 fighters (6 counting + 2 free)
      // Fighters cost 1 per 2 (costFor: 2), so 8 fighters = 4 resources
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 8 }],
      })

      const fighters = game.state.units['cabal-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(8)
    })

    test('locked commander does not grant production limit bonus', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 10,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'cabal-home': {
              space: ['carrier'],
              'acheron': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action > activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'cabal-home' })
      t.choose(game, 'Done')  // skip movement

      // Without commander: PRODUCTION capacity = 6, so max 6 fighters
      // Request 8 but only 6 should be produced
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 8 }],
      })

      const fighters = game.state.units['cabal-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(6)
    })

    test('unlock condition: have units in 3 Gravity Rifts', () => {
      // Cabal Dimensional Tear space docks create gravity rifts in their system
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'cabal-home': {
              space: ['carrier', 'fighter', 'fighter'],
              'acheron': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
            '35': {
              'bereg': ['infantry', 'space-dock'],
            },
          },
          planets: {
            'acheron': { exhausted: false },
            'new-albion': { exhausted: false },
            'bereg': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // 3 systems with Cabal space docks (dimensional tears) = 3 gravity rifts
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with fewer than 3 gravity rift systems', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'cabal-home': {
              space: ['carrier', 'fighter', 'fighter'],
              'acheron': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
          },
          planets: {
            'acheron': { exhausted: false },
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Only 2 systems with dimensional tears — not enough
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe('Hero — It Feeds on Carrion', () => {
    test('Dimensional Anchor: rolls for non-fighter ships in/adjacent to dimensional tears, captures on 1-3, then purges', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'cabal-home': {
              space: ['carrier'],
              'acheron': ['space-dock'],
            },
          },
        },
        micah: {
          // Place non-fighter ships in system 27, which is adjacent to cabal-home
          // (cabal-home is at position {q:0, r:-3}, system 27 is at {q:0, r:-2})
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const capturedBefore = (game.state.capturedUnits['dennis'] || []).length

      // Dennis uses Component Action > Dimensional Anchor (hero)
      t.choose(game, 'Component Action')
      t.choose(game, 'dimensional-anchor')

      // Hero rolls for each non-fighter ship (3 ships), captures on 1-3
      // Results depend on RNG seed, but we can verify the mechanics

      const dennis = game.players.byName('dennis')

      // Hero should be purged regardless of roll results
      expect(dennis.isHeroPurged()).toBe(true)

      // Some ships may have been captured (depends on deterministic seed)
      const capturedAfter = game.state.capturedUnits['dennis'] || []
      // Total captured should be >= what we had before (at least 0 new captures is valid)
      expect(capturedAfter.length).toBeGreaterThanOrEqual(capturedBefore)

      // Remaining micah ships in system 27 + captured should equal original 3
      const remainingShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah').length
      const newCaptures = capturedAfter.length - capturedBefore
      expect(remainingShips + newCaptures).toBe(3)
    })
  })

  describe('Mech — Reanimator', () => {
    test('captures enemy infantry destroyed on planet with mech', () => {
      // Dennis (Vuil'raith) defends abyz in system 38 (adjacent to hacan-home)
      // with a mech + infantry. Micah invades. When Micah's infantry die,
      // Reanimator captures them.
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          planets: {
            'abyz': { exhausted: false },
          },
          units: {
            'cabal-home': {
              'acheron': ['space-dock'],
            },
            '38': {
              'abyz': ['mech', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Micah: tactical action to invade abyz in system 38
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '38' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'hacan-home', count: 1 },
          { unitType: 'infantry', from: 'hacan-home', count: 2 },
        ],
      })

      // Ground combat: Vuil'raith overwhelms with mech + 8 infantry vs 2 infantry
      // When Micah's infantry are destroyed, Reanimator mech captures them
      const captured = game.state.capturedUnits['dennis'] || []
      const capturedFromMicah = captured.filter(c => c.originalOwner === 'micah')

      // Should have captured infantry (Devour captures all destroyed units,
      // Reanimator additionally captures infantry on the mech's planet)
      expect(capturedFromMicah.length).toBeGreaterThan(0)
    })
  })

  describe('Promissory Note — Crucible', () => {
    test.todo('ships do not roll for gravity rifts during movement and get +1 move through gravity rifts')
    test.todo('returns to Vuil\'raith player after use')
  })

  describe('Faction Technologies', () => {
    describe('Vortex', () => {
      test('exhaust to capture a unit type from an adjacent system', () => {
        const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['self-assembly-routines', 'vortex'],
            units: {
              'cabal-home': {
                space: ['carrier'],
                'acheron': ['space-dock'],
              },
            },
          },
          micah: {
            // Place ships in system 27 (adjacent to cabal-home)
            units: {
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        const capturedBefore = (game.state.capturedUnits['dennis'] || []).length

        // Dennis uses Component Action > Vortex
        t.choose(game, 'Component Action')
        t.choose(game, 'vortex')

        // Only one unique target (cruiser from micah), so choice is auto-selected.
        // Assertions run after auto-selection completes.

        // Should have captured 1 cruiser from reinforcements
        const captured = game.state.capturedUnits['dennis'] || []
        expect(captured.length).toBe(capturedBefore + 1)
        expect(captured[captured.length - 1]).toEqual({
          type: 'cruiser',
          originalOwner: 'micah',
        })

        // Vortex tech should be exhausted
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('vortex')
      })

      test('is not available when exhausted', () => {
        const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['self-assembly-routines', 'vortex'],
            units: {
              'cabal-home': {
                space: ['carrier'],
                'acheron': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })

        // Pre-exhaust vortex
        game.testSetBreakpoint('initialization-complete', (game) => {
          const dennis = game.players.byName('dennis')
          if (!dennis.exhaustedTechs) {
            dennis.exhaustedTechs = []
          }
          dennis.exhaustedTechs.push('vortex')
        })

        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Verify that vortex is NOT in the available component actions
        const dennis = game.players.byName('dennis')
        const actions = game.factionAbilities.getAvailableComponentActions(dennis)
        expect(actions.map(a => a.id)).not.toContain('vortex')
      })
    })

    describe('Dimensional Tear II', () => {
      test('provides getFighterCapacityExemption of 12 when researched', () => {
        const handler = require('../../systems/factions/vuil-raith-cabal.js')

        // Without tech
        const playerWithout = {
          hasTechnology: (id) => id !== 'dimensional-tear-ii',
        }
        expect(handler.getFighterCapacityExemption(playerWithout, {})).toBe(6)

        // With tech
        const playerWith = {
          hasTechnology: (id) => id === 'dimensional-tear-ii' || id === 'self-assembly-routines',
        }
        expect(handler.getFighterCapacityExemption(playerWith, {})).toBe(12)
      })
    })

    describe("Al'Raith Ix Ianovar", () => {
      test.todo('causes The Fracture to enter play and move ingress tokens into gravity rift systems')
      test.todo('+1 Move for ships starting in The Fracture')
    })
  })
})
