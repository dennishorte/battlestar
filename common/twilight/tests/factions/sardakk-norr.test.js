const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe("Sardakk N'orr", () => {
  describe('Data', () => {
    test('starting technologies are empty', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(0)
    })

    test('starting units match faction definition', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['norr-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser'])

      const trenlak = game.state.units['norr-home'].planets['trenlak']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(trenlak).toEqual(['infantry', 'infantry', 'infantry', 'pds'])

      const quinarra = game.state.units['norr-home'].planets['quinarra']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(quinarra).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('Exotrireme I dreadnought has bombardment', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('sardakk-norr')
      expect(faction.unitOverrides.dreadnought.name).toBe('Exotrireme I')
      expect(faction.unitOverrides.dreadnought.abilities).toContain('bombardment-4x2')
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('sardakk-norr')
      expect(faction.factionTechnologies.length).toBe(3)

      const vpw = faction.factionTechnologies.find(t => t.id === 'valkyrie-particle-weave')
      expect(vpw.color).toBe('red')
      expect(vpw.prerequisites).toEqual(['red', 'red'])

      const exo2 = faction.factionTechnologies.find(t => t.id === 'exotrireme-ii')
      expect(exo2.unitUpgrade).toBe('dreadnought')
      expect(exo2.prerequisites).toEqual(['blue', 'blue', 'yellow'])
    })
  })

  describe('Unrelenting', () => {
    test('combat rolls are more effective', () => {
      // Deterministic layout: norr-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })

      // Sardakk has 5 cruisers (combat 7, with Unrelenting effectively combat 6)
      // vs 1 fighter (combat 9) — Sardakk should win easily
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'quinarra': ['space-dock'],
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

      // Dennis (Sardakk) uses tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
      })

      // 5 cruisers with Unrelenting should destroy 1 fighter
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('non-Sardakk player does not get Unrelenting bonus', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      // Sardakk has it
      const dennis = game.players.byName('dennis')
      expect(dennis.faction.abilities.some(a => a.id === 'unrelenting')).toBe(true)

      // Hacan does not
      const micah = game.players.byName('micah')
      expect(micah.faction.abilities.some(a => a.id === 'unrelenting')).toBe(false)
    })

    test('getCombatModifier returns -1 for Sardakk', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-1)

      const micah = game.players.byName('micah')
      expect(game.factionAbilities.getCombatModifier(micah)).toBe(0)
    })
  })

  describe("Agent — T'ro", () => {
    test('agent can be exhausted to place 2 infantry after tactical action', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)

      // Dennis does a tactical action — activate a system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', { movements: [] })

      // T'ro prompt: exhaust to place 2 infantry (auto-selects planet since only 1)
      t.choose(game, "Exhaust T'ro")

      // Re-fetch player reference (game replays from scratch on each input)
      const dennisAfter = game.players.byName('dennis')
      expect(dennisAfter.isAgentReady()).toBe(false)

      // Verify 2 infantry added to new-albion (1 original + 2 = 3)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(newAlbion.length).toBe(3)
    })

    test('agent can be used on another player tactical action', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'space-dock'],
            },
            '27': {
              space: [],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass') // micah declines secondary

      // Micah does tactical action in system 27 (where micah has ground forces)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', { movements: [] })

      // T'ro prompt for Sardakk player (dennis): place 2 infantry on micah's planet
      t.choose(game, "Exhaust T'ro")

      // Micah should get 2 infantry placed on new-albion (1 original + 2 = 3)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'micah' && u.type === 'infantry')
      expect(newAlbion.length).toBe(3)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis does a tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: 'norr-home', count: 1 }],
      })

      // No T'ro prompt should appear — agent is exhausted
      // The tactical action should just continue to production
      const choices = t.currentChoices(game)
      expect(choices).not.toContain("Exhaust T'ro")
    })
  })

  describe("Commander — G'hom Sek'kus", () => {
    test('provides +1 to all combat when unlocked', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(1)
    })

    test('provides +1 to ground combat when unlocked', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'ground')
      expect(modifier).toBe(1)
    })

    test('locked commander gives no bonus', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(0)
    })
  })

  describe("Hero — Sh'val, Harbinger", () => {
    test.todo('Tekklar Conditioning: skip to commit ground forces, then purge hero and return ships')
  })

  describe('Mech — Valkyrie Exoskeleton', () => {
    test.todo('after sustain damage during ground combat, produce 1 hit against opponent')
  })

  describe('Promissory Note — Tekklar Legion', () => {
    test.todo('holder gets +1 combat during invasion')
    test.todo('if opponent is Sardakk, Sardakk gets -1 during that combat')
    test.todo('returns to Sardakk player after use')
  })

  describe('Faction Technologies', () => {
    describe('Valkyrie Particle Weave', () => {
      test.todo('after ground combat rolls, if opponent produced hits, produce 1 additional hit')
    })

    describe('Exotrireme II', () => {
      test.todo('dreadnought has move 2 after upgrade')
      test.todo('cannot be destroyed by Direct Hit')
      test.todo('after space combat round, may self-destruct to destroy up to 2 ships')
    })

    describe("N'orr Supremacy", () => {
      test('after winning combat, may gain 1 command token', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['norr-supremacy'],
            units: {
              'norr-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'quinarra': ['space-dock'],
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

        const dennis = game.players.byName('dennis')
        const tokensBefore = dennis.commandTokens.tactics + dennis.commandTokens.fleet + dennis.commandTokens.strategy

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
        })

        // After winning combat, N'orr Supremacy prompt
        t.choose(game, 'Gain Command Token')
        t.choose(game, 'tactics')

        const tokensAfter = dennis.commandTokens.tactics + dennis.commandTokens.fleet + dennis.commandTokens.strategy
        // Spent 1 tactic token to activate, but gained 1 from Supremacy
        expect(tokensAfter).toBe(tokensBefore)
      })

      test.todo('after winning combat, may research a unit upgrade technology instead')
    })
  })
})
