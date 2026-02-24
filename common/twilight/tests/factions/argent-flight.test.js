const t = require('../../testutil.js')


describe('Argent Flight', () => {
  describe('Data', () => {
    test('starting technologies are empty', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(0)
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('argent-flight')
      expect(faction.factionTechnologies.length).toBe(3)

      const swa2 = faction.factionTechnologies.find(t => t.id === 'strike-wing-alpha-ii')
      expect(swa2.color).toBe('unit-upgrade')
      expect(swa2.prerequisites).toEqual(['red', 'red'])
      expect(swa2.unitUpgrade).toBe('destroyer')

      const aerie = faction.factionTechnologies.find(t => t.id === 'aerie-hololattice')
      expect(aerie.color).toBe('yellow')
      expect(aerie.prerequisites).toEqual(['yellow'])

      const wing = faction.factionTechnologies.find(t => t.id === 'wing-transfer')
      expect(wing.color).toBeNull()
      expect(wing.prerequisites).toEqual(['blue', 'yellow'])
    })
  })

  describe('Zeal', () => {
    test('votes first with extra votes', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      const votingOrder = game.players.all()
      const participation = game.factionAbilities.getAgendaParticipation(votingOrder)

      // Argent should be first in order
      expect(participation.order[0].faction.id).toBe('argent-flight')

      // Argent gets +playerCount votes
      const argent = game.players.byName('dennis')
      const modifier = game.factionAbilities.getVotingModifier(argent)
      expect(modifier).toBe(2) // 2 players
    })
  })

  describe('Raid Formation', () => {
    test('excess AFB hits damage sustain ships', () => {
      // Test getRaidFormationExcessHits directly
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      // 3 AFB hits, 1 fighter destroyed = 2 excess
      const excess = game.factionAbilities.getRaidFormationExcessHits('dennis', 3, 1)
      expect(excess).toBe(2)

      // Non-Argent gets 0
      const noExcess = game.factionAbilities.getRaidFormationExcessHits('micah', 3, 1)
      expect(noExcess).toBe(0)
    })
  })

  describe('Agent — Trillossa Aun Mirik', () => {
    test('after system activation, may exhaust to place 1 infantry on a controlled planet', () => {
      // Dennis (Argent) activates system 27 adjacent to home.
      // Home planets valk/avar/ylir are controlled and adjacent to 27.
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'argent-home': {
              space: ['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis activates system 27 (adjacent to argent-home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Agent prompt should appear (home planets are controlled and adjacent to 27)
      t.choose(game, 'Exhaust Trillossa Aun Mirik')

      // Choose valk for the infantry placement
      t.choose(game, 'valk')

      // Move ships to complete the tactical action
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'argent-home', count: 1 }],
      })

      // Re-fetch player after game replays
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      // Valk should have original 2 infantry + pds + 1 new infantry
      const valkInfantry = game.state.units['argent-home'].planets['valk']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(valkInfantry.length).toBe(3)
    })

    test('can place infantry when another player activates a nearby system', () => {
      // Micah activates system 27 (adjacent to argent-home).
      // Dennis (Argent) should get the agent prompt for home planets.
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'argent-home': {
              space: ['carrier', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              'arretze': ['infantry', 'infantry', 'space-dock'],
              'hercant': ['infantry'],
              'kamdorn': ['infantry'],
            },
            // Micah has a cruiser in system 37 (adjacent to 27)
            '37': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses strategic action (leadership), then it's micah's turn
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines leadership secondary

      // Now it's micah's turn. Micah activates system 27 (adjacent to argent-home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Agent prompt appears for Argent player since argent-home is adjacent to 27
      t.choose(game, 'Exhaust Trillossa Aun Mirik')
      t.choose(game, 'valk')

      // Micah moves ships
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '37', count: 1 }],
      })

      // Re-fetch
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      // Valk should have original 2 infantry + pds + 1 new infantry
      const valkInfantry = game.state.units['argent-home'].planets['valk']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(valkInfantry.length).toBe(3)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'argent-home': {
              space: ['carrier', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis activates system 27 (adjacent to home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // No agent prompt should appear — agent is exhausted
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Exhaust Trillossa Aun Mirik')
    })

    test('no prompt when no controlled planets in system or adjacent', () => {
      // Micah activates system 38 (far from argent-home). No Argent planets nearby.
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'argent-home': {
              space: ['carrier', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['infantry', 'infantry', 'space-dock'],
              'hercant': ['infantry'],
              'kamdorn': ['infantry'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses strategy card (leadership), then it's micah's turn
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines leadership secondary

      // Now it's micah's turn. Micah activates system 38 (far from argent)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '38' })

      // No agent prompt — no Argent-controlled planets near system 38
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Exhaust Trillossa Aun Mirik')
    })

    test('can decline the agent prompt', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'argent-home': {
              space: ['carrier', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Decline the agent
      t.choose(game, 'Pass')

      // Agent should still be ready
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })
  })

  describe('Commander — Trrakan Aun Zulok', () => {
    test.todo('when units roll for a unit ability, one unit may roll 1 additional die')
    test.todo('unlock condition: have 6 units with AFB, space cannon, or bombardment on the board')
    test.todo('locked commander gives no bonus')
  })

  describe('Hero — Mirik Aun Sissiri', () => {
    test.todo('Helix Protocol: move any number of ships to systems with own command tokens and no enemy ships, then purge')
  })

  describe('Mech — Aerie Sentinel', () => {
    test.todo('does not count against capacity when being transported')
    test.todo('does not count against capacity in a space area with own ships that have capacity')
  })

  describe('Promissory Note — Strike Wing Ambuscade', () => {
    test.todo('when units roll for a unit ability, one unit may roll 1 additional die, then return to Argent player')
  })

  describe('Faction Technologies', () => {
    describe('Strike Wing Alpha II', () => {
      test.todo('destroyer upgrade with AFB 6x3')
      test.todo('AFB results of 9 or 10 also destroy opponent infantry in the space area')
    })

    describe('Aerie Hololattice', () => {
      test.todo('other players cannot move ships through systems with Argent structures')
      test.todo('planets with structures gain Production 1 ability')
    })

    describe('Wing Transfer', () => {
      test.todo('when activating a system with only own units, may place command tokens from reinforcements into adjacent systems with only own units')
      test.todo('at end of action, may move ships among active system and adjacent systems with own command tokens')
    })
  })
})
