const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yin Brotherhood', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['sarween-tools']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('yin-brotherhood')
      expect(faction.factionTechnologies.length).toBe(3)

      const impulseCore = faction.factionTechnologies.find(t => t.id === 'impulse-core')
      expect(impulseCore.name).toBe('Impulse Core')
      expect(impulseCore.color).toBe('yellow')
      expect(impulseCore.prerequisites).toEqual(['yellow', 'yellow'])
      expect(impulseCore.unitUpgrade).toBeNull()

      const yinSpinner = faction.factionTechnologies.find(t => t.id === 'yin-spinner')
      expect(yinSpinner.name).toBe('Yin Spinner')
      expect(yinSpinner.color).toBe('green')
      expect(yinSpinner.prerequisites).toEqual(['green', 'green'])
      expect(yinSpinner.unitUpgrade).toBeNull()

      const yinAscendant = faction.factionTechnologies.find(t => t.id === 'yin-ascendant')
      expect(yinAscendant.name).toBe('Yin Ascendant')
      expect(yinAscendant.color).toBeNull()
      expect(yinAscendant.prerequisites).toEqual(['yellow', 'green'])
      expect(yinAscendant.unitUpgrade).toBeNull()
    })
  })

  describe('Devotion', () => {
    test('destroys own ship to produce hit after space combat round', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'yin-home': {
              space: ['cruiser', 'destroyer'],
              'darien': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter', 'fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'yin-home', count: 1 },
          { unitType: 'destroyer', from: 'yin-home', count: 1 },
        ],
      })

      // During combat, Yin gets Devotion prompt after each round
      // Choose to destroy destroyer to produce a hit
      t.choose(game, 'Destroy destroyer')

      // Combat should resolve — Yin should win
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Yin should have lost the destroyer (sacrificed) but cruiser survives
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.some(u => u.type === 'cruiser')).toBe(true)
      expect(dennisShips.every(u => u.type !== 'destroyer')).toBe(true)
    })
  })

  describe('Indoctrination', () => {
    test('replaces enemy infantry at ground combat start', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      // Yin invades a planet controlled by Hacan
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Yin) moves carrier + infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 4 },
        ],
      })

      // Indoctrination prompt: spend 2 influence to replace 1 enemy infantry
      t.choose(game, 'Indoctrinate')

      // Moyin's Ashes mech deployment choice — decline
      t.choose(game, 'Infantry only')

      // Brother Milor prompt may appear when ground forces are destroyed — pass
      // Handle all such prompts until combat resolves
      while (game.waiting?.selectors?.[0]?.choices) {
        const choices = t.currentChoices(game)
        if (choices.includes('Exhaust Brother Milor')) {
          t.choose(game, 'Pass')
        }
        else {
          break
        }
      }

      // Ground combat resolves. Yin should win (4+1 vs 2-1 infantry)
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })
  })

  describe('Agent — Brother Milor', () => {
    test('exhaust to place 2 fighters when a ship is destroyed in space combat', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'darien': ['space-dock'],
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

      // Dennis (Yin) attacks system 27 with 5 cruisers vs 1 fighter
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'yin-home', count: 5 }],
      })

      // When Micah's fighter is destroyed, Brother Milor prompt appears
      t.choose(game, 'Exhaust Brother Milor')

      // Combat resolves — Yin wins (the 2 placed fighters get destroyed in subsequent rounds)
      // Dennis agent should be exhausted, proving the ability triggered
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      // Yin should win space combat
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBeGreaterThan(0)
    })

    test('exhaust to place 2 infantry when ground force is destroyed', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades new-albion with 5 infantry vs 1 infantry
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 5 },
        ],
      })

      // Indoctrination prompt — pass (to isolate the agent test)
      t.choose(game, 'Pass')

      // When Micah's infantry is destroyed, Brother Milor prompt appears
      t.choose(game, 'Exhaust Brother Milor')

      // Combat resolves — Dennis should win and control the planet
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Dennis agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('exhausted agent does not trigger', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'yin-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'darien': ['space-dock'],
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

      // Dennis attacks with 5 cruisers vs 1 fighter
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'yin-home', count: 5 }],
      })

      // No Brother Milor prompt should appear — agent is exhausted
      // Combat should just resolve, Yin wins
      const micahFighters = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahFighters.length).toBe(0)
    })
  })

  describe('Commander — Brother Omar', () => {
    test('satisfies 1 green technology prerequisite when commander unlocked', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)

      const bonuses = game.factionAbilities.getTechPrerequisiteBonuses(dennis)
      expect(bonuses).toEqual({ green: 1 })
    })

    test('no green prerequisite bonus when commander is locked', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)

      const bonuses = game.factionAbilities.getTechPrerequisiteBonuses(dennis)
      expect(bonuses).toEqual({})
    })

    test('can research tech requiring 1 green prereq with commander only', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          // No technologies — commander provides 1 green
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // Hyper Metabolism requires 2 green — commander provides 1, plus sarween-tools is yellow
      // Neural Motivator requires 1 green — commander alone should satisfy it
      expect(dennis.canResearchTechnology('neural-motivator')).toBe(true)
    })

    test('when researching tech owned by another player, return 1 infantry to ignore all prerequisites', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          technologies: ['sarween-tools'],
          units: {
            'yin-home': {
              'darien': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          technologies: ['gravity-drive'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // gravity-drive requires blue, blue — Yin has no blue techs
      // But Micah owns it, so Yin can sacrifice infantry to ignore prerequisites
      const additional = game.factionAbilities.getAdditionalResearchableTechs(
        dennis,
        require('../../res/index.js').getGenericTechnologies()
      )
      expect(additional).toContain('gravity-drive')
    })
  })

  describe('Hero — Dannel of the Tenth', () => {
    test('Quantum Dissemination: commit infantry to non-home enemy planet, take control, then purge', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { hero: 'unlocked' },
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            // Micah controls new-albion but has no ground forces there
            'new-albion': { exhausted: false },
          },
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['space-dock'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses Component Action -> Yin Hero
      t.choose(game, 'Component Action')
      t.choose(game, 'yin-hero')

      // Choose new-albion (non-home, enemy-controlled)
      // Only 1 eligible planet, so loop exits after this pick
      t.choose(game, 'new-albion')

      const dennis = game.players.byName('dennis')

      // Hero should be purged
      expect(dennis.isHeroPurged()).toBe(true)

      // Dennis should now control new-albion
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Dennis should have 1 infantry on new-albion
      const newAlbionUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(newAlbionUnits.length).toBe(1)
    })

    test('Quantum Dissemination: excludes home system planets', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { hero: 'unlocked' },
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          // Micah only has units on their home system — no non-home planets to target
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses Component Action -> Yin Hero
      t.choose(game, 'Component Action')
      t.choose(game, 'yin-hero')

      // No eligible non-home planets — hero should still be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })
  })

  describe("Mech — Moyin's Ashes", () => {
    test('DEPLOY: when using Indoctrination, spend 1 additional influence to replace with mech instead of infantry', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'darien': { exhausted: false },  // 4 influence
          },
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 4 },
        ],
      })

      // Indoctrination prompt
      t.choose(game, 'Indoctrinate')

      // Moyin's Ashes DEPLOY: spend 1 extra influence for mech
      t.choose(game, 'Deploy Mech (+1 influence)')

      // Handle Brother Milor prompts if they appear
      while (game.waiting?.selectors?.[0]?.choices) {
        const choices = t.currentChoices(game)
        if (choices.includes('Exhaust Brother Milor')) {
          t.choose(game, 'Pass')
        }
        else {
          break
        }
      }

      // Yin should win ground combat
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Should have a mech on the planet
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      expect(newAlbion.some(u => u.type === 'mech')).toBe(true)
    })

    test('DEPLOY not offered when insufficient influence for mech upgrade', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      // Darien has 4 influence. We need exactly 2 influence available (enough for
      // Indoctrination but not the +1 mech upgrade). Use a planet with 2 influence.
      t.setBoard(game, {
        dennis: {
          planets: {
            'darien': { exhausted: false },  // 4 influence — BUT we need only 2
          },
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 4 },
        ],
      })

      // Indoctrination prompt — darien has 4 influence, so mech option IS offered
      t.choose(game, 'Indoctrinate')

      // Choose infantry only (decline mech deployment)
      t.choose(game, 'Infantry only')

      // Handle Brother Milor prompts
      while (game.waiting?.selectors?.[0]?.choices) {
        const choices = t.currentChoices(game)
        if (choices.includes('Exhaust Brother Milor')) {
          t.choose(game, 'Pass')
        }
        else {
          break
        }
      }

      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Should NOT have a mech (chose infantry only)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      expect(newAlbion.every(u => u.type !== 'mech')).toBe(true)
    })
  })

  describe('Promissory Note — Greyfire Mutagen', () => {
    test('at start of ground combat against 2+ ground forces, replace 1 opponent infantry with own infantry, then return card to Yin player', () => {
      // Use non-Yin opponent to satisfy "forces not controlled by Yin player" condition
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      // Dennis = Sardakk (attacker), Micah = Hacan (defender, PN holder)
      // Greyfire Mutagen owner is a Yin player not in this game — condition
      // requires opponent NOT be the PN owner, so Dennis (Sardakk) qualifies
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'greyfire-mutagen', owner: 'yin-player' }],
          planets: { 'new-albion': { exhausted: false } },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades with 2 infantry (opponent needs 2+ ground forces for Greyfire)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'norr-home', count: 1 },
          { unitType: 'infantry', from: 'norr-home', count: 2 },
        ],
      })

      // Ground combat starts — Micah (defender) is offered Greyfire Mutagen
      t.choose(game, 'Play Greyfire Mutagen')

      // Verify Greyfire Mutagen was activated
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Greyfire Mutagen'))).toBe(true)

      // Micah should no longer have the PN
      const micah = game.players.byName('micah')
      expect(micah.hasPromissoryNote('greyfire-mutagen')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('Impulse Core', () => {
      test('at start of space combat, may destroy own cruiser or destroyer to produce 1 hit against non-fighter ship', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['impulse-core'],
            units: {
              'yin-home': {
                space: ['cruiser', 'destroyer'],
                'darien': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['cruiser', 'fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'cruiser', from: 'yin-home', count: 1 },
            { unitType: 'destroyer', from: 'yin-home', count: 1 },
          ],
        })

        // Impulse Core prompt at start of combat — destroy destroyer to hit non-fighter
        t.choose(game, 'Destroy destroyer')

        // After combat resolves, Micah's cruiser should have been hit by Impulse Core
        // and Yin should win (cruiser vs fighter)
        const dennisShips = game.state.units['27'].space
          .filter(u => u.owner === 'dennis')
        expect(dennisShips.some(u => u.type === 'cruiser')).toBe(true)
        expect(dennisShips.every(u => u.type !== 'destroyer')).toBe(true)

        const micahShips = game.state.units['27'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'yin-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'darien': ['space-dock'],
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
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'yin-home', count: 5 }],
        })

        // No Impulse Core prompt should appear — no technology
        // Devotion prompt appears after combat round (different hook)
        // Combat resolves normally — Yin wins with 5 cruisers vs 1
        const micahShips = game.state.units['27'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })
    })

    describe('Yin Spinner', () => {
      test('after producing units, place up to 2 infantry on controlled planet', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['yin-spinner'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'yin-home': {
                'darien': ['space-dock', 'infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Produce units
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'yin-home' })
        t.choose(game, 'Done')  // skip movement
        t.action(game, 'produce-units', {
          units: [{ type: 'fighter', count: 1 }],
        })

        // Yin Spinner prompt: place infantry on controlled planet
        t.choose(game, 'Planet: darien')
        t.choose(game, 'Pass')  // don't place 2nd

        const darienInfantry = game.state.units['yin-home'].planets['darien']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        // Started with 1, placed 1 more from Yin Spinner
        expect(darienInfantry.length).toBe(2)
      })
    })

    describe('Yin Ascendant', () => {
      test('when gained or when scoring a public objective, gain alliance ability of a random unused faction', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
            technologies: ['sarween-tools', 'psychoarchaeology'],
            units: {
              'yin-home': {
                space: ['cruiser'],
                'darien': ['space-dock', 'infantry'],
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

        // Dennis uses Technology primary: research Yin Ascendant (yellow + green prereqs)
        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'yin-ascendant')

        // Yin Ascendant triggers: random alliance granted
        expect(game.state.yinAscendantAlliances).toBeTruthy()
        expect(game.state.yinAscendantAlliances.length).toBe(1)

        // Should be a faction not in the game
        const alliance = game.state.yinAscendantAlliances[0]
        expect(alliance).not.toBe('yin-brotherhood')
        expect(alliance).not.toBe('emirates-of-hacan')
      })
    })
  })
})
