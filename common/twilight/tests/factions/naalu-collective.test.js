const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naalu Collective', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator', 'sarween-tools']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('naalu-collective')
      expect(faction.factionTechnologies.length).toBe(3)

      const neuroglaive = faction.factionTechnologies.find(ft => ft.id === 'neuroglaive')
      expect(neuroglaive.color).toBe('green')
      expect(neuroglaive.prerequisites).toEqual(['green', 'green', 'green'])
      expect(neuroglaive.unitUpgrade).toBeNull()

      const hcf2 = faction.factionTechnologies.find(ft => ft.id === 'hybrid-crystal-fighter-ii')
      expect(hcf2.color).toBe('unit-upgrade')
      expect(hcf2.prerequisites).toEqual(['green', 'blue'])
      expect(hcf2.unitUpgrade).toBe('fighter')

      const mindsieve = faction.factionTechnologies.find(ft => ft.id === 'mindsieve')
      expect(mindsieve.color).toBeNull()
      expect(mindsieve.prerequisites).toEqual(['red', 'green'])
      expect(mindsieve.unitUpgrade).toBeNull()
    })
  })

  describe('Telepathic', () => {
    test('Naalu always goes first in action phase regardless of strategy card', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'naalu-collective', 'emirates-of-hacan'],
      })
      game.run()

      // Snake draft: dennis, micah, scott, scott, micah, dennis
      t.choose(game, 'leadership')    // dennis: leadership(1)
      t.choose(game, 'imperial')      // micah: imperial(8)
      t.choose(game, 'diplomacy')     // scott: diplomacy(2)
      t.choose(game, 'construction')  // scott: construction(4)
      t.choose(game, 'politics')      // micah: politics(3)
      t.choose(game, 'trade')         // dennis: trade(5)

      // Despite having high cards (3,8), Naalu should go first (initiative 0)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('non-Naalu player with lower card goes after Naalu', () => {
      const game = t.fixture({
        factions: ['federation-of-sol', 'naalu-collective'],
      })
      game.run()

      // Dennis picks leadership(1), micah (Naalu) picks imperial(8)
      t.choose(game, 'leadership')
      t.choose(game, 'imperial')

      // Naalu goes first even though leadership(1) < imperial(8)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Foresight', () => {
    test('Naalu can move ship to adjacent system when opponent enters', () => {
      // Deterministic layout: hacan-home at (0,-3) → adjacent to system 27 (0,-2)
      // System 27 (0,-2) is adjacent to: [37, 26, 48, hacan-home]
      // Place Naalu fighter in system 27, Hacan approaches from home
      const game = t.fixture({
        factions: ['emirates-of-hacan', 'naalu-collective'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            '27': {
              space: ['fighter'],
            },
            'naalu-home': {
              space: [],
              'druaa': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Micah (Naalu, telepathic=0) goes first — use diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'naalu-home')   // diplomacy: choose system
      t.choose(game, 'Pass')         // dennis declines diplomacy secondary

      // Dennis (Hacan) takes tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.choose(game, 'Pass')            // micah declines Z'eu agent
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // Naalu prompted for Foresight — retreat to system 37 (adjacent to 27)
      // Use * prefix to prevent t.choose from converting '37' to number
      t.choose(game, '*37')

      // Naalu's fighter should have moved to system 37
      const retreatShips = game.state.units['37'].space
        .filter(u => u.owner === 'micah')
      expect(retreatShips.length).toBe(1)

      // Naalu should have spent 1 strategy token
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe("Agent — Z'eu", () => {
    test("exhaust to return another player's command token from a system", () => {
      // dennis = Naalu (has Z'eu), micah = Hacan
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu, telepathic=0) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')         // micah declines leadership secondary

      // Micah (Hacan) takes tactical action — activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Z'eu prompt: dennis (Naalu) can exhaust to return micah's token
      t.choose(game, "Exhaust Z'eu")

      // Micah's token should be removed from system 27
      expect(game.state.systems['27'].commandTokens).not.toContain('micah')

      // Micah should get the token back in tactics pool (was 3, spent 1 to activate, +1 from Z'eu = 3)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(3)

      // Dennis's agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test("can pass on Z'eu when agent is ready", () => {
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')         // micah declines leadership secondary

      // Micah activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Dennis declines Z'eu
      t.choose(game, 'Pass')

      // Micah's token should remain in system 27
      expect(game.state.systems['27'].commandTokens).toContain('micah')

      // Micah's tactic tokens should have decreased by 1 (spent to activate)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)

      // Dennis's agent should still be ready
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })

    test("Z'eu does not trigger when agent is exhausted", () => {
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')         // micah declines leadership secondary

      // Micah activates system 27 — no Z'eu prompt expected (agent exhausted)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Should proceed directly to movement step — no Z'eu prompt
      // Micah's token should be in system 27
      expect(game.state.systems['27'].commandTokens).toContain('micah')

      // Micah spent 1 tactic token
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)
    })
  })

  describe("Commander — M'aban", () => {
    test.todo('unlock condition: have ground forces in or adjacent to the Mecatol Rex system')
    test.todo('may look at neighbours\' hands of promissory notes and top and bottom card of agenda deck')
  })

  describe('Hero — The Oracle', () => {
    test.todo('C-RADIUM GEOMETRY: at end of status phase, force each other player to give 1 promissory note, then purge')
  })

  describe('Mech — Iconoclast', () => {
    test.todo('DEPLOY: when another player gains a relic, place 1 mech on any planet you control')
  })

  describe('Promissory Note — Gift of Prescience', () => {
    test.todo('holder places Naalu "0" token on their strategy card to go first in initiative order')
    test.todo('Naalu cannot use Telepathic during this game round')
    test.todo('returns to Naalu player at end of status phase')
  })

  describe('Faction Technologies', () => {
    describe('Neuroglaive', () => {
      test('after another player activates a system with your ships, they remove 1 fleet pool token', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neuroglaive'],
            units: {
              'naalu-home': {
                space: ['carrier'],
                'druaa': ['space-dock'],
              },
              '27': {
                space: ['fighter'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Naalu, telepathic=0) goes first — use leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')         // micah declines leadership secondary

        // Micah activates system 27, which has Naalu's fighter
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Z'eu agent prompt — pass
        t.choose(game, 'Pass')

        // Neuroglaive fires automatically (no choice needed)
        // Micah should lose 1 fleet pool token
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.fleet).toBe(2)
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'naalu-home': {
                space: ['carrier'],
                'druaa': ['space-dock'],
              },
              '27': {
                space: ['fighter'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Naalu) goes first — use leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')         // micah declines leadership secondary

        // Micah activates system 27, which has Naalu's fighter
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Z'eu agent prompt — pass
        t.choose(game, 'Pass')

        // Without Neuroglaive, Micah should keep all fleet pool tokens
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.fleet).toBe(3)
      })
    })

    describe('Hybrid Crystal Fighter II', () => {
      test.todo('fighters may move without being transported')
      test.todo('excess fighters count as 1/2 ship against fleet pool')
    })

    describe('Mindsieve', () => {
      test.todo('give a promissory note to resolve secondary ability without spending a command token')
    })
  })
})
