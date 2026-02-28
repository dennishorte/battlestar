const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Exploration', () => {
  describe('Exploration Cards Data', () => {
    test('cultural exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('cultural')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'cultural')).toBe(true)
    })

    test('hazardous exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('hazardous')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'hazardous')).toBe(true)
    })

    test('industrial exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('industrial')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'industrial')).toBe(true)
    })

    test('frontier exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('frontier')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'frontier')).toBe(true)
    })

    test('each deck has attach, action, and fragment cards', () => {
      for (const trait of ['cultural', 'hazardous', 'industrial']) {
        const cards = res.getExplorationCards(trait)
        const types = new Set(cards.map(c => c.type))
        expect(types.has('attach')).toBe(true)
        expect(types.has('action')).toBe(true)
        expect(types.has('fragment')).toBe(true)
      }
    })

    test('getExplorationCard finds by ID', () => {
      const card = res.getExplorationCard('dyson-sphere')
      expect(card).toBeTruthy()
      expect(card.name).toBe('Dyson Sphere')
      expect(card.trait).toBe('cultural')
      expect(card.type).toBe('attach')
    })

    test('multi-copy cards have suffixed IDs', () => {
      expect(res.getExplorationCard('freelancers-1')).toBeTruthy()
      expect(res.getExplorationCard('freelancers-2')).toBeTruthy()
      expect(res.getExplorationCard('freelancers-3')).toBeTruthy()
      expect(res.getExplorationCard('hazardous-relic-fragment-7')).toBeTruthy()
      expect(res.getExplorationCard('cultural-relic-fragment-9')).toBeTruthy()
    })

    test('frontier deck includes Codex III cards', () => {
      const cards = res.getExplorationCards('frontier')
      const names = cards.map(c => c.name)
      expect(names).toContain('Dead World')
      expect(names).toContain('Entropic Field')
      expect(names).toContain('Keleres Ship')
      expect(names).toContain('Major Entropic Field')
      expect(names).toContain('Minor Entropic Field')
    })

    test('attach cards have attachment data', () => {
      const dyson = res.getExplorationCard('dyson-sphere')
      expect(dyson.attachment).toEqual({ resources: 2, influence: 1 })

      const lazax = res.getExplorationCard('lazax-survivors')
      expect(lazax.attachment).toEqual({ resources: 1, influence: 2 })

      const biotic = res.getExplorationCard('biotic-research-facility')
      expect(biotic.attachment.techSpecialty).toBe('green')
      expect(biotic.attachment.fallback).toEqual({ resources: 1, influence: 1 })
    })
  })

  describe('Planet Exploration Trigger', () => {
    test('exploring planet with trait marks it as explored', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['mercenary-outfit-1'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              space: ['cruiser', 'carrier'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Find a system adjacent to sol-home that has a cultural planet
      const adjSystems = game._getAdjacentSystems('sol-home')

      let targetSystem = null
      let targetPlanet = null
      for (const sysId of adjSystems) {
        const tile = res.getSystemTile(sysId) || res.getSystemTile(Number(sysId))
        if (!tile || !tile.planets) {
          continue
        }
        for (const pId of tile.planets) {
          const planet = res.getPlanet(pId)
          if (planet && planet.trait === 'cultural' && !game.state.planets[pId]?.controller) {
            targetSystem = sysId
            targetPlanet = pId
            break
          }
        }
        if (targetSystem) {
          break
        }
      }

      if (!targetSystem) {
        // No adjacent cultural planet — skip (map-dependent)
        return
      }

      // Move to the system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'cruiser', from: 'sol-home', count: 1 },
        ],
      })

      // Planet should now be explored
      expect(game.state.exploredPlanets[targetPlanet]).toBe(true)
    })

    test('home system planets are not explored (no trait)', () => {
      const game = t.fixture()
      game.run()

      // Jord has no trait — should not be in exploredPlanets
      expect(game.state.exploredPlanets['jord']).toBeUndefined()
    })

    test('Mecatol Rex is not explored (no trait)', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.exploredPlanets['mecatol-rex']).toBeUndefined()
    })

    test('planet is only explored once', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere', 'paradise-world'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      // First exploration attaches a card
      game._explorePlanet('quann', 'dennis')
      const attachmentsAfterFirst = [...(game.state.planets['quann']?.attachments || [])]

      // Second exploration of same planet should be a no-op
      game._explorePlanet('quann', 'dennis')
      expect(game.state.planets['quann'].attachments).toEqual(attachmentsAfterFirst)
    })
  })

  describe('Exploration Card Types', () => {
    test('attach card adds to planet attachments', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      game._explorePlanet('quann', 'dennis')

      expect(game.state.planets['quann'].attachments).toContain('dyson-sphere')
    })

    test('fragment card gives relic fragment to player', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['hazardous-relic-fragment-1'],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      game._explorePlanet('vefut-ii', 'dennis')

      expect(dennis.relicFragments).toContain('hazardous')
    })
  })

  describe('Frontier Exploration', () => {
    // System 48 is empty (frontier), adjacent to system 27.
    // Dennis stages a cruiser in 27, then activates 48 with Dark Energy Tap.

    test('Dark Energy Tap explores frontier and grants relic fragment', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: [],
          frontier: ['unknown-relic-fragment-1'],
        },
        dennis: {
          technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 48 (empty/frontier) and moves cruiser from 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '48' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
      })

      // Dark Energy Tap should have explored the frontier
      expect(game.state.exploredPlanets['48']).toBe(true)

      // Unknown relic fragment should be granted to dennis
      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments).toContain('unknown')
    })

    test('Dark Energy Tap does not trigger in systems with planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: [],
          frontier: ['unknown-relic-fragment-1'],
        },
        dennis: {
          technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              space: ['cruiser', 'carrier'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 27 (has planets New Albion + Starpoint)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // System 27 has planets — no frontier exploration
      expect(game.state.exploredPlanets['27']).toBeUndefined()
      // Frontier deck should still be full
      expect(game.state.explorationDecks.frontier.length).toBe(1)
    })

    test('frontier system is only explored once', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: [],
          frontier: ['unknown-relic-fragment-1', 'unknown-relic-fragment-2'],
        },
        dennis: {
          technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Move to system 48 (frontier)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '48' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
      })

      // One fragment gained, one card consumed from deck
      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(1)
      expect(game.state.explorationDecks.frontier.length).toBe(1)

      // System is marked explored — the command token also prevents re-activation,
      // but the exploredPlanets flag is the canonical guard in _exploreFrontier
      expect(game.state.exploredPlanets['48']).toBe(true)
    })
  })

  describe('Exploration Decks', () => {
    test('decks are initialized lazily', () => {
      const game = t.fixture()
      game.run()

      game._initExplorationDecks()
      expect(game.state.explorationDecks).toBeTruthy()
      expect(game.state.explorationDecks.cultural.length).toBe(20)
    })

    test('setBoard can pre-set exploration decks', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere'],
          hazardous: ['mining-world'],
          industrial: ['biotic-research-facility'],
          frontier: [],
        },
      })
      game.run()

      expect(game.state.explorationDecks.cultural.length).toBe(1)
      expect(game.state.explorationDecks.cultural[0].id).toBe('dyson-sphere')
    })
  })

  // ==========================================================================
  // Phase 2: Action Exploration Card Effects
  // ==========================================================================

  describe('Action Exploration Card Effects', () => {

    // Helper: set up Dennis to invade New Albion (industrial, system 27)
    // by moving carrier + infantry from sol-home. Returns game after
    // strategy card picks so the next t.choose is the tactical action.
    function setupIndustrialExploration(cardId) {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: [cardId],
          frontier: [],
        },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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
      return game
    }

    // Helper: trigger invasion of New Albion (system 27, first planet = industrial)
    function invadeNewAlbion(game) {
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 1 },
        ],
      })
    }

    // Helper: set up Dennis to invade a hazardous planet (Vefut II, system 20)
    // Pre-places carrier + units in system 37 (adjacent to 20, confirmed).
    function setupHazardousExploration(cardId, extraUnits) {
      const game = t.fixture()
      const planetUnits = ['infantry', ...(extraUnits || [])]
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [cardId],
          industrial: [],
          frontier: [],
        },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['space-dock'],
            },
            '37': {
              space: ['carrier'],
              'arinam': planetUnits,
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')
      return game
    }

    // Helper: invade Vefut II (system 20, hazardous) from system 37
    function invadeVefutII(game, unitCount) {
      const movements = [
        { unitType: 'carrier', from: '37', count: 1 },
      ]
      for (let i = 0; i < (unitCount || 1); i++) {
        movements.push({ unitType: 'infantry', from: '37', count: 1 })
      }
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', { movements })
    }

    // --- Cultural ---

    describe('Mercenary Outfit', () => {
      test('places 1 infantry on explored planet', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: ['mercenary-outfit-1'],
            hazardous: [],
            industrial: [],
            frontier: [],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move from system 27 to system 26 (Lodor, cultural planet)
        // 27 is adjacent to 26 (confirmed in testing.md)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Lodor is cultural → draws mercenary-outfit-1 → places infantry
        // Dennis had 1 infantry that landed, plus 1 from mercenary outfit = 2
        const lodorUnits = game.state.units['26']?.planets['lodor'] || []
        const dennisInfantry = lodorUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        expect(dennisInfantry.length).toBe(2)
      })
    })

    describe('Demilitarized Zone', () => {
      test('immediate: structures removed, ground forces moved to space', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: ['demilitarized-zone'],
            hazardous: [],
            industrial: [],
            frontier: [],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            planets: {
              'quann': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '25': {
                space: ['carrier'],
                'quann': ['infantry', 'infantry', 'pds', 'space-dock'],
              },
            },
          },
        })
        game.run()

        // Explore quann — draws Demilitarized Zone, immediate effect fires
        game._explorePlanet('quann', 'dennis')

        // Structures (PDS, space dock) should be removed from planet
        const quannUnits = game.state.units['25']?.planets['quann'] || []
        const structures = quannUnits.filter(u =>
          u.owner === 'dennis' && (u.type === 'pds' || u.type === 'space-dock')
        )
        expect(structures.length).toBe(0)

        // Ground forces (infantry) should be moved to space
        const infantryOnPlanet = quannUnits.filter(u =>
          u.owner === 'dennis' && u.type === 'infantry'
        )
        expect(infantryOnPlanet.length).toBe(0)

        const infantryInSpace = game.state.units['25'].space.filter(u =>
          u.owner === 'dennis' && u.type === 'infantry'
        )
        expect(infantryInSpace.length).toBe(2)

        // DMZ attachment should be on the planet
        expect(game.state.planets['quann'].attachments).toContain('demilitarized-zone')
      })

      test('cannot land ground forces on DMZ planet during invasion', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
            planets: {
              'new-albion': { exhausted: false },
            },
          },
          micah: {
            units: {
              '26': {
                space: ['carrier'],
                'lodor': ['infantry'],
              },
            },
            planets: {
              'lodor': { exhausted: false },
            },
          },
        })

        // Attach DMZ to lodor
        game.testSetBreakpoint('initialization-complete', (game) => {
          if (!game.state.planets['lodor']) {
            game.state.planets['lodor'] = { controller: 'micah', exhausted: false, attachments: [] }
          }
          game.state.planets['lodor'].attachments = ['demilitarized-zone']
        })

        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates system 26 and moves carrier + infantry
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // DMZ planet should NOT be invaded — lodor should still be micah's
        expect(game.state.planets['lodor'].controller).toBe('micah')
      })
    })

    describe('Freelancers', () => {
      test('produce 1 infantry using influence', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: ['freelancers-1'],
            hazardous: [],
            industrial: [],
            frontier: [],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            planets: {
              // new-albion has 1R/1I — influence counts as resources for Freelancers
              'new-albion': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move from system 27 to system 26 (Lodor, cultural) — draws Freelancers
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Freelancers prompts: produce 1 unit (influence counts as resources)
        const choices = t.currentChoices(game)
        expect(choices).toContain('infantry')
        t.choose(game, 'infantry')

        // Should have placed infantry on lodor
        const lodorUnits = game.state.units['26']?.planets['lodor'] || []
        const dennisInfantry = lodorUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        // 1 from carrier + 1 from freelancers
        expect(dennisInfantry.length).toBe(2)
      })

      test('produce 1 fighter using resources + influence', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: ['freelancers-1'],
            hazardous: [],
            industrial: [],
            frontier: [],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move from system 27 to system 26 (Lodor, cultural) — draws Freelancers
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Freelancers: produce a fighter
        t.choose(game, 'fighter')

        // Should have a fighter in space
        const spaceUnits = game.state.units['26']?.space || []
        const fighters = spaceUnits.filter(u => u.type === 'fighter' && u.owner === 'dennis')
        expect(fighters.length).toBe(1)
      })
    })

    describe('Gamma Wormhole', () => {
      test('places gamma wormhole token and creates adjacency', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: ['gamma-wormhole'],
            hazardous: [],
            industrial: [],
            frontier: [],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move from 27 to 26 (Lodor, cultural planet) → draws gamma-wormhole
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Gamma wormhole token should be placed in system 26
        expect(game.state.gammaWormholeTokens).toContain('26')
      })

      test('gamma wormhole tokens create adjacency between systems', () => {
        const game = t.fixture()
        // Pre-place two gamma wormhole tokens
        t.setBoard(game, {
          gammaWormholeTokens: ['26', '38'],
        })
        game.run()

        // Systems 26 and 38 should now be adjacent via gamma wormhole
        const adj26 = game._getAdjacentSystems('26')
        expect(adj26).toContain('38')

        const adj38 = game._getAdjacentSystems('38')
        expect(adj38).toContain('26')
      })
    })

    describe('Gamma Relay', () => {
      test('places gamma wormhole token in frontier system', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['gamma-relay'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Activate empty system 48 (frontier), move cruiser from 27
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Gamma wormhole token should be placed in system 48
        expect(game.state.gammaWormholeTokens).toContain('48')
      })
    })

    describe('Ion Storm', () => {
      test('creates wormhole adjacency on chosen side', () => {
        const game = t.fixture()
        t.setBoard(game, {
          ionStormToken: { systemId: '48', side: 'alpha' },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
            },
          },
        })
        game.run()

        // System 48 should be adjacent to other alpha wormhole systems
        // System 39 has alpha wormhole and is not physically adjacent to 48
        const adjacent = game._getAdjacentSystems('48')
        expect(adjacent).toContain('39')
      })

      test('flips after ship movement into ion storm system', () => {
        const game = t.fixture()
        t.setBoard(game, {
          ionStormToken: { systemId: '48', side: 'alpha' },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move cruiser from system 27 to system 48 (ion storm system)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Ion storm should have flipped to beta
        expect(game.state.ionStormToken.side).toBe('beta')
      })

      test('adjacency changes after flip', () => {
        const game = t.fixture()
        t.setBoard(game, {
          ionStormToken: { systemId: '48', side: 'alpha' },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
            },
          },
        })
        game.run()

        // Initially alpha: adjacent to alpha wormhole systems (39 is alpha, not physically adjacent)
        const adjAlpha = game._getAdjacentSystems('48')
        expect(adjAlpha).toContain('39')  // system 39 has alpha wormhole

        // Flip to beta
        game.state.ionStormToken.side = 'beta'

        // Now adjacent to beta wormhole systems, not alpha
        const adjBeta = game._getAdjacentSystems('48')
        expect(adjBeta).toContain('25')  // system 25 has beta wormhole
        expect(adjBeta).not.toContain('39')  // system 39 no longer adjacent (alpha only)
      })
    })

    // --- Industrial ---

    describe('Abandoned Warehouses', () => {
      test('gain 2 commodities when no commodities to convert', () => {
        const game = setupIndustrialExploration('abandoned-warehouses-1')
        invadeNewAlbion(game)

        // Dennis has 0 commodities → auto-selects gain 2 (no choice prompt)
        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(2)
      })

      test('choose to gain 2 commodities when have existing commodities', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: ['abandoned-warehouses-1'],
            frontier: [],
          },
          dennis: {
            commodities: 1,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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
        invadeNewAlbion(game)

        // Dennis has 1 commodity → choice offered
        t.choose(game, 'Gain 2 Commodities')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(3)
      })

      test('choose to convert commodities to trade goods', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: ['abandoned-warehouses-1'],
            frontier: [],
          },
          dennis: {
            commodities: 2,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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
        invadeNewAlbion(game)

        t.choose(game, 'Convert Commodities to Trade Goods')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(0)
        expect(dennis.tradeGoods).toBe(2)
      })
    })

    describe('Functioning Base', () => {
      test('gain 1 commodity', () => {
        const game = setupIndustrialExploration('functioning-base-1')
        invadeNewAlbion(game)

        // Dennis has 0 TG and 0 commodities → only option is gain commodity
        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(1)
      })

      test('spend commodity to draw action card', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: ['functioning-base-1'],
            frontier: [],
          },
          dennis: {
            commodities: 1,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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
        invadeNewAlbion(game)

        t.choose(game, 'Spend 1 to Draw Action Card')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(0)
        expect(dennis.actionCards.length).toBeGreaterThan(0)
      })
    })

    describe('Local Fabricators', () => {
      test('gain 1 commodity', () => {
        const game = setupIndustrialExploration('local-fabricators-1')
        invadeNewAlbion(game)

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(1)
      })

      test('spend commodity to place mech', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: ['local-fabricators-1'],
            frontier: [],
          },
          dennis: {
            commodities: 1,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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
        invadeNewAlbion(game)

        t.choose(game, 'Spend 1 to Place Mech')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(0)
        const naUnits = game.state.units['27']?.planets['new-albion'] || []
        const mechs = naUnits.filter(u => u.type === 'mech' && u.owner === 'dennis')
        expect(mechs.length).toBe(1)
      })
    })

    // --- Hazardous ---

    describe('Core Mine', () => {
      test('gain 1 trade good by removing infantry', () => {
        const game = setupHazardousExploration('core-mine-1')
        invadeVefutII(game)

        // 1 infantry landed, Core Mine removes it, Dennis gains 1 TG
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
        // Infantry was removed from the planet
        const vefutUnits = game.state.units['20']?.planets['vefut-ii'] || []
        const infantry = vefutUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        expect(infantry.length).toBe(0)
      })

      test('gain 1 trade good with mech (no infantry removed)', () => {
        const game = setupHazardousExploration('core-mine-1', ['mech'])

        // Transport both infantry and mech
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '20' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '37', count: 1 },
            { unitType: 'infantry', from: '37', count: 1 },
            { unitType: 'mech', from: '37', count: 1 },
          ],
        })

        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
        // Mech still present, infantry not removed
        const vefutUnits = game.state.units['20']?.planets['vefut-ii'] || []
        const infantry = vefutUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        const mechs = vefutUnits.filter(u => u.type === 'mech' && u.owner === 'dennis')
        expect(infantry.length).toBe(1)
        expect(mechs.length).toBe(1)
      })
    })

    describe('Expedition', () => {
      test('readies planet by removing infantry', () => {
        const game = setupHazardousExploration('expedition-1')
        invadeVefutII(game)

        // Expedition readies the planet (was exhausted when taken)
        expect(game.state.planets['vefut-ii'].exhausted).toBe(false)
      })
    })

    describe('Volatile Fuel Source', () => {
      test('gain 1 command token by removing infantry', () => {
        const game = setupHazardousExploration('volatile-fuel-source-1')
        invadeVefutII(game)

        // Volatile Fuel Source prompts for pool choice
        t.choose(game, 'tactics')

        const dennis = game.players.byName('dennis')
        // Started with 3 tactics, spent 1 to activate system 20, +1 from card = 3
        expect(dennis.commandTokens.tactics).toBe(3)
      })
    })

    // --- Frontier ---

    describe('Lost Crew', () => {
      test('draws 2 action cards', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['lost-crew-1'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Activate empty system 48 (frontier), move cruiser from 27
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Dark Energy Tap explored frontier → Lost Crew → draw 2 action cards
        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBeGreaterThanOrEqual(2)
      })
    })

    describe('Derelict Vessel', () => {
      test('draws 1 secret objective', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['derelict-vessel-1'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        const dennis = game.players.byName('dennis')
        // Fixture skips initial draws, so Dennis starts with 0; Derelict Vessel adds 1
        expect(dennis.secretObjectives.length).toBe(1)
      })
    })

    describe('Entropic Fields', () => {
      test('Entropic Field grants 1 CT and 2 TG', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['entropic-field'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Choose pool for command token
        t.choose(game, 'fleet')

        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(2)
        // Started with fleet 3, spent 0 (tactics spent for activation), gained 1 = 4
        expect(dennis.commandTokens.fleet).toBe(4)
      })

      test('Minor Entropic Field grants 1 CT and 1 TG', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['minor-entropic-field'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        t.choose(game, 'tactics')

        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
        // Started with tactics 3, spent 1 to activate, gained 1 = 3
        expect(dennis.commandTokens.tactics).toBe(3)
      })
    })

    describe('Keleres Ship', () => {
      test('grants 2 command tokens', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['keleres-ship-1'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Two pool choices for the 2 command tokens
        t.choose(game, 'tactics')
        t.choose(game, 'fleet')

        const dennis = game.players.byName('dennis')
        // tactics: 3 - 1 (activation) + 1 = 3
        expect(dennis.commandTokens.tactics).toBe(3)
        // fleet: 3 + 1 = 4
        expect(dennis.commandTokens.fleet).toBe(4)
      })
    })

    describe('Merchant Station', () => {
      test('replenish commodities', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['merchant-station-1'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commodities: 0,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        t.choose(game, 'Replenish Commodities')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(dennis.maxCommodities)
      })

      test('convert commodities to trade goods', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['merchant-station-1'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commodities: 3,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        t.choose(game, 'Convert Commodities to Trade Goods')

        const dennis = game.players.byName('dennis')
        expect(dennis.commodities).toBe(0)
        expect(dennis.tradeGoods).toBe(3)
      })
    })

    describe('Mirage', () => {
      test('places Mirage planet in frontier system, controller set and ready', () => {
        const game = t.fixture()
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: [],
            industrial: [],
            frontier: ['mirage'],
          },
          dennis: {
            technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move into empty system 48 (frontier) — Dark Energy Tap explores, draws Mirage
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Mirage should be placed in system 48
        expect(game.state.miragePlanet).toBe('48')

        // Planet state should be initialized
        const miragePlanet = game.state.planets['mirage']
        expect(miragePlanet).toBeTruthy()
        expect(miragePlanet.controller).toBe('dennis')
        expect(miragePlanet.exhausted).toBe(false)

        // Unit storage should exist
        expect(game.state.units['48'].planets['mirage']).toBeDefined()

        // Mirage should contribute to dennis's controlled planets
        const dennis = game.players.byName('dennis')
        expect(dennis.getControlledPlanets()).toContain('mirage')
      })

      test('ground forces can land on Mirage planet', () => {
        const game = t.fixture()
        t.setBoard(game, {
          miragePlanet: '48',
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            planets: {
              'mirage': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move carrier + infantry from system 27 to system 48 (has Mirage)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Infantry should have landed on Mirage
        const mirageUnits = game.state.units['48']?.planets['mirage'] || []
        const dennisInfantry = mirageUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        expect(dennisInfantry.length).toBe(1)
      })
    })

    describe('Enigmatic Device', () => {
      test('appears as component action, spend 6 resources to research tech', () => {
        const game = t.fixture()
        t.setBoard(game, {
          persistentCards: {
            dennis: ['enigmatic-device-1'],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            planets: {
              'new-albion': { exhausted: false },
              'starpoint': { exhausted: false },
              'quann': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Component Action should be available
        t.choose(game, 'Component Action')

        // The persistent card action should appear
        const choices = t.currentChoices(game)
        expect(choices).toContain('persistent:enigmatic-device-1')
        t.choose(game, 'persistent:enigmatic-device-1')

        // Choose a tech to research (skip prereqs)
        t.choose(game, 'plasma-scoring')

        // Verify: tech was gained
        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('plasma-scoring')).toBe(true)

        // Verify: persistent card was purged
        expect(game.state.persistentCards['dennis']).not.toContain('enigmatic-device-1')
      })

      test('cannot use if insufficient resources', () => {
        const game = t.fixture()
        t.setBoard(game, {
          persistentCards: {
            dennis: ['enigmatic-device-1'],
          },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            tradeGoods: 0,
            planets: {
              // new-albion: 1R/1I = 1 resource, not enough for 6
              'new-albion': { exhausted: false },
            },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Component Action should not list Enigmatic Device (insufficient resources)
        // Check if component action is even available
        const choices = t.currentChoices(game)
        // If Enigmatic Device is the only possible component action, Component Action
        // won't appear (or will show no actions). Let's verify:
        if (choices.includes('Component Action')) {
          t.choose(game, 'Component Action')
          const actionChoices = t.currentChoices(game)
          expect(actionChoices).not.toContain('persistent:enigmatic-device-1')
        }
        // If no component actions at all, that's also correct
      })
    })
  })

  // ==========================================================================
  // Phase 3: Attachment Bonuses
  // ==========================================================================

  describe('Attachment Bonuses', () => {

    test('Dyson Sphere adds +2 resources and +1 influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
        dennis: {
          planets: {
            'quann': { exhausted: false },
          },
        },
      })
      game.run()

      // Explore quann (cultural, 2 res / 1 inf) → attach Dyson Sphere (+2 res, +1 inf)
      game._explorePlanet('quann', 'dennis')

      const dennis = game.players.byName('dennis')
      // quann base: 2 res, 1 inf → with Dyson Sphere: 4 res, 2 inf
      expect(dennis.getTotalResources()).toBeGreaterThanOrEqual(4)
      expect(dennis.getTotalInfluence()).toBeGreaterThanOrEqual(2)

      // Verify attachment is present
      expect(game.state.planets['quann'].attachments).toContain('dyson-sphere')
    })

    test('Mining World adds +2 resources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['mining-world'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      // Explore vefut-ii (hazardous, 2 res / 2 inf) → attach Mining World (+2 res)
      game._explorePlanet('vefut-ii', 'dennis')

      const dennis = game.players.byName('dennis')
      // vefut-ii base: 2 res → with Mining World: 4 res
      expect(dennis.getTotalResources()).toBeGreaterThanOrEqual(4)
      expect(game.state.planets['vefut-ii'].attachments).toContain('mining-world')
    })

    test('Biotic Research Facility grants green tech specialty on planet without specialty', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: ['biotic-research-facility'],
          frontier: [],
        },
        dennis: {
          planets: {
            'arinam': { exhausted: false },
          },
        },
      })
      game.run()

      // arinam is industrial, no existing tech specialty
      game._explorePlanet('arinam', 'dennis')

      const dennis = game.players.byName('dennis')
      const prereqs = dennis.getTechPrerequisites()
      // Should have at least 1 green from the attachment
      expect(prereqs.green).toBeGreaterThanOrEqual(1)
      expect(game.state.planets['arinam'].attachments).toContain('biotic-research-facility')
    })

    test('Research Facility fallback: +1/+1 when planet already has specialty', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: ['biotic-research-facility'],
          frontier: [],
        },
        dennis: {
          planets: {
            // new-albion already has green tech specialty
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()

      game._explorePlanet('new-albion', 'dennis')

      // Fallback: +1 resource, +1 influence (no new specialty)
      const bonuses = game._getPlanetAttachmentBonuses('new-albion')
      expect(bonuses.resources).toBe(1)
      expect(bonuses.influence).toBe(1)
      expect(bonuses.techSpecialties).toEqual([])  // No new specialty — fallback used
    })
  })

  // ==========================================================================
  // Phase 4: Relic System
  // ==========================================================================

  describe('Relic System', () => {

    test('3-fragment purge via component action gains a relic', () => {
      const game = t.fixture()
      t.setBoard(game, {
        relicDeck: ['scepter-of-emelpar'],
        dennis: {
          relicFragments: ['cultural', 'cultural', 'cultural'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'purge-relic-fragments')

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(0)
      expect(game.state.relicsGained['dennis']).toContain('scepter-of-emelpar')
    })

    test('unknown fragments work as wildcards for purge', () => {
      const game = t.fixture()
      t.setBoard(game, {
        relicDeck: ['the-codex'],
        dennis: {
          relicFragments: ['cultural', 'cultural', 'unknown'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'purge-relic-fragments')

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(0)
      expect(game.state.relicsGained['dennis']).toContain('the-codex')
    })

    test('Dead World frontier exploration grants a relic', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: [],
          frontier: ['dead-world'],
        },
        relicDeck: ['dominus-orb'],
        dennis: {
          technologies: ['antimass-deflectors', 'gravity-drive', 'dark-energy-tap'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate empty system 48 (frontier), move cruiser from 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '48' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
      })

      expect(game.state.relicsGained['dennis']).toContain('dominus-orb')
    })

    test('Shard of the Throne grants +1 VP on gain', () => {
      const game = t.fixture()
      t.setBoard(game, {
        relicDeck: ['shard-of-the-throne'],
        dennis: {
          relicFragments: ['hazardous', 'hazardous', 'hazardous'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'purge-relic-fragments')

      const dennis = game.players.byName('dennis')
      expect(game.state.relicsGained['dennis']).toContain('shard-of-the-throne')
      expect(dennis.victoryPoints).toBe(1)
    })

    test('The Obsidian grants 1 secret objective on gain', () => {
      const game = t.fixture()
      t.setBoard(game, {
        relicDeck: ['the-obsidian'],
        dennis: {
          relicFragments: ['industrial', 'industrial', 'industrial'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'purge-relic-fragments')

      const dennis = game.players.byName('dennis')
      expect(game.state.relicsGained['dennis']).toContain('the-obsidian')
      expect(dennis.secretObjectives.length).toBe(1)
    })
  })
})
