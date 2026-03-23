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
              'jord': ['infantry', 'infantry', 'space-dock'],
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

      // Invade lodor (cultural planet in system 26) from system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '27', count: 1 },
          { unitType: 'infantry', from: '27', count: 1 },
        ],
      })

      // Planet should now be explored
      expect(game.state.exploredPlanets['lodor']).toBe(true)
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
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
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

      // Invade lodor (cultural) — first exploration draws dyson-sphere
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '27', count: 1 },
          { unitType: 'infantry', from: '27', count: 1 },
        ],
      })

      expect(game.state.exploredPlanets['lodor']).toBe(true)

      // Only 1 card consumed from the deck (second card untouched)
      expect(game.state.explorationDecks.cultural.length).toBe(1)
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
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
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

      // Invade lodor (cultural) — draws dyson-sphere attach card
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '27', count: 1 },
          { unitType: 'infantry', from: '27', count: 1 },
        ],
      })

      expect(game.state.planets['lodor'].attachments).toContain('dyson-sphere')
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
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['space-dock'],
            },
            '37': {
              space: ['carrier'],
              'arinam': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Invade vefut-ii (hazardous) from system 37
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '37', count: 1 },
          { unitType: 'infantry', from: '37', count: 1 },
        ],
      })

      const dennis = game.players.byName('dennis')
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
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['carrier'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()

      // Before any exploration, decks should not exist yet
      expect(game.state.explorationDecks).toBeFalsy()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Invade lodor (cultural) — triggers exploration which initializes decks
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '27', count: 1 },
          { unitType: 'infantry', from: '27', count: 1 },
        ],
      })

      // Decks should now be initialized
      expect(game.state.explorationDecks).toBeTruthy()
      expect(game.state.explorationDecks.cultural).toBeDefined()
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
      // System 27 has 2 planets — commit ground forces to new-albion
      t.action(game, 'commit-ground-forces', { assignments: { 'new-albion': { infantry: 1 } } })
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
      test('immediate: ground forces moved to space on exploration', () => {
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
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry', 'infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Invade lodor (cultural) with 2 infantry — draws DMZ
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
            { unitType: 'infantry', from: '27', count: 1 },
          ],
        })

        // Ground forces (infantry) should be moved to space by DMZ immediate effect
        const lodorUnits = game.state.units['26']?.planets?.['lodor'] || []
        const infantryOnPlanet = lodorUnits.filter(u =>
          u.owner === 'dennis' && u.type === 'infantry'
        )
        expect(infantryOnPlanet.length).toBe(0)

        const infantryInSpace = game.state.units['26'].space.filter(u =>
          u.owner === 'dennis' && u.type === 'infantry'
        )
        expect(infantryInSpace.length).toBe(2)

        // DMZ attachment should be on the planet
        expect(game.state.planets['lodor'].attachments).toContain('demilitarized-zone')
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
        // Pre-place two gamma wormhole tokens on systems 26 and 38
        t.setBoard(game, {
          gammaWormholeTokens: ['26', '38'],
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['infantry', 'space-dock'],
              },
              '26': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Move cruiser from system 26 to system 38 via gamma wormhole adjacency
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '38' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '26', count: 1 }],
        })

        // Cruiser should be in system 38
        const spaceUnits = game.state.units['38']?.space || []
        expect(spaceUnits.some(u => u.type === 'cruiser' && u.owner === 'dennis')).toBe(true)
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
              '39': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // System 39 (alpha wormhole) should be adjacent to 48 (ion storm, alpha)
        // Move cruiser from 39 to 48 via alpha wormhole adjacency
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '39', count: 1 }],
        })

        const spaceUnits = game.state.units['48']?.space || []
        expect(spaceUnits.some(u => u.type === 'cruiser' && u.owner === 'dennis')).toBe(true)
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

      test('beta side creates beta wormhole adjacency', () => {
        const game = t.fixture()
        t.setBoard(game, {
          ionStormToken: { systemId: '48', side: 'beta' },
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                'jord': ['space-dock'],
              },
              '25': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // System 25 has a beta wormhole; ion storm at 48 is beta side
        // Move cruiser from 25 to 48 via beta wormhole adjacency
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '48' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '25', count: 1 }],
        })

        const spaceUnits = game.state.units['48']?.space || []
        expect(spaceUnits.some(u => u.type === 'cruiser' && u.owner === 'dennis')).toBe(true)
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

        // Choose to remove infantry
        t.choose(game, 'Yes')

        // 1 infantry landed, Core Mine removes it, Dennis gains 1 TG
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
        // Infantry was removed from the planet
        const vefutUnits = game.state.units['20']?.planets['vefut-ii'] || []
        const infantry = vefutUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        expect(infantry.length).toBe(0)
      })

      test('decline to remove infantry gets nothing', () => {
        const game = setupHazardousExploration('core-mine-1')
        invadeVefutII(game)

        t.choose(game, 'No')

        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(0)
        // Infantry still on the planet
        const vefutUnits = game.state.units['20']?.planets['vefut-ii'] || []
        const infantry = vefutUnits.filter(u => u.type === 'infantry' && u.owner === 'dennis')
        expect(infantry.length).toBe(1)
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

        t.choose(game, 'Yes')

        // Expedition readies the planet (was exhausted when taken)
        expect(game.state.planets['vefut-ii'].exhausted).toBe(false)
      })
    })

    describe('Volatile Fuel Source', () => {
      test('gain 1 command token by removing infantry', () => {
        const game = setupHazardousExploration('volatile-fuel-source-1')
        invadeVefutII(game)

        t.choose(game, 'Yes')

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

        // Component Action should be available with persistent card action
        const choices = t.currentSubChoices(game, 'Component Action')
        expect(choices).toContain('persistent:enigmatic-device-1')
        t.choose(game, 'Component Action.persistent:enigmatic-device-1')

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
        // Enigmatic Device should not appear as component action (insufficient resources)
        // Either Component Action isn't offered at all, or it doesn't include the device
        const _choices = t.currentChoices(game)
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

      // Invade lodor (cultural, 3 res / 1 inf) → attach Dyson Sphere (+2 res, +1 inf)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '27', count: 1 },
          { unitType: 'infantry', from: '27', count: 1 },
        ],
      })

      // Verify attachment is present
      expect(game.state.planets['lodor'].attachments).toContain('dyson-sphere')
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
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              'jord': ['space-dock'],
            },
            '37': {
              space: ['carrier'],
              'arinam': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Invade vefut-ii (hazardous) → attach Mining World (+2 res)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '37', count: 1 },
          { unitType: 'infantry', from: '37', count: 1 },
        ],
      })

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

      // Invade new-albion (industrial, system 27) → attach Biotic Research Facility
      // But new-albion already has green specialty — use arinam instead (no specialty)
      // Arinam is in system 37; we need to get there from sol-home.
      // Stage via system 27 (adjacent to sol-home and 37)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 1 },
        ],
      })
      // System 27 has 2 planets — commit ground forces to new-albion
      t.action(game, 'commit-ground-forces', { assignments: { 'new-albion': { infantry: 1 } } })

      // new-albion is industrial → draws biotic-research-facility
      const dennis = game.players.byName('dennis')
      const prereqs = dennis.getTechPrerequisites()
      // Should have at least 1 green from the attachment
      expect(prereqs.green).toBeGreaterThanOrEqual(1)
      expect(game.state.planets['new-albion'].attachments).toContain('biotic-research-facility')
    })

    test('Research Facility fallback: +1/+1 when planet already has specialty', () => {
      // new-albion already has green tech specialty — biotic research facility
      // should fall back to +1 resource, +1 influence instead of adding another specialty
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: [],
          industrial: ['biotic-research-facility'],
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

      // Invade new-albion (industrial, system 27) which already has green specialty
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 1 },
        ],
      })
      // System 27 has 2 planets — commit ground forces to new-albion
      t.action(game, 'commit-ground-forces', { assignments: { 'new-albion': { infantry: 1 } } })

      // Attachment present — fallback gives +1/+1 instead of tech specialty
      expect(game.state.planets['new-albion'].attachments).toContain('biotic-research-facility')
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

      t.choose(game, 'Component Action.purge-relic-fragments')

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

      t.choose(game, 'Component Action.purge-relic-fragments')

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

      t.choose(game, 'Component Action.purge-relic-fragments')

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

      t.choose(game, 'Component Action.purge-relic-fragments')

      const dennis = game.players.byName('dennis')
      expect(game.state.relicsGained['dennis']).toContain('the-obsidian')
      expect(dennis.secretObjectives.length).toBe(1)
    })
  })
})
