const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function playToStatusPhase(game) {
  pickStrategyCards(game, 'leadership', 'diplomacy')
  t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
  t.choose(game, 'Done')             // dennis: allocate 3 tokens
  // Skip influence-for-tokens prompt if it appears (when dennis has >= 3 influence)
  if (t.currentChoices(game).includes('Skip')) {
    t.choose(game, 'Skip')
  }
  t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
  t.choose(game, 'hacan-home')
  // dennis: diplomacy secondary auto-skipped (no exhausted planets)
  t.choose(game, 'Pass')  // dennis passes
  t.choose(game, 'Pass')  // micah passes
}

describe('Objectives', () => {
  describe('Victory Points', () => {
    test('player starts with 0 VP', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(0)
    })

    test('VP from Mecatol Rex custodians', () => {
      // Tested in invasion.test.js — custodians removal gives 1 VP
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // No Mecatol control, 0 VP
      expect(dennis.getVictoryPoints()).toBe(0)
    })

    test('VP from Imperial strategy card', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')             // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex influence)
      // Dennis uses imperial
      t.choose(game, 'Strategic Action.imperial')  // dennis: imperial
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(1)
    })

    test('VP accumulates from multiple sources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 3,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')             // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)
      // Dennis uses imperial (+1 VP for Mecatol)
      t.choose(game, 'Strategic Action.imperial')  // dennis: imperial
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      // 3 (starting) + 1 (Imperial Mecatol) = 4
      expect(dennis.getVictoryPoints()).toBe(4)
    })
  })

  describe('Victory Condition', () => {
    test('game ends when player reaches 10 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 9,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')             // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)
      // Dennis uses imperial → goes to 10 VP → game should end
      t.choose(game, 'Strategic Action.imperial')  // dennis (imperial → 10 VP)

      expect(game.gameOver).toBe(true)
      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(10)
    })

    test('gameOverData contains winner name', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 9,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')             // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)
      t.choose(game, 'Strategic Action.imperial')  // dennis: imperial → 10 VP

      expect(game.gameOverData).toBeTruthy()
      expect(game.gameOverData.player).toBe('dennis')
    })

    test('game does not end at 9 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 8,
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')             // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)
      t.choose(game, 'Strategic Action.imperial')  // dennis: imperial → 9 VP
      t.choose(game, 'Pass')  // micah declines imperial secondary

      expect(game.gameOver).toBe(false)
      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(9)
    })

    test('game ends when player scores objective to reach 10 VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['develop-weaponry'],
        dennis: {
          victoryPoints: 9,
          technologies: [
            'neural-motivator', 'antimass-deflectors',
            'infantry-ii', 'fighter-ii',  // 2 unit upgrades
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase — both pass
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')             // dennis: allocate 3 tokens
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase: objective scoring — dennis can score develop-weaponry
      t.choose(game, 'develop-weaponry: Develop Weaponry')

      expect(game.gameOver).toBe(true)
      expect(game.gameOverData.player).toBe('dennis')
    })
  })

  describe('Public Objectives', () => {
    test('objective revealed during status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')             // dennis: allocate 3 tokens
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase runs objective reveal
      t.choose(game, 'Done')  // dennis redistribution
      t.choose(game, 'Done')  // micah redistribution

      // Should have 1 revealed objective
      expect(game.state.revealedObjectives.length).toBe(1)
    })

    test('Diversify Research: checks tech color prerequisites', () => {
      const game = t.fixture()
      game.run()

      // Sol starts with 1 green (neural-motivator) and 1 blue (antimass-deflectors)
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechPrerequisites().green).toBe(1)
      expect(dennis.getTechPrerequisites().blue).toBe(1)

      // Not enough for Diversify Research (need 2 in each of 2 colors)
      const res = require('../res/index.js')
      const obj = res.getObjective('diversify-research')
      expect(obj.check(dennis)).toBe(false)
    })
  })

  describe('Scored Objectives', () => {
    test('scored objectives tracked in game state', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.scoredObjectives).toEqual({})
    })
  })

  describe('Planet Control', () => {
    test('getControlledPlanets returns controlled planet IDs', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const planets = dennis.getControlledPlanets()
      expect(planets).toContain('jord')
    })

    test('getReadyPlanets excludes exhausted planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const readyPlanets = dennis.getReadyPlanets()
      expect(readyPlanets).not.toContain('jord')
    })
  })

  describe('Secret Objectives', () => {
    test('players draw initial secret objectives when enabled', () => {
      const game = t.fixture()
      t.setBoard(game, {
        enableInitialDraws: true,
      })
      game.run()

      // Dennis chooses first secret objective offered
      const dennisChoices = t.currentChoices(game)
      expect(dennisChoices.length).toBe(2)
      t.choose(game, dennisChoices[0])

      // Micah chooses first secret objective offered
      const micahChoices = t.currentChoices(game)
      expect(micahChoices.length).toBe(2)
      t.choose(game, micahChoices[0])

      // Each player should have 1 secret objective
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.secretObjectives.length).toBe(1)
      expect(micah.secretObjectives.length).toBe(1)
    })

    test('setBoard can assign secret objectives', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines', 'control-the-region'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.secretObjectives).toEqual(['cut-supply-lines', 'control-the-region'])
    })

    test('player can score a secret objective during status phase', () => {
      const game = t.fixture()

      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines'],
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],  // Ships in same system as Hacan's space dock
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase — both pass
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')             // dennis: allocate 3 tokens
      // micah: leadership secondary auto-passes (Hacan 2I)
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase: dennis should be prompted to score secret objective
      t.choose(game, 'cut-supply-lines: Cut Supply Lines')

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(1)
      expect(game.state.scoredObjectives['dennis']).toContain('cut-supply-lines')
    })

    test('secret objective scoring gives VP to winner at 10', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          victoryPoints: 9,
          secretObjectives: ['cut-supply-lines'],
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')             // dennis: allocate 3 tokens
      // micah: leadership secondary auto-passes (Hacan 2I)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Score secret objective → 10 VP → game over
      t.choose(game, 'cut-supply-lines: Cut Supply Lines')

      expect(game.gameOver).toBe(true)
      expect(game.gameOverData.player).toBe('dennis')
    })

    test('cannot score same secret objective twice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          secretObjectives: ['cut-supply-lines'],
          scoredObjectives: ['cut-supply-lines'],  // already scored
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')             // dennis: allocate 3 tokens
      // micah: leadership secondary auto-passes (Hacan 2I)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Should not be prompted for secret objective (already scored)
      // Status phase continues to redistribution
      t.choose(game, 'Done')  // dennis redistribution
      t.choose(game, 'Done')  // micah redistribution

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(0)
    })
  })

  describe('Bug Fixes', () => {
    test('diversify-research: planet specialties do not count', () => {
      // 1 green tech + green specialty planet → should NOT satisfy "2 in each of 2 colors"
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'antimass-deflectors'],
          planets: {
            // lodor has green tech specialty
            'lodor': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('diversify-research')
      // 1 green tech + 1 blue tech + green specialty planet = still only 1 green TECH
      expect(obj.check(dennis, game)).toBe(false)
    })

    test('diversify-research: 2 in each of 2 colors works', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: [
            'neural-motivator', 'hyper-metabolism',    // 2 green
            'antimass-deflectors', 'gravity-drive',    // 2 blue
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('diversify-research')
      expect(obj.check(dennis, game)).toBe(true)
    })

    test('master-the-sciences: planet specialties do not count', () => {
      // 1 tech per color + specialty planets → should NOT satisfy "2 in each of 4 colors"
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: [
            'neural-motivator',      // 1 green
            'antimass-deflectors',   // 1 blue
            'plasma-scoring',        // 1 red
            'sarween-tools',         // 1 yellow
          ],
          planets: {
            'lodor': { exhausted: false },       // green specialty
            'mehar-xull': { exhausted: false },  // blue specialty
            'meer': { exhausted: false },        // red specialty
            'wellon': { exhausted: false },      // yellow specialty
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('master-the-sciences')
      expect(obj.check(dennis, game)).toBe(false)
    })

    test('master-the-sciences: 2 in each of 4 colors works', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: [
            'neural-motivator', 'hyper-metabolism',        // 2 green
            'antimass-deflectors', 'gravity-drive',        // 2 blue
            'plasma-scoring', 'magen-defense-grid',        // 2 red
            'sarween-tools', 'graviton-laser-system',      // 2 yellow
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('master-the-sciences')
      expect(obj.check(dennis, game)).toBe(true)
    })
  })

  describe('PoK Public Objectives — Stage I', () => {
    test('amass-wealth: spending objective returns false', () => {
      const obj = res.getObjective('amass-wealth')
      expect(obj.check()).toBe(false)
    })

    test('build-defenses: 4 structures', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['build-defenses'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock', 'pds', 'pds'],
            },
            20: {
              'vefut-ii': ['pds', 'space-dock'],
            },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'build-defenses: Build Defenses')

      expect(game.state.scoredObjectives['dennis']).toContain('build-defenses')
    })

    test('build-defenses negative: only 3 structures', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock', 'pds'],
            },
            20: {
              'vefut-ii': ['pds'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('build-defenses')
      expect(obj.check(dennis, game)).toBe(false)
    })

    test('discover-lost-outposts: 2 planets with attachments', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['discover-lost-outposts'],
        dennis: {
          planets: {
            'lodor': { exhausted: false },
            'vefut-ii': { exhausted: false },
          },
        },
      })
      // Set attachments in breakpoint (direct state mutation is lost on replay)
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.planets['lodor'].attachments = ['demilitarized-zone']
        game.state.planets['vefut-ii'].attachments = ['research-team']
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'discover-lost-outposts: Discover Lost Outposts')

      expect(game.state.scoredObjectives['dennis']).toContain('discover-lost-outposts')
    })

    test('engineer-a-marvel: flagship on board', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['engineer-a-marvel'],
        dennis: {
          units: {
            'sol-home': {
              space: ['flagship'],
              'jord': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'engineer-a-marvel: Engineer a Marvel')

      expect(game.state.scoredObjectives['dennis']).toContain('engineer-a-marvel')
    })

    test('explore-deep-space: ships in 3 empty systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['explore-deep-space'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            // 3 empty systems (no planets): 47, 48, 39
            47: { space: ['cruiser'] },
            48: { space: ['cruiser'] },
            39: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'explore-deep-space: Explore Deep Space')

      expect(game.state.scoredObjectives['dennis']).toContain('explore-deep-space')
    })

    test('improve-infrastructure: structures on 3 non-home planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['improve-infrastructure'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            20: { 'vefut-ii': ['space-dock'] },
            19: { 'wellon': ['pds'] },
            35: { 'bereg': ['space-dock'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'improve-infrastructure: Improve Infrastructure')

      expect(game.state.scoredObjectives['dennis']).toContain('improve-infrastructure')
    })

    test('make-history: units in 2 notable systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['make-history'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            42: { space: ['cruiser'] },   // nebula (anomaly)
            18: { space: ['cruiser'] },   // Mecatol Rex
          },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'make-history: Make History')

      expect(game.state.scoredObjectives['dennis']).toContain('make-history')
    })

    test('populate-the-outer-rim: units in 3 non-home edge systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['populate-the-outer-rim'],
        systems: {
          // Include some standard systems
          26: { q: 0, r: -1 },
          // Add edge systems at ring 3
          46: { q: 3, r: -3 },
          49: { q: 3, r: 0 },
          50: { q: -3, r: 0 },
        },
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            46: { space: ['cruiser'] },
            49: { space: ['cruiser'] },
            50: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'populate-the-outer-rim: Populate the Outer Rim')

      expect(game.state.scoredObjectives['dennis']).toContain('populate-the-outer-rim')
    })

    test('push-boundaries: control more planets than 2 neighbors', () => {
      const game = t.fixture({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
            'lodor': { exhausted: false },
            'vefut-ii': { exhausted: false },
            'wellon': { exhausted: false },
          },
          units: {
            18: { space: ['cruiser'], 'mecatol-rex': ['infantry'] },
          },
        },
        micah: {
          units: {
            18: { space: ['cruiser'] },  // same system → neighbors with dennis
          },
        },
        scott: {
          units: {
            18: { space: ['fighter'] },  // same system → neighbors with dennis
          },
        },
      })
      game.run()

      // Dennis has 5 planets (jord + 4 extra), micah has 3 (hacan), scott has 2 (letnev)
      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('push-boundaries')
      expect(obj.check(dennis, game)).toBe(true)
    })

    test('raise-a-fleet: 5 non-fighter ships in one system', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['raise-a-fleet'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            20: {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'raise-a-fleet: Raise a Fleet')

      expect(game.state.scoredObjectives['dennis']).toContain('raise-a-fleet')
    })

    test('raise-a-fleet negative: 4 non-fighters + fighters not enough', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            20: {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('raise-a-fleet')
      expect(obj.check(dennis, game)).toBe(false)
    })
  })

  describe('PoK Public Objectives — Stage II', () => {
    test('achieve-supremacy: flagship in enemy home system', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['achieve-supremacy'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            'hacan-home': {
              space: ['flagship'],
            },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'achieve-supremacy: Achieve Supremacy')

      expect(game.state.scoredObjectives['dennis']).toContain('achieve-supremacy')
    })

    test('achieve-supremacy negative: flagship in own home', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['flagship'],
              'jord': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('achieve-supremacy')
      expect(obj.check(dennis, game)).toBe(false)
    })

    test('become-a-legend: units in 4 notable systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['become-a-legend'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            18: { space: ['cruiser'] },   // Mecatol Rex
            42: { space: ['cruiser'] },   // nebula
            44: { space: ['cruiser'] },   // asteroid field
            41: { space: ['cruiser'] },   // gravity rift
          },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'become-a-legend: Become a Legend')

      expect(game.state.scoredObjectives['dennis']).toContain('become-a-legend')
    })

    test('command-an-armada: 8 non-fighter ships in one system', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['command-an-armada'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            20: {
              space: [
                'cruiser', 'cruiser', 'cruiser', 'cruiser',
                'cruiser', 'cruiser', 'cruiser', 'cruiser',
              ],
            },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'command-an-armada: Command an Armada')

      expect(game.state.scoredObjectives['dennis']).toContain('command-an-armada')
    })

    test('construct-massive-cities: 7 structures', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['construct-massive-cities'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock', 'pds', 'pds'],
            },
            20: { 'vefut-ii': ['space-dock', 'pds'] },
            19: { 'wellon': ['pds'] },
            35: { 'bereg': ['space-dock'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'construct-massive-cities: Construct Massive Cities')

      expect(game.state.scoredObjectives['dennis']).toContain('construct-massive-cities')
    })

    test('control-the-borderlands: units in 5 non-home edge systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['control-the-borderlands'],
        systems: {
          26: { q: 0, r: -1 },
          46: { q: 3, r: -3 },
          49: { q: 3, r: 0 },
          50: { q: -3, r: 0 },
          47: { q: -3, r: 3 },
          48: { q: 1, r: -3 },
        },
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            46: { space: ['cruiser'] },
            49: { space: ['cruiser'] },
            50: { space: ['cruiser'] },
            47: { space: ['cruiser'] },
            48: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'control-the-borderlands: Control the Borderlands')

      expect(game.state.scoredObjectives['dennis']).toContain('control-the-borderlands')
    })

    test('hold-vast-reserves: spending objective returns false', () => {
      const obj = res.getObjective('hold-vast-reserves')
      expect(obj.check()).toBe(false)
    })

    test('patrol-vast-territories: ships in 5 empty systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['patrol-vast-territories'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            // 5 empty systems: 47, 48, 39, 40, 41
            47: { space: ['cruiser'] },
            48: { space: ['cruiser'] },
            39: { space: ['cruiser'] },
            40: { space: ['cruiser'] },
            41: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'patrol-vast-territories: Patrol Vast Territories')

      expect(game.state.scoredObjectives['dennis']).toContain('patrol-vast-territories')
    })

    test('protect-the-border: structures on 5 non-home planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['protect-the-border'],
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
            20: { 'vefut-ii': ['space-dock'] },
            19: { 'wellon': ['pds'] },
            35: { 'bereg': ['space-dock'], 'lirta-iv': ['pds'] },
            34: { 'centauri': ['pds'] },
          },
        },
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'protect-the-border: Protect the Border')

      expect(game.state.scoredObjectives['dennis']).toContain('protect-the-border')
    })

    test('reclaim-ancient-monuments: 3 planets with attachments', () => {
      const game = t.fixture()
      t.setBoard(game, {
        revealedObjectives: ['reclaim-ancient-monuments'],
        dennis: {
          planets: {
            'lodor': { exhausted: false },
            'vefut-ii': { exhausted: false },
            'wellon': { exhausted: false },
          },
        },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.planets['lodor'].attachments = ['demilitarized-zone']
        game.state.planets['vefut-ii'].attachments = ['research-team']
        game.state.planets['wellon'].attachments = ['paradise-world']
      })
      game.run()
      playToStatusPhase(game)

      t.choose(game, 'reclaim-ancient-monuments: Reclaim Ancient Monuments')

      expect(game.state.scoredObjectives['dennis']).toContain('reclaim-ancient-monuments')
    })

    test('rule-distant-lands: planets in/adjacent to 2 enemy homes', () => {
      const game = t.fixture({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          planets: {
            // Planet in hacan home system
            'arretze': { exhausted: false },
            // Planet in letnev home system
            'arc-prime': { exhausted: false },
          },
          units: {
            'hacan-home': {
              'arretze': ['infantry'],
            },
            'letnev-home': {
              'arc-prime': ['infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const obj = res.getObjective('rule-distant-lands')
      expect(obj.check(dennis, game)).toBe(true)
    })
  })
})
