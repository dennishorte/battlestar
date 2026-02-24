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
    test.todo('PLANETARY DEFENSE NEXUS: place up to 4 PDS or mechs on controlled planets, ready those planets, then purge')
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
      test.todo('exhaust and spend strategy token to cancel another player action card')
    })

    describe('Nullification Field', () => {
      test.todo('exhaust and spend strategy token when another player activates system with your ships to end their turn')
    })

    describe("Archon's Gift", () => {
      test.todo('spend influence as resources and resources as influence')
    })
  })
})
