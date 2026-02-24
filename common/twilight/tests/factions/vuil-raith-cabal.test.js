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

  describe('Agent — The Stillness of Stars', () => {
    test.todo('after another player replenishes commodities, convert their commodities to trade goods and capture 1 unit from reinforcements')
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

      // Dennis: tactical action → activate home system and produce
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

      // Dennis: tactical action → activate home system and produce
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

    test.todo('unlock condition: have units in 3 Gravity Rifts')
  })

  describe('Hero — It Feeds on Carrion', () => {
    test.todo('Dimensional Anchor: each other player rolls for non-fighter ships in or adjacent to dimensional tears, capture on 1-3')
    test.todo('hero is purged after use')
  })

  describe('Mech — Reanimator', () => {
    test.todo('DEPLOY: when infantry on this planet are destroyed, place them on faction sheet as captured')
  })

  describe('Promissory Note — Crucible', () => {
    test.todo('ships do not roll for gravity rifts during movement and get +1 move through gravity rifts')
    test.todo('returns to Vuil\'raith player after use')
  })

  describe('Faction Technologies', () => {
    describe('Vortex', () => {
      test.todo('exhaust to capture a unit type from an adjacent player\'s reinforcements')
    })

    describe('Dimensional Tear II', () => {
      test.todo('space dock upgrade with Production 7 and up to 12 fighters do not count against capacity')
    })

    describe("Al'Raith Ix Ianovar", () => {
      test.todo('causes The Fracture to enter play and move ingress tokens into gravity rift systems')
      test.todo('+1 Move for ships starting in The Fracture')
    })
  })
})
