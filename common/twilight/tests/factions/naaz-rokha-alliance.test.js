const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naaz-Rokha Alliance', () => {
  describe('Data', () => {
    test('starting technologies are Psychoarchaeology and AI Development Algorithm', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds().sort()
      expect(techs).toEqual(['ai-development-algorithm', 'psychoarchaeology'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('naaz-rokha-alliance')
      expect(faction.factionTechnologies.length).toBe(3)

      const supercharge = faction.factionTechnologies.find(t => t.id === 'supercharge')
      expect(supercharge.name).toBe('Supercharge')
      expect(supercharge.color).toBe('red')
      expect(supercharge.prerequisites).toEqual(['red'])
      expect(supercharge.unitUpgrade).toBeNull()

      const prefab = faction.factionTechnologies.find(t => t.id === 'pre-fab-arcologies')
      expect(prefab.name).toBe('Pre-Fab Arcologies')
      expect(prefab.color).toBe('green')
      expect(prefab.prerequisites).toEqual(['green', 'green', 'green'])
      expect(prefab.unitUpgrade).toBeNull()

      const synergy = faction.factionTechnologies.find(t => t.id === 'absolute-synergy')
      expect(synergy.name).toBe('Absolute Synergy')
      expect(synergy.color).toBeNull()
      expect(synergy.prerequisites).toEqual(['green', 'blue'])
      expect(synergy.unitUpgrade).toBeNull()
    })
  })

  describe('Distant Suns', () => {
    test('getExplorationBonus returns 1 when mech is present on the planet', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            '20': {
              'vefut-ii': ['mech', 'infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const bonus = game.factionAbilities.getExplorationBonus(dennis, 'vefut-ii')
      expect(bonus).toBe(1)
    })

    test('getExplorationBonus returns 0 without a mech', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            '20': {
              'vefut-ii': ['infantry', 'infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const bonus = game.factionAbilities.getExplorationBonus(dennis, 'vefut-ii')
      expect(bonus).toBe(0)
    })

    test('exploring with mech draws extra card (single card deck auto-resolves)', () => {
      // With only 1 card in the deck, the mech bonus tries to draw a second but
      // the deck is empty. The single card auto-resolves without a choice prompt.
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          units: {
            '20': {
              'vefut-ii': ['mech', 'infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      // Explore directly. Mech bonus = 1, but only 1 card in deck so only 1 drawn.
      game._explorePlanet('vefut-ii', 'dennis')
      expect(game.state.exploredPlanets['vefut-ii']).toBe(true)

      // Expedition gives 2 trade goods
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(2)

      // Deck should be empty (1 card consumed)
      expect(game.state.explorationDecks.hazardous.length).toBe(0)
    })

    test('exploring without mech draws only 1 card', () => {
      // Deck: ['expedition', 'mining-world']. pop() returns mining-world first.
      // No mech = bonus 0, so only 1 card drawn = mining-world (attach).
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition', 'mining-world'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          units: {
            '20': {
              'vefut-ii': ['infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      game._explorePlanet('vefut-ii', 'dennis')
      expect(game.state.exploredPlanets['vefut-ii']).toBe(true)

      // Mining World is an attach card (no trade goods)
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)

      // 1 card consumed, 1 remaining
      expect(game.state.explorationDecks.hazardous.length).toBe(1)

      // Mining World should be attached to the planet
      expect(game.state.planets['vefut-ii'].attachments).toContain('mining-world')
    })
  })

  describe('Fabrication', () => {
    test('purges 1 fragment for command token', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { relicFragments: ['cultural', 'hazardous'] },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action -> Fabrication
      t.choose(game, 'Component Action')
      t.choose(game, 'fabrication')

      // "Purge 1 fragment for command token" auto-responds (only option since no pair)
      // Then choose which fragment type to purge
      t.choose(game, 'cultural')

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(1)
      expect(dennis.relicFragments[0]).toBe('hazardous')
      // Gained 1 command token (started with 3)
      expect(dennis.commandTokens.tactics).toBe(4)
    })

    test('purges 2 fragments of same type for a relic', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { relicFragments: ['cultural', 'cultural', 'hazardous'] },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action -> Fabrication
      t.choose(game, 'Component Action')
      t.choose(game, 'fabrication')

      // Has a pair of cultural fragments, so "Purge 2 fragments for relic" is available
      t.choose(game, 'Purge 2 fragments for relic')
      // Only 1 pair type (cultural), so no fragment type choice needed

      const dennis = game.players.byName('dennis')
      // 2 cultural purged, 1 hazardous remains
      expect(dennis.relicFragments).toEqual(['hazardous'])
    })

    test('offers choice when both options are available', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { relicFragments: ['hazardous', 'hazardous'] },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'fabrication')

      // Both options available since there is a pair
      const choices = t.currentChoices(game)
      expect(choices).toContain('Purge 2 fragments for relic')
      expect(choices).toContain('Purge 1 fragment for command token')

      // Choose command token instead of relic
      t.choose(game, 'Purge 1 fragment for command token')
      // Only 1 fragment type (hazardous), auto-selects

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments).toEqual(['hazardous'])
      expect(dennis.commandTokens.tactics).toBe(4)
    })

    test('not available with zero fragments', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { relicFragments: [] },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Component Action should not list Fabrication when no fragments
      t.choose(game, 'Component Action')
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('fabrication')
    })
  })

  describe('Agent — Garv and Gunn', () => {
    test('exhaust at end of tactical action to let activating player explore a planet', () => {
      // Dennis (Naaz-Rokha) uses his strategy card first. Then Micah (Hacan)
      // activates system 20 with vefut-ii (hazardous, unexplored, controlled by micah).
      // At end of tactical action, Garv and Gunn lets Micah explore vefut-ii.
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['infantry', 'infantry', 'space-dock'],
            },
            '20': {
              'vefut-ii': ['infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Leadership (strategic action) so he can pass later
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass') // micah declines leadership secondary

      // Micah activates system 20 (no space dock there, so no production prompt)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', { movements: [] })

      // At end of tactical action, Garv and Gunn prompt fires
      t.choose(game, 'Exhaust Garv and Gunn')

      // vefut-ii is the only explorable planet, auto-selected
      expect(game.state.exploredPlanets['vefut-ii']).toBe(true)

      // Agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      // Expedition gives 2 trade goods to the activating player (Micah)
      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(2)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['infantry', 'infantry', 'space-dock'],
            },
            '20': {
              'vefut-ii': ['infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses strategy card first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass') // micah declines

      // Micah activates system 20
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', { movements: [] })

      // No Garv and Gunn prompt — agent is exhausted.
      // Game proceeds past tactical action end. Planet should NOT be explored.
      expect(game.state.exploredPlanets['vefut-ii']).toBeUndefined()
    })

    test('can be used on own tactical action', () => {
      // Dennis (Naaz-Rokha) activates system 20 where they control vefut-ii.
      // No space dock in system 20, so production is skipped.
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
            '20': {
              'vefut-ii': ['infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 20 (tactical action)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', { movements: [] })

      // Agent prompt at end of tactical action (no production since no space dock)
      t.choose(game, 'Exhaust Garv and Gunn')

      expect(game.state.exploredPlanets['vefut-ii']).toBe(true)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
      // Expedition gives 2 trade goods
      expect(dennis.tradeGoods).toBe(2)
    })

    test('no prompt when active system has no explorable planets', () => {
      // Dennis activates system 20, but vefut-ii is already explored
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        exploredPlanets: { 'vefut-ii': true },
        dennis: {
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
            '20': {
              'vefut-ii': ['infantry'],
            },
          },
          planets: {
            'vefut-ii': { exhausted: false },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', { movements: [] })

      // No agent prompt — planet already explored.
      // Game proceeds past the tactical action.
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })
  })

  describe('Commander — Dart and Tai', () => {
    test('explores planet after gaining control from another player', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'naazrokha-home': {
              space: ['carrier'],
              'naazir': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              'starpoint': ['infantry'],
            },
          },
          planets: {
            'starpoint': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades system 27 (adjacent to home) with carrier + infantry
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'naazrokha-home', count: 1 },
          { unitType: 'infantry', from: 'naazrokha-home', count: 4 },
        ],
      })

      // Commander prompt: explore starpoint after taking from micah
      t.choose(game, 'Explore')

      expect(game.state.exploredPlanets['starpoint']).toBe(true)
      // Expedition gives 2 trade goods
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(2)
    })

    test('locked commander does not trigger exploration', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'naazrokha-home': {
              space: ['carrier'],
              'naazir': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              'starpoint': ['infantry'],
            },
          },
          planets: {
            'starpoint': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades system 27 (adjacent to home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'naazrokha-home', count: 1 },
          { unitType: 'infantry', from: 'naazrokha-home', count: 4 },
        ],
      })

      // No commander prompt — commander is locked
      // Planet is not explored (was previously controlled by another player)
      expect(game.state.exploredPlanets['starpoint']).toBeUndefined()
    })
  })

  describe('Hero — Hesh and Prit', () => {
    test('Perfect Synthesis: gain 1 relic and perform secondary of up to 2 readied strategy cards', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action -> Perfect Synthesis
      t.choose(game, 'Component Action')
      t.choose(game, 'perfect-synthesis')

      // Hero gains 1 relic automatically
      expect(game.state.relicsGained?.dennis?.length).toBe(1)

      // Choose first secondary: leadership (gain 1 command token)
      t.choose(game, 'leadership')

      // Choose Done (only use 1 secondary)
      t.choose(game, 'Done')

      // Verify: hero is purged, relic gained, command token gained
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
      // Leadership secondary gives +1 tactics token (started with 3, used 1 for activation = 2, +1 from secondary = 3...
      // Actually no activation yet; started with 3, +1 from leadership secondary = 4
      expect(dennis.commandTokens.tactics).toBe(4)
    })

    test('purge hero after use', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action -> Perfect Synthesis
      t.choose(game, 'Component Action')
      t.choose(game, 'perfect-synthesis')

      // Skip secondaries
      t.choose(game, 'Done')

      // Verify: hero is purged even if no secondaries chosen
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
      expect(game.state.relicsGained?.dennis?.length).toBe(1)
    })

    test('can perform 2 strategy card secondaries', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'naazrokha-home': {
              space: ['carrier', 'destroyer'],
              'naazir': ['infantry', 'infantry', 'space-dock'],
              'rokha': ['infantry'],
            },
          },
          planets: {
            'naazir': { exhausted: true },
            'rokha': { exhausted: true },
          },
        },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action -> Perfect Synthesis
      t.choose(game, 'Component Action')
      t.choose(game, 'perfect-synthesis')

      // Choose first secondary: leadership
      t.choose(game, 'leadership')

      // Choose second secondary: diplomacy (readies 2 planets)
      t.choose(game, 'diplomacy')

      // Verify: both secondaries executed
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
      expect(dennis.commandTokens.tactics).toBe(4) // +1 from leadership secondary
    })
  })

  describe('Mech — Eidolon', () => {
    test.todo('DEPLOY: mech has sustain damage')
    test.todo('flips to Z-Grav Eidolon at start of space combat if in space area')
    test.todo('Z-Grav Eidolon counts as a ship while in space area')
    test.todo('flips back at end of space battle')
  })

  describe('Promissory Note — Black Market Forgery', () => {
    test.todo('holder can purge 2 relic fragments of same type to gain 1 relic')
    test.todo('returns to Naaz-Rokha player after use')
  })

  describe('Faction Technologies', () => {
    describe('Supercharge', () => {
      test('exhaust at start of combat round to apply +1 to all combat rolls this round', () => {
        const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['psychoarchaeology', 'ai-development-algorithm', 'supercharge'],
            units: {
              'naazrokha-home': {
                space: ['carrier'],
                'naazir': ['infantry', 'space-dock'],
              },
              27: { space: ['cruiser', 'cruiser'] },
            },
          },
          micah: {
            units: {
              26: { space: ['cruiser', 'cruiser'] },
            },
          },
        })
        game.run()

        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: tactical action → activate system 26 (adjacent to 27)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 2 }],
        })

        // Space combat start-of-round: Supercharge prompt fires
        t.choose(game, 'Exhaust Supercharge')

        const dennis = game.players.byName('dennis')
        // Tech should be exhausted
        expect(dennis.exhaustedTechs).toContain('supercharge')
      })

      test('combat modifier returns -1 when supercharge is active', () => {
        const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['psychoarchaeology', 'ai-development-algorithm', 'supercharge'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')

        // Without supercharge active, modifier is 0
        expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)

        // Simulate supercharge active state
        game.state._superchargeActive = { dennis: true }
        expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-1)

        // Clean up
        delete game.state._superchargeActive
        expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
      })

      test('cannot use if tech is already exhausted', () => {
        const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['psychoarchaeology', 'ai-development-algorithm', 'supercharge'],
            units: {
              'naazrokha-home': {
                space: ['carrier'],
                'naazir': ['infantry', 'space-dock'],
              },
              27: { space: ['cruiser', 'cruiser'] },
            },
          },
          micah: {
            units: {
              26: { space: ['cruiser'] },
            },
          },
        })
        game.run()

        // Pre-exhaust the tech
        const dennis = game.players.byName('dennis')
        game._exhaustTech(dennis, 'supercharge')

        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: tactical action → activate system 26
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 2 }],
        })

        // No Supercharge prompt — tech is already exhausted
        // Combat resolves without supercharge bonus
        expect(game.state._superchargeActive?.dennis).toBeFalsy()
      })
    })

    describe('Pre-Fab Arcologies', () => {
      test('after exploring a planet, ready that planet', () => {
        const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: ['expedition'],
            industrial: [],
            frontier: [],
          },
          dennis: {
            technologies: ['psychoarchaeology', 'ai-development-algorithm', 'pre-fab-arcologies'],
            units: {
              20: {
                'vefut-ii': ['infantry'],
              },
            },
            planets: {
              'vefut-ii': { exhausted: true },
            },
          },
        })
        game.run()

        // Planet starts exhausted
        expect(game.state.planets['vefut-ii'].exhausted).toBe(true)

        // Explore the planet
        game._explorePlanet('vefut-ii', 'dennis')

        // Planet should be readied by Pre-Fab Arcologies
        expect(game.state.planets['vefut-ii'].exhausted).toBe(false)

        // Expedition gives 2 trade goods
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(2)
      })

      test('does not ready planet without the tech', () => {
        const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
        t.setBoard(game, {
          explorationDecks: {
            cultural: [],
            hazardous: ['expedition'],
            industrial: [],
            frontier: [],
          },
          dennis: {
            units: {
              20: {
                'vefut-ii': ['infantry'],
              },
            },
            planets: {
              'vefut-ii': { exhausted: true },
            },
          },
        })
        game.run()

        game._explorePlanet('vefut-ii', 'dennis')

        // Without Pre-Fab Arcologies, planet stays exhausted
        expect(game.state.planets['vefut-ii'].exhausted).toBe(true)
      })
    })

    describe('Absolute Synergy', () => {
      test.todo('when 4 mechs in same system, may return 3 to flip this card onto mech card')
    })
  })
})
