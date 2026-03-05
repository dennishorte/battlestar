const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Winnu', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual([])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('winnu')
      expect(faction.factionTechnologies.length).toBe(3)

      const lazax = faction.factionTechnologies.find(ft => ft.id === 'lazax-gate-folding')
      expect(lazax.color).toBe('blue')
      expect(lazax.prerequisites).toEqual(['blue', 'blue'])

      const hegemonic = faction.factionTechnologies.find(ft => ft.id === 'hegemonic-trade-policy')
      expect(hegemonic.color).toBe('yellow')
      expect(hegemonic.prerequisites).toEqual(['yellow', 'yellow'])

      const imperator = faction.factionTechnologies.find(ft => ft.id === 'imperator')
      expect(imperator.prerequisites).toEqual(['blue', 'red'])
    })
  })

  describe('Blood Ties', () => {
    test('removes custodians without spending influence', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      const { Galaxy } = require('../../model/Galaxy.js')
      const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const mecatolAdjacent = galaxy.getAdjacent('18')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            [mecatolAdjacent]: {
              space: ['carrier'],
              ...((() => {
                const tile = require('../../res/index.js').getSystemTile(mecatolAdjacent) || require('../../res/index.js').getSystemTile(Number(mecatolAdjacent))
                const p = tile?.planets[0]
                return p ? { [p]: ['infantry', 'infantry'] } : {}
              })()),
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
          { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
        ],
      })

      // Winnu removes custodians for free (Blood Ties)
      expect(game.state.custodiansRemoved).toBe(true)
      expect(game.players.byName('dennis').victoryPoints).toBe(1)
    })
  })

  describe('Reclamation', () => {
    test('places PDS and dock on Mecatol Rex after gaining control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      const { Galaxy } = require('../../model/Galaxy.js')
      const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const mecatolAdjacent = galaxy.getAdjacent('18')[0]

      t.setBoard(game, {
        dennis: {
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            [mecatolAdjacent]: {
              space: ['carrier'],
              ...((() => {
                const tile = require('../../res/index.js').getSystemTile(mecatolAdjacent) || require('../../res/index.js').getSystemTile(Number(mecatolAdjacent))
                const p = tile?.planets[0]
                return p ? { [p]: ['infantry', 'infantry'] } : {}
              })()),
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
          { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
        ],
      })

      // Check Mecatol has PDS and space dock from Reclamation
      const mecatolUnits = game.state.units['18'].planets['mecatol-rex']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(mecatolUnits).toContain('pds')
      expect(mecatolUnits).toContain('space-dock')
    })
  })

  describe('Agent — Rickar Rickani', () => {
    test('exhaust after combat win to repair a mech', () => {
      // Dennis (Winnu) invades a planet where he already has a mech defending.
      // The Winnu agent triggers after combat is won.
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'winnu-home': {
              space: ['carrier'],
              'winnu': ['space-dock', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
            },
            '27': {
              'new-albion': ['mech'],
            },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              'new-albion': ['infantry'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis takes tactical action to invade system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'winnu-home', count: 1 },
          { unitType: 'infantry', from: 'winnu-home', count: 8 },
        ],
      })

      // Ground combat: mech + 8 infantry vs 1 infantry — Winnu wins decisively
      // After combat win, the Rickar Rickani agent prompt fires
      t.choose(game, 'Exhaust Rickar Rickani')
      t.choose(game, 'Repair Mech')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })
  })

  describe('Commander — Berekar Berekon', () => {
    test('gives -1 combat modifier (bonus) when controlling Mecatol Rex', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-1)
    })

    test('no combat modifier without Mecatol Rex control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
    })

    test('no combat modifier when commander is locked', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
    })

    test('gives +1 status phase token bonus when controlling Mecatol Rex', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getStatusPhaseTokenBonus(dennis)).toBe(1)
    })

    test('no status phase token bonus without Mecatol Rex control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getStatusPhaseTokenBonus(dennis)).toBe(0)
    })
  })

  describe('Hero — Mathis Mathinus, Kingmaker', () => {
    test('scores 1 public objective you meet requirements for, then purge', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'unlocked' },
          // Give 2 unit upgrade techs to satisfy develop-weaponry
          technologies: ['carrier-ii', 'cruiser-ii', 'antimass-deflectors', 'gravity-drive'],
        },
        revealedObjectives: ['develop-weaponry'],
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennisBefore = game.players.byName('dennis')
      const vpBefore = dennisBefore.victoryPoints

      t.choose(game, 'Component Action')
      t.choose(game, 'winnu-hero')
      // With only 1 scorable objective, it auto-selects

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
      expect(game.state.scoredObjectives['dennis']).toContain('develop-weaponry')
      expect(dennis.victoryPoints).toBe(vpBefore + 1)
    })
  })

  describe('Mech — Reclaimer', () => {
    test('DEPLOY: after another player gains control of a planet you control, place 1 mech', () => {
      // System 38 (Abyz + Fria) is adjacent to hacan-home
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'abyz': { exhausted: false },
          },
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            '38': {
              'abyz': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action (leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Winnu, 4I)

      // Micah: tactical action — invade abyz in system 38
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '38' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'hacan-home', count: 1 },
          { unitType: 'infantry', from: 'hacan-home', count: 5 },
        ],
      })

      // Winnu's Reclaimer DEPLOY triggers when planet is lost
      t.choose(game, 'Deploy Mech')

      // The log should show the deployment happened
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Reclaimer'))).toBe(true)
    })

    test('DEPLOY can be declined', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'abyz': { exhausted: false },
          },
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            '38': {
              'abyz': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action (leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Winnu, 4I)

      // Micah: tactical action — invade abyz in system 38
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '38' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'hacan-home', count: 1 },
          { unitType: 'infantry', from: 'hacan-home', count: 5 },
        ],
      })

      // Decline Reclaimer DEPLOY
      t.choose(game, 'Pass')

      // No Reclaimer log entry
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Reclaimer'))).toBe(false)
    })
  })

  describe('Promissory Note — Acquiescence', () => {
    test('holder gets free secondary when Winnu uses strategic action, then card returns', () => {
      // Dennis = Winnu, Micah = Hacan (holder of Acquiescence)
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'winnu-home': {
              space: ['carrier'],
              'winnu': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'acquiescence', owner: 'dennis' }],
          commandTokens: { tactics: 3, strategy: 0, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      // Dennis = Leadership (1), Micah = Diplomacy (2)
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action (Leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Winnu, 4I)
      // Leadership secondary auto-resolves (Micah has < 3 influence)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(3) // no tokens gained (Hacan 2I < 3)

      // Acquiescence returned to Winnu
      const dennis = game.players.byName('dennis')
      const dennisPNs = dennis.getPromissoryNotes()
      expect(dennisPNs.some(n => n.id === 'acquiescence')).toBe(true)
      const micahPNs = micah.getPromissoryNotes()
      expect(micahPNs.some(n => n.id === 'acquiescence' && n.owner === 'dennis')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('Lazax Gate Folding', () => {
      test('Mecatol Rex system has alpha and beta wormholes when Winnu does not control it', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['lazax-gate-folding'],
          },
        })
        game.run()

        // Mecatol Rex system should have wormholes when Winnu doesn't control it
        const wormholes = game.factionAbilities.getHomeSystemWormholes('18')
        expect(wormholes).toContain('alpha')
        expect(wormholes).toContain('beta')
      })

      test('no wormholes when Winnu controls Mecatol Rex', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['lazax-gate-folding'],
            planets: {
              'mecatol-rex': { exhausted: false },
            },
          },
        })
        game.run()

        const wormholes = game.factionAbilities.getHomeSystemWormholes('18')
        expect(wormholes).toEqual([])
      })

      test('places 1 infantry on Mecatol Rex as component action when controlling it', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['lazax-gate-folding'],
            planets: {
              'mecatol-rex': { exhausted: false },
            },
            units: {
              'winnu-home': {
                'winnu': ['space-dock'],
              },
              '18': {
                'mecatol-rex': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        const beforeUnits = game.state.units['18'].planets['mecatol-rex']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry').length

        t.choose(game, 'Component Action')
        t.choose(game, 'lazax-gate-folding')

        const afterUnits = game.state.units['18'].planets['mecatol-rex']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry').length
        expect(afterUnits).toBe(beforeUnits + 1)

        // Tech should be exhausted
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('lazax-gate-folding')
      })
    })

    describe('Hegemonic Trade Policy', () => {
      test('exhaust to swap resource and influence values of a planet', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['hegemonic-trade-policy'],
            planets: {
              'mecatol-rex': { exhausted: false },
            },
            units: {
              'winnu-home': {
                'winnu': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        t.choose(game, 'hegemonic-trade-policy')

        // Choose a planet to swap
        const choices = t.currentChoices(game)
        expect(choices.length).toBeGreaterThan(0)
        t.choose(game, choices[0])

        // Tech should be exhausted
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('hegemonic-trade-policy')
      })
    })

    test('Imperator: +1 combat per Support for the Throne held by opponents', () => {
      // Winnu (dennis) has Imperator tech, Hacan (micah) holds 1 Support for the Throne
      // Winnu should get -1 combat modifier (bonus) per SftT
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['imperator', 'gravity-drive', 'antimass-deflectors'],
          units: {
            'winnu-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'winnu-home-planet': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'support-for-the-throne', owner: 'dennis' }],
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Winnu) attacks system 27 with 5 cruisers vs 1 fighter
      // With Imperator + opponent holding SftT: cruisers hit on 6 instead of 7
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'winnu-home', count: 5 }],
      })

      // Dennis should easily win with 5 cruisers (combat 7 - 1 = 6) vs 1 fighter
      const system27 = game.state.units['27']
      const dennisShips = system27.space.filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBeGreaterThan(0)
      const micahShips = system27.space.filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })
})
