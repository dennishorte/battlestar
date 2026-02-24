const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Xxcha Kingdom', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['graviton-laser-system']))
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('xxcha-kingdom')
      expect(faction.factionTechnologies.length).toBe(3)

      const nullField = faction.factionTechnologies.find(t => t.id === 'nullification-field')
      expect(nullField.color).toBe('yellow')
      expect(nullField.prerequisites).toEqual(['yellow', 'yellow'])

      const instinct = faction.factionTechnologies.find(t => t.id === 'instinct-training')
      expect(instinct.color).toBe('green')
      expect(instinct.prerequisites).toEqual(['green'])

      const archon = faction.factionTechnologies.find(t => t.id === 'archons-gift')
      expect(archon.prerequisites).toEqual(['yellow', 'green'])
    })
  })

  describe('Peace Accords', () => {
    test('gains unoccupied adjacent planet after diplomacy', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines secondary

      // Dennis (Xxcha, diplomacy=2) uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'xxcha-home')  // Choose home system for Diplomacy

      // Peace Accords: Xxcha can gain unoccupied planet adjacent to controlled planets
      const choices = t.currentChoices(game)
      expect(choices).toContain('Pass')
      expect(choices.length).toBeGreaterThan(1)

      // Choose first non-Pass option
      const planetChoice = choices.find(c => c !== 'Pass')
      t.choose(game, planetChoice)

      // Micah gets diplomacy secondary prompt
      t.choose(game, 'Pass')

      // The chosen planet should now be controlled by dennis
      expect(game.state.planets[planetChoice].controller).toBe('dennis')
    })
  })

  describe('Quash', () => {
    test('spends strategy token to discard and replace agenda', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['mutiny', 'anti-intellectual-revolution', 'incentive-program'],
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Agenda phase — first agenda revealed: "mutiny"
      // Xxcha (dennis) gets Quash prompt
      t.choose(game, 'Quash')

      // Strategy token spent (started with 2, spent 1)
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.strategy).toBe(1)
    })
  })

  describe('Agent — Ggrocuto Rinn', () => {
    test.todo('exhaust after agenda revealed, readied planets count as 2 additional votes')
  })

  describe('Commander — Elder Qanoj', () => {
    test('+1 vote per readied planet when commander unlocked', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'archon-ren': { exhausted: false },
            'archon-tau': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)

      // 2 readied planets = +2 votes
      const modifier = game.factionAbilities.getVotingModifier(dennis)
      expect(modifier).toBe(2)
    })

    test('exhausted planets do not count for voting modifier', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'archon-ren': { exhausted: false },
            'archon-tau': { exhausted: true },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // Only 1 readied planet
      const modifier = game.factionAbilities.getVotingModifier(dennis)
      expect(modifier).toBe(1)
    })

    test('no voting modifier when commander is locked', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'archon-ren': { exhausted: false },
            'archon-tau': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
      const modifier = game.factionAbilities.getVotingModifier(dennis)
      expect(modifier).toBe(0)
    })

    test('Xxcha cannot be excluded from voting', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const votingOrder = game.players.all()
      const participation = game.factionAbilities.getAgendaParticipation(votingOrder)
      expect(participation.excluded).not.toContain('dennis')
    })
  })

  describe('Hero — Xxekir Grom', () => {
    test('PLANETARY DEFENSE NEXUS: place up to 4 PDS or mechs on controlled planets, ready those planets, then purge', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'unlocked' },
          planets: {
            'archon-ren': { exhausted: true },
            'archon-tau': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action -> Xxekir Grom Hero
      t.choose(game, 'Component Action')
      t.choose(game, 'xxekir-grom-hero')

      // Place 2 PDS on archon-ren and 1 mech on archon-tau
      t.choose(game, 'pds:archon-ren')
      t.choose(game, 'pds:archon-ren')
      t.choose(game, 'mech:archon-tau')
      t.choose(game, 'Done')

      const dennis = game.players.byName('dennis')

      // Hero should be purged
      expect(dennis.isHeroPurged()).toBe(true)

      // Planets where units were placed should be readied
      expect(game.state.planets['archon-ren'].exhausted).toBe(false)
      expect(game.state.planets['archon-tau'].exhausted).toBe(false)

      // Verify PDS placed on archon-ren
      const renPDS = game.state.units['xxcha-home'].planets['archon-ren']
        .filter(u => u.owner === 'dennis' && u.type === 'pds')
      expect(renPDS.length).toBeGreaterThanOrEqual(3) // 1 starting + 2 hero

      // Verify mech placed on archon-tau
      const tauMechs = game.state.units['xxcha-home'].planets['archon-tau']
        .filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(tauMechs.length).toBe(1)
    })
  })

  describe('Mech — Indomitus', () => {
    test.todo('damage immune during bombardment and space cannon')
    test.todo('DEPLOY: when elected or gaining TG during agenda phase')
  })

  describe('Promissory Note — Political Favor', () => {
    test.todo('when agenda is revealed, remove 1 rider or cancel 1 speaker action')
    test.todo('returns to Xxcha player after use')
  })

  describe('Faction Technologies', () => {
    describe('Instinct Training', () => {
      test('exhaust and spend strategy token to cancel another player action card', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['graviton-laser-system', 'neural-motivator', 'instinct-training'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
          micah: {
            actionCards: ['mining-initiative'],
            tradeGoods: 0,
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: strategic action (leadership=1 goes first)
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // Micah plays action card - Mining Initiative
        // (only 1 action card so card selection auto-resolves)
        t.choose(game, 'Play Action Card')

        // Xxcha (dennis) gets prompt to cancel via Instinct Training
        t.choose(game, 'Cancel')

        const dennis = game.players.byName('dennis')
        // Strategy token spent
        expect(dennis.commandTokens.strategy).toBe(1)
        // Tech should be exhausted
        expect(dennis.exhaustedTechs).toContain('instinct-training')

        // Micah should not have gained trade goods (card was cancelled)
        const micah = game.players.byName('micah')
        expect(micah.tradeGoods).toBe(0)
      })
    })

    describe('Nullification Field', () => {
      test('exhaust and spend strategy token when another player activates system with your ships to end their turn', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        // Place Xxcha ships in a system that Hacan will activate
        t.setBoard(game, {
          dennis: {
            technologies: ['graviton-laser-system', 'plasma-scoring', 'magen-defense-grid', 'nullification-field'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'xxcha-home': {
                space: ['cruiser', 'cruiser', 'fighter', 'fighter', 'fighter', 'carrier'],
                'archon-ren': ['infantry', 'infantry', 'space-dock', 'pds'],
                'archon-tau': ['infantry', 'infantry'],
              },
              '26': {
                space: ['cruiser'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: strategic action (leadership)
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // Micah: tactical action — activate system 26 (where Xxcha has a cruiser)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })

        // Xxcha gets Nullification Field prompt
        t.choose(game, 'Nullify')

        const dennis = game.players.byName('dennis')
        expect(dennis.commandTokens.strategy).toBe(1)
        expect(dennis.exhaustedTechs).toContain('nullification-field')

        // Micah's turn should have ended — micah should not get movement prompt
        // The game should continue to the next action choice
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.tactics).toBe(2) // spent 1 for the activation
      })
    })

    describe("Archon's Gift", () => {
      test.todo('spend influence as resources and resources as influence')
    })
  })
})
