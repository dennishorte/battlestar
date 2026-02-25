const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Embers of Muaat', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['plasma-scoring']))
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction techs are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('embers-of-muaat')
      expect(faction.factionTechnologies.length).toBe(3)

      const magmus = faction.factionTechnologies.find(t => t.id === 'magmus-reactor')
      expect(magmus.color).toBe('red')
      expect(magmus.prerequisites).toEqual(['red', 'red'])
      expect(magmus.unitUpgrade).toBeNull()

      const warSun = faction.factionTechnologies.find(t => t.id === 'prototype-war-sun-ii')
      expect(warSun.color).toBe('unit-upgrade')
      expect(warSun.prerequisites).toEqual(['red', 'red', 'red', 'yellow'])
      expect(warSun.unitUpgrade).toBe('war-sun')

      const stellar = faction.factionTechnologies.find(t => t.id === 'stellar-genesis')
      expect(stellar.color).toBeNull()
      expect(stellar.prerequisites).toEqual(['red', 'yellow'])
      expect(stellar.unitUpgrade).toBeNull()
    })
  })

  describe('Star Forge', () => {
    test('spends strategy token to place fighters in war sun system', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action > Star Forge
      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')

      // Choose 2 Fighters
      t.choose(game, '2 Fighters')

      // War sun is in muaat-home, auto-selects system
      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      // Started with war-sun + 2 fighters, now + 2 fighters = war-sun + 4 fighters
      expect(spaceUnits).toEqual(['fighter', 'fighter', 'fighter', 'fighter', 'war-sun'])

      // Should have spent 1 strategy token
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('can place 1 destroyer instead of fighters', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')
      t.choose(game, '1 Destroyer')

      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['destroyer', 'fighter', 'fighter', 'war-sun'])
    })
  })

  describe('Gashlai Physiology', () => {
    test('ships can move through supernova systems', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()

      // Test the canMoveThroughSupernovae method directly
      expect(game.factionAbilities.canMoveThroughSupernovae('dennis')).toBe(true)
      expect(game.factionAbilities.canMoveThroughSupernovae('micah')).toBe(false)
    })
  })

  describe('Agent — Umbat', () => {
    test('exhaust to let a player produce up to 2 units in a war sun system', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'muaat-home': {
              space: ['war-sun', 'fighter', 'fighter'],
              'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'umbat-agent')

      // Choose self as target
      t.choose(game, 'dennis')

      // System auto-selects (only muaat-home has war sun)
      // Produce 2 fighters
      t.choose(game, 'fighter')
      t.choose(game, 'fighter')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      const fighters = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      // Started with 2, produced 2 more
      expect(fighters.length).toBe(4)
    })
  })

  describe('Commander — Magmus', () => {
    test('gains 1 trade good after spending strategy token on secondary', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Micah (Hacan) has diplomacy(2), goes first due to lower number
      // Wait — leadership is 1, diplomacy is 2. Dennis picked leadership, micah picked diplomacy.
      // Leadership(1) is lower, so dennis goes first.

      // Dennis uses leadership (primary: gain 3 command tokens)
      t.choose(game, 'Strategic Action')
      // Micah is prompted for leadership secondary
      t.choose(game, 'Use Secondary')

      // Micah spent 1 strategy token. But we care about Dennis (Muaat).
      // Micah goes next: micah uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')  // micah: diplomacy primary, protect hacan-home
      // Dennis is prompted for diplomacy secondary
      t.choose(game, 'Use Secondary')

      // Dennis spent 1 strategy token for the secondary → commander triggers → +1 TG
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
      // Started with 2 strategy, spent 1 for secondary = 1
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('does not gain trade good when commander is locked', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          // Remove the war sun so commander does not auto-unlock
          units: {
            'muaat-home': {
              space: ['fighter', 'fighter'],
              'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership (primary)
      t.choose(game, 'Strategic Action')
      // Micah uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Micah uses diplomacy (primary)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      // Dennis uses diplomacy secondary (spends strategy token)
      t.choose(game, 'Use Secondary')

      // Commander is locked — no TG gain
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
      expect(dennis.commandTokens.strategy).toBe(1)
    })
  })

  describe("Hero — Adjudicator Ba'al", () => {
    test('NOVA SEED: destroy all other units in system and replace tile with Muaat supernova, hero is purged', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          technologies: ['sarween-tools'],
          units: {
            '27': {
              space: ['war-sun'],
              'new-albion': ['infantry', 'infantry'],
            },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['cruiser', 'fighter'],
              'new-albion': ['infantry', 'pds'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'nova-seed')

      // System 27 is auto-selected (only war sun system)
      // Verify opponent units destroyed
      const spaceUnits = game.state.units['27'].space
      expect(spaceUnits.filter(u => u.owner === 'micah').length).toBe(0)

      const planetUnits = game.state.units['27'].planets['new-albion']
      expect(planetUnits.filter(u => u.owner === 'micah').length).toBe(0)

      // Muaat units should survive
      expect(spaceUnits.filter(u => u.owner === 'dennis').length).toBe(1) // war sun
      expect(planetUnits.filter(u => u.owner === 'dennis').length).toBe(2) // 2 infantry

      // System should be marked as supernova
      expect(game.state.systems['27'].muaatSupernova).toBe(true)

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })
  })

  describe('Mech — Ember Colossus', () => {
    test('DEPLOY: when Star Forge is used, place 1 infantry with each mech in the system', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'muaat-home': {
              space: ['war-sun', 'fighter', 'fighter'],
              'muaat': ['mech', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Count infantry before Star Forge
      const infantryBefore = (game.state.units['muaat-home'].planets?.['muaat'] || [])
        .filter(u => u.owner === 'dennis' && u.type === 'infantry').length

      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')
      t.choose(game, '2 Fighters')

      // Ember Colossus DEPLOY should trigger: 1 mech on muaat => 1 infantry placed
      const infantryAfter = (game.state.units['muaat-home'].planets?.['muaat'] || [])
        .filter(u => u.owner === 'dennis' && u.type === 'infantry').length
      expect(infantryAfter).toBe(infantryBefore + 1)

      // Verify log
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('Ember Colossus'))).toBe(true)
    })

    test('DEPLOY: does not trigger if no mechs in system or adjacent', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'muaat-home': {
              space: ['war-sun', 'fighter', 'fighter'],
              'muaat': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const infantryBefore = (game.state.units['muaat-home'].planets?.['muaat'] || [])
        .filter(u => u.owner === 'dennis' && u.type === 'infantry').length

      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')
      t.choose(game, '2 Fighters')

      // No mech => no Ember Colossus DEPLOY
      const infantryAfter = (game.state.units['muaat-home'].planets?.['muaat'] || [])
        .filter(u => u.owner === 'dennis' && u.type === 'infantry').length
      expect(infantryAfter).toBe(infantryBefore)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('Ember Colossus'))).toBe(false)
    })
  })

  describe('Promissory Note — Fires of the Gashlai', () => {
    test('remove 1 Muaat fleet token and holder gains war sun unit upgrade technology', () => {
      // Dennis = Hacan (holder), Micah = Muaat (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'embers-of-muaat'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'fires-of-the-gashlai', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, fleet: 3, strategy: 2 },
          units: {
            'muaat-home': {
              space: ['war-sun'],
              'muaat': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action → Fires of the Gashlai
      t.choose(game, 'Component Action')
      t.choose(game, 'fires-of-the-gashlai')
      // No transaction window (no TG/commodities to trade)

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Muaat loses 1 fleet token
      expect(micah.commandTokens.fleet).toBe(2)

      // Holder gains War Sun unit upgrade
      expect(dennis.hasTechnology('war-sun')).toBe(true)
    })

    test('returns to Muaat player after use', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'embers-of-muaat'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'fires-of-the-gashlai', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, fleet: 3, strategy: 2 },
          units: {
            'muaat-home': {
              space: ['war-sun'],
              'muaat': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action → Fires of the Gashlai
      t.choose(game, 'Component Action')
      t.choose(game, 'fires-of-the-gashlai')

      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')

      // PN returned to Muaat
      const micahPNs = micah.getPromissoryNotes()
      expect(micahPNs.some(n => n.id === 'fires-of-the-gashlai')).toBe(true)
      const dennisPNs = dennis.getPromissoryNotes()
      expect(dennisPNs.some(n => n.id === 'fires-of-the-gashlai' && n.owner === 'micah')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('Magmus Reactor', () => {
      test('enables canMoveIntoSupernovae when player has the tech', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'magmus-reactor'],
          },
        })
        game.run()

        expect(game.factionAbilities.canMoveIntoSupernovae('dennis')).toBe(true)
        expect(game.factionAbilities.canMoveIntoSupernovae('micah')).toBe(false)
      })

      test('does not enable canMoveIntoSupernovae without the tech', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring'],
          },
        })
        game.run()

        // Muaat base ability: canMoveThroughSupernovae is true
        expect(game.factionAbilities.canMoveThroughSupernovae('dennis')).toBe(true)
        // But canMoveIntoSupernovae needs the tech
        expect(game.factionAbilities.canMoveIntoSupernovae('dennis')).toBe(false)
      })

      test('gains 1 trade good after producing in system with war sun', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'magmus-reactor'],
            tradeGoods: 0,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'muaat-home': {
                space: ['war-sun'],
                'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates muaat-home for production (tactical action)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'muaat-home' })
        t.choose(game, 'Done')  // skip movement
        t.action(game, 'produce-units', { units: [{ type: 'fighter', count: 1 }] })

        // Magmus Reactor should have triggered: +1 TG for producing in system with war sun
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
      })

      test('does not gain trade good if no war sun and not adjacent to supernova', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'magmus-reactor'],
            tradeGoods: 0,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'muaat-home': {
                space: ['fighter', 'fighter'],
                'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates muaat-home — no war sun in system, not adjacent to supernova
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'muaat-home' })
        t.choose(game, 'Done')  // skip movement
        t.action(game, 'produce-units', { units: [{ type: 'fighter', count: 1 }] })

        // No TG gain
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(0)
      })
    })

    describe('Prototype War Sun II', () => {
      test('war sun gets move 3 and cost 10 with the upgrade', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'prototype-war-sun-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'war-sun')
        expect(stats.move).toBe(3)
        expect(stats.cost).toBe(10)
        expect(stats.combat).toBe(3)
        expect(stats.capacity).toBe(6)
      })

      test('war sun has base stats without the upgrade', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring'],
          },
        })
        game.run()

        // Muaat's base war sun override: Prototype War Sun I
        const stats = game._getUnitStats('dennis', 'war-sun')
        expect(stats.move).toBe(1)
        expect(stats.cost).toBe(12)
        expect(stats.combat).toBe(3)
      })
    })

    test('Stellar Genesis: place Avernus token when researched', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['plasma-scoring', 'sarween-tools'],
          units: {
            'muaat-home': {
              space: ['war-sun'],
              'muaat': ['space-dock', 'infantry'],
            },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis uses Technology primary: research Stellar Genesis
      t.choose(game, 'Strategic Action')
      t.choose(game, 'stellar-genesis')

      // Choose system to place Avernus
      const choices = t.currentChoices(game)
      const targetSystem = choices[0]
      t.choose(game, targetSystem)

      // Verify Avernus token placed
      expect(game.state.avernus).toBeTruthy()
      expect(game.state.avernus.owner).toBe('dennis')
      expect(game.state.planets['avernus']).toBeTruthy()
      expect(game.state.planets['avernus'].controller).toBe('dennis')
      expect(game.state.planets['avernus'].exhausted).toBe(false)
    })
  })
})
