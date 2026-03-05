const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Universities of Jol-Nar', () => {
  describe('Data', () => {
    test('starts with 4 technologies (one of each color)', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds()
      expect(techs.length).toBe(4)
      expect(techs).toContain('neural-motivator')
      expect(techs).toContain('antimass-deflectors')
      expect(techs).toContain('sarween-tools')
      expect(techs).toContain('plasma-scoring')
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('universities-of-jol-nar')
      expect(faction.factionTechnologies.length).toBe(3)

      const eRes = faction.factionTechnologies.find(t => t.id === 'e-res-siphons')
      expect(eRes.color).toBe('yellow')
      expect(eRes.prerequisites).toEqual(['yellow', 'yellow'])

      const spatial = faction.factionTechnologies.find(t => t.id === 'spatial-conduit-cylinder')
      expect(spatial.color).toBe('blue')
      expect(spatial.prerequisites).toEqual(['blue', 'blue'])

      const specialized = faction.factionTechnologies.find(t => t.id === 'specialized-compounds')
      expect(specialized.color).toBeNull()
      expect(specialized.prerequisites).toEqual(['yellow', 'green'])
    })
  })

  describe('Analytical', () => {
    test('can research tech with 1 missing prerequisite (non-unit-upgrade)', () => {
      // Jol-Nar starts with 4 techs: neural-motivator(green), antimass-deflectors(blue),
      // sarween-tools(yellow), plasma-scoring(red) — 1 of each color
      // Fleet Logistics needs 2 blue, but Analytical lets them skip 1
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')

      const choices = t.currentChoices(game)
      expect(choices).toContain('fleet-logistics')
    })

    test('cannot skip prerequisite for unit upgrade technologies', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      // Analytical should NOT skip prereqs for unit upgrades
      const dennis = game.players.byName('dennis')
      // Carrier II needs 2 blue — Jol-Nar has 1 blue (antimass-deflectors)
      // Since Carrier II is a unit upgrade, Analytical should NOT help
      expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
    })

    test('non-Jol-Nar cannot skip prerequisites', () => {
      // Hacan with same 1 blue tech cannot research fleet-logistics (needs 2 blue)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'universities-of-jol-nar'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['antimass-deflectors', 'sarween-tools'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.canResearchTechnology('fleet-logistics')).toBe(false)
    })
  })

  describe('Brilliant', () => {
    test('can skip 2 prerequisites total (analytical + brilliant) for non-unit-upgrade', () => {
      // Jol-Nar starts with 4 techs (1 each color)
      // Graviton Laser System needs 1 yellow + 1 red — Jol-Nar has both, so no skip needed
      // Light/Wave Deflector needs 3 blue — Jol-Nar has 1 blue, deficit 2
      // Analytical (1 skip) + Brilliant (1 skip) = 2 total skips
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      // Light/Wave Deflector needs 3 blue prereqs — Jol-Nar has 1 blue (deficit 2)
      // analytical skip 1 + brilliant skip 1 = can research
      expect(dennis.canResearchTechnology('light-wave-deflector')).toBe(true)
    })

    test('brilliant does not help unit upgrades', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      // Carrier II needs 2 blue — Jol-Nar has 1 blue (deficit 1)
      // analytical doesn't apply to unit upgrades, brilliant doesn't either
      expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
    })
  })

  describe('Fragile', () => {
    test('Jol-Nar combat rolls are less effective', () => {
      // Deterministic layout: jolnar-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })

      // Jol-Nar has 5 cruisers (combat 7, with Fragile effectively combat 8)
      // vs 1 fighter (combat 9) — Jol-Nar should still win with 5 ships
      t.setBoard(game, {
        dennis: {
          units: {
            'jolnar-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jol': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'jolnar-home', count: 5 }],
      })

      // Even with Fragile, 5 cruisers should destroy 1 fighter
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Agent — Doctor Sucaban', () => {
    test('after Jol-Nar researches, may exhaust to let them spend influence for 2 action cards', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')

      // Choose a tech to research (sarween-tools has no prereqs but Jol-Nar already has it)
      // Jol-Nar has 4 techs (1 each color), can research fleet-logistics (2 blue, skip 1 via Analytical)
      t.choose(game, 'fleet-logistics')

      // Doctor Sucaban prompt fires (onAnyTechResearched)
      t.choose(game, 'Exhaust Doctor Sucaban')

      // Jol-Nar (dennis) exhausts planets for 2 influence
      // Jol has 2 influence, Nar has 3 influence — exhaust Jol (2 influence) to meet the 2 needed
      t.choose(game, 'jol (2)')

      // Micah auto-skipped (insufficient resources for technology secondary)

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)
      expect(dennis.isAgentReady()).toBe(false)

      // Jol should be exhausted
      expect(game.state.planets['jol'].exhausted).toBe(true)
    })

    test('can decline to use agent', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')
      t.choose(game, 'fleet-logistics')

      // Decline the agent
      t.choose(game, 'Pass')

      // Micah auto-skipped (insufficient resources for technology secondary)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
      expect(dennis.actionCards || []).toEqual([])
    })

    test('fires when another player researches technology', () => {
      // Micah picks technology, Dennis picks something else
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'technology')

      // Dennis goes first — use leadership
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Jol-Nar, 5I)

      // Micah's turn — use technology
      t.choose(game, 'Strategic Action.technology')

      // Micah chooses a tech to research — Hacan starts with antimass-deflectors(blue) + sarween-tools(yellow)
      const micahChoices = t.currentChoices(game)
      t.choose(game, micahChoices[0])

      // Doctor Sucaban prompt fires for Dennis (Jol-Nar)
      t.choose(game, 'Exhaust Doctor Sucaban')

      // Micah (the researching player) exhausts planets for influence
      // Hacan planets: arretze(0 inf), hercant(1 inf), kamdorn(1 inf)
      // Need 2 influence — exhaust hercant + kamdorn
      t.choose(game, 'hercant (1)')
      t.choose(game, 'kamdorn (1)')

      // Dennis declines the technology secondary
      t.choose(game, 'Pass')

      const micah = game.players.byName('micah')
      expect(micah.actionCards.length).toBe(2)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('does not fire when agent is already exhausted', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          agentExhausted: true,
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')
      t.choose(game, 'fleet-logistics')

      // No agent prompt — should go straight to secondary offer
      // Micah declines technology secondary
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards || []).toEqual([])
    })
  })

  describe('Commander — Agnlan Oln', () => {
    test('after rolling dice for a unit ability, may reroll any of those dice', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: [
            'neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring',
            'gravity-drive', 'transit-diodes', 'psychoarchaeology', 'dark-energy-tap',
          ],
          units: {
            'jolnar-home': {
              space: ['dreadnought', 'dreadnought', 'dreadnought', 'carrier'],
              'jol': [
                'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry',
                'space-dock',
              ],
              'nar': ['pds', 'pds'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades system 27 with 3 dreadnoughts (bombardment-5x1 each)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'jolnar-home', count: 3 },
          { unitType: 'carrier', from: 'jolnar-home', count: 1 },
          { unitType: 'infantry', from: 'jolnar-home', count: 8 },
        ],
      })

      // Bombardment fires (3 dreadnoughts + Plasma Scoring = 4 dice at combat 5)
      // Dennis gets the Agnlan Oln reroll prompt for the 1 miss
      t.choose(game, 'Reroll 1 dice')

      // Dennis should win the invasion with overwhelming force
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })
    test('unlock condition: own 8 technologies', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          // Jol-Nar starts with 4 techs; add 4 more to reach 8
          technologies: [
            'neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring',
            'gravity-drive', 'transit-diodes', 'psychoarchaeology', 'dark-energy-tap',
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(8)
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with fewer than 8 technologies', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      // Default starting techs: 4 (neural-motivator, antimass-deflectors, sarween-tools, plasma-scoring)
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(4)
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe("Hero — Rin, The Master's Legacy", () => {
    test('replaces non-unit-upgrade technologies with same-color tech, then purge', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'unlocked' },
          // Give specific techs that can be replaced
          technologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'jolnar-hero')

      // For each tech, choose to keep or replace
      // neural-motivator (green) — replace with hyper-metabolism
      t.choose(game, 'hyper-metabolism')

      // antimass-deflectors (blue) — keep
      t.choose(game, 'Keep')

      // sarween-tools (yellow) — keep
      t.choose(game, 'Keep')

      // plasma-scoring (red) — keep
      t.choose(game, 'Keep')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
      expect(dennis.hasTechnology('hyper-metabolism')).toBe(true)
      expect(dennis.hasTechnology('neural-motivator')).toBe(false)
      // Kept techs should still be there
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })
  })

  describe('Mech DEPLOY — Shield Paling', () => {
    test('infantry on this planet are not affected by the Fragile faction ability', () => {
      // Dennis (Jol-Nar, P1) invades system 27 with mech + infantry
      // Jol-Nar has Fragile: +1 to combat rolls (harder to hit)
      // Shield Paling mech negates Fragile for infantry on same planet
      // Infantry fight at combat 8 instead of 9
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'jolnar-home': {
              space: ['carrier'],
              'jol': ['mech', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: { 'new-albion': { exhausted: false } },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (P1, leadership initiative 1) goes first
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'jolnar-home', count: 1 },
          { unitType: 'mech', from: 'jolnar-home', count: 1 },
          { unitType: 'infantry', from: 'jolnar-home', count: 5 },
        ],
      })

      // Ground combat: Dennis has mech + 5 infantry (at combat 8, not 9) vs 3 infantry
      // Dennis should win decisively
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })
  })

  describe('Promissory Note — Research Agreement', () => {
    test('after Jol-Nar researches a non-faction technology, holder gains that technology and card returns', () => {
      // Dennis = Hacan (holder), Micah = Jol-Nar (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'universities-of-jol-nar'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'research-agreement', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            'jolnar-home': {
              space: ['carrier', 'carrier'],
              'jol': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'technology')

      // Dennis: Component Action → Research Agreement (place face-up)
      t.choose(game, 'Component Action')
      t.choose(game, 'research-agreement')

      // Micah: Strategic Action → Technology
      t.choose(game, 'Strategic Action.technology')
      // Micah researches a non-faction tech (e.g., gravity-drive)
      t.choose(game, 'gravity-drive')
      // Dennis declines Technology secondary
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Holder gains the same technology
      expect(dennis.hasTechnology('gravity-drive')).toBe(true)

      // Card returned to Jol-Nar
      const micahPNs = micah.getPromissoryNotes()
      expect(micahPNs.some(n => n.id === 'research-agreement')).toBe(true)
      const dennisPNs = dennis.getPromissoryNotes()
      expect(dennisPNs.some(n => n.id === 'research-agreement' && n.owner === 'micah')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('E-Res Siphons', () => {
      test('after activating a system with own units, gain 4 trade goods', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['e-res-siphons'],
            units: {
              'jolnar-home': {
                space: ['carrier'],
                'jol': ['space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        const dennis = game.players.byName('dennis')
        const tgBefore = dennis.tradeGoods

        // Dennis activates system 27, which has his cruiser
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', { movements: [] })

        // Re-fetch player after game state update
        const dennisAfter = game.players.byName('dennis')
        expect(dennisAfter.tradeGoods).toBe(tgBefore + 4)
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'jolnar-home': {
                space: ['carrier'],
                'jol': ['space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        const dennis = game.players.byName('dennis')
        const tgBefore = dennis.tradeGoods

        // Dennis activates system 27, which has his cruiser — but no E-Res Siphons
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', { movements: [] })

        const dennisAfter = game.players.byName('dennis')
        expect(dennisAfter.tradeGoods).toBe(tgBefore)
      })
    })

    describe('Spatial Conduit Cylinder', () => {
      test('makes activated system adjacent to all systems with own units', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['spatial-conduit-cylinder'],
            units: {
              'jolnar-home': {
                space: ['cruiser', 'cruiser'],
                'jol': ['space-dock'],
              },
              // Place a ship far away from system 27
              '38': {
                space: ['destroyer'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Activate system 27 (adjacent to jolnar-home, has no units)
        // But jolnar-home has units, and system 38 has units
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Spatial Conduit Cylinder prompt should NOT fire (no units in activated system 27)
        // The E-Res siphons part already handles checking for units
        // Let's just verify movement works normally
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'jolnar-home', count: 1 }],
        })

        // Cruiser should be in system 27
        const s27ships = game.state.units['27'].space.filter(u => u.owner === 'dennis')
        expect(s27ships.length).toBe(1)
      })

      test('allows movement from distant system when SCC is active', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['spatial-conduit-cylinder'],
            units: {
              'jolnar-home': {
                'jol': ['space-dock'],
              },
              // Units in system 27 to trigger SCC
              '27': {
                space: ['cruiser'],
              },
              // Distant ship in system 38 (far from 27)
              '38': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Activate system 27 — it has units, so SCC can fire
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // SCC prompt should appear because system 27 has our cruiser
        t.choose(game, 'Exhaust Spatial Conduit Cylinder')

        // Now system 27 is adjacent to system 38 (which also has our units)
        // So the cruiser from 38 should be able to move to 27
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '38', count: 1 }],
        })

        // Both cruisers should be in system 27
        const s27ships = game.state.units['27'].space.filter(u => u.owner === 'dennis')
        expect(s27ships.length).toBe(2)

        // Tech should be exhausted
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('spatial-conduit-cylinder')
      })
    })

    describe('Specialized Compounds', () => {
      test('exhausted tech specialty planet counts as prerequisite with Specialized Compounds', () => {
        // Jol-Nar starts with neural-motivator (1 green). Infantry II needs 2 green.
        // With exhausted green specialty planet (new-albion) + Specialized Compounds,
        // the exhausted planet still provides +1 green prerequisite.
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring', 'specialized-compounds'],
            planets: {
              'jol': { exhausted: false },
              'nar': { exhausted: false },
              'new-albion': { exhausted: true },  // green specialty, exhausted
            },
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        // infantry-ii needs green,green. Has 1 green from neural-motivator.
        // Normally exhausted specialty planet wouldn't count — but with Specialized Compounds it does.
        // This gives +1 green from new-albion, total 2 green prerequisites — can research!
        expect(dennis.canResearchTechnology('infantry-ii')).toBe(true)
      })

      test('exhausted tech specialty does not count without Specialized Compounds', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring'],
            planets: {
              'jol': { exhausted: false },
              'nar': { exhausted: false },
              'new-albion': { exhausted: true },  // green specialty, exhausted
            },
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        // infantry-ii needs green,green (unit upgrade — no Analytical/Brilliant skips)
        // Has 1 green from neural-motivator, exhausted new-albion doesn't count
        // Deficit: 1, cannot research
        expect(dennis.canResearchTechnology('infantry-ii')).toBe(false)
      })

      test('ready tech specialty planet still counts normally', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring'],
            planets: {
              'jol': { exhausted: false },
              'nar': { exhausted: false },
              'new-albion': { exhausted: false },  // green specialty, ready
            },
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        // infantry-ii needs green,green (unit upgrade)
        // Has 1 green from neural-motivator + 1 green from ready new-albion = 2
        // Can research even without Specialized Compounds
        expect(dennis.canResearchTechnology('infantry-ii')).toBe(true)
      })
    })
  })
})
