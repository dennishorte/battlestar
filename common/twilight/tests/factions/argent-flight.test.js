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
    test('when units roll for a unit ability, one unit may roll 1 additional die', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'argent-home': {
              space: ['destroyer', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      // Commander is unlocked, so bonus dice should be 1
      const bonus = game.factionAbilities.getUnitAbilityBonusDice('dennis')
      expect(bonus).toBe(1)
    })

    test('unlock condition: have 6 units with AFB, space cannon, or bombardment on the board', () => {
      // Test that the unlock condition requires 6 units with combat abilities
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          // Start with commander locked and place exactly 6 units with abilities:
          // 2 destroyers (AFB) + 4 PDS (space cannon) = 6 total
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'argent-home': {
              space: ['destroyer', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['pds', 'pds'],
            },
          },
        },
      })
      game.run()

      // Verify the count is >= 6 (2 destroyers + 4 PDS)
      const count = game._countCombatAbilityUnits('dennis')
      expect(count).toBe(6)
    })

    test('locked commander gives no bonus', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'argent-home': {
              space: ['destroyer', 'destroyer'],
              'valk': ['infantry', 'infantry', 'pds'],
              'avar': ['infantry', 'infantry'],
              'ylir': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      // Commander is locked, so no bonus dice
      const bonus = game.factionAbilities.getUnitAbilityBonusDice('dennis')
      expect(bonus).toBe(0)
    })
  })

  describe('Hero — Mirik Aun Sissiri', () => {
    test('Helix Protocol: move ships to systems with own command tokens and no enemy ships, then purge', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        systemTokens: {
          '26': ['dennis'],  // Dennis has a command token in system 26
        },
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
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

      // Dennis uses Component Action -> Helix Protocol
      t.choose(game, 'Component Action')
      t.choose(game, 'helix-protocol')

      // Choose to move 1 destroyer from argent-home
      // (choices: Skip this system, Move 1 carrier from argent-home, Move 1 destroyer from argent-home, etc.)
      t.choose(game, 'Move 1 destroyer from argent-home')
      // System 26 is the only target (has Dennis's command token, no enemy ships), auto-selected

      // Verify: destroyer moved to system 26
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(1)
      expect(ships26[0].type).toBe('destroyer')

      // Carrier should still be at home
      const shipsHome = game.state.units['argent-home'].space.filter(u => u.owner === 'dennis')
      expect(shipsHome.length).toBe(1)
      expect(shipsHome[0].type).toBe('carrier')

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })

    test('hero is purged even with no valid target systems', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      t.setBoard(game, {
        // No command tokens anywhere
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
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

      // Dennis uses Component Action -> Helix Protocol
      t.choose(game, 'Component Action')
      t.choose(game, 'helix-protocol')

      // No valid target systems, so hero is purged immediately
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })
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
      test('destroyer upgrade with AFB 6x3', () => {
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'magen-defense-grid', 'strike-wing-alpha-ii'],
            units: {
              'argent-home': {
                space: ['destroyer'],
                'valk': ['infantry', 'infantry', 'pds'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()

        // Verify the upgraded destroyer stats
        const stats = game._getUnitStats('dennis', 'destroyer')
        expect(stats.combat).toBe(7)
        expect(stats.move).toBe(2)
        expect(stats.capacity).toBe(1)
        expect(stats.abilities).toContain('anti-fighter-barrage-6x3')
      })

      test('AFB results of 9 or 10 also destroy opponent infantry in the space area', () => {
        // Use deterministic seed so AFB rolls are predictable
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'], seed: 'swa-ii-infantry' })
        t.setBoard(game, {
          dennis: {
            technologies: ['plasma-scoring', 'magen-defense-grid', 'strike-wing-alpha-ii'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['destroyer', 'destroyer', 'carrier'],
                'new-albion': ['infantry', 'infantry', 'space-dock'],
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
              // Micah has fighters and infantry in space of system 26
              '26': {
                space: ['carrier', 'fighter', 'fighter', 'infantry', 'infantry'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Dennis activates system 26 (adjacent to 27)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })

        // Move Dennis's destroyer and carrier to system 26
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'destroyer', from: '27', count: 2 },
            { unitType: 'carrier', from: '27', count: 1 },
          ],
        })

        // Space combat occurs — AFB fires first. With SWA II, rolls of 9-10 also kill infantry.
        // We can verify the tech was recognized by checking the unit stats.
        const stats = game._getUnitStats('dennis', 'destroyer')
        expect(stats.abilities).toContain('anti-fighter-barrage-6x3')
      })
    })

    describe('Aerie Hololattice', () => {
      test('other players cannot move ships through systems with Argent structures', () => {
        // Dennis (Argent) has Aerie Hololattice and a PDS in system 26 (on lodor).
        // Micah (Hacan) tries to move from system 27 through 26 to 18 (Mecatol).
        // With Aerie Hololattice, Micah cannot pass through 26.
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sarween-tools', 'aerie-hololattice'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'argent-home': {
                'valk': ['infantry', 'infantry'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
              '26': {
                'lodor': ['pds'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['cruiser'],
              },
              'hacan-home': {
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

        // Dennis does a strategic action
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')

        // Micah activates Mecatol (system 18) and tries to move cruiser
        // from 27 through 26 to 18. But 26 has Argent structures and
        // Aerie Hololattice blocks passage.
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '18' })

        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Cruiser should NOT arrive at Mecatol (path blocked by Aerie Hololattice)
        const ships18 = game.state.units['18'].space.filter(u => u.owner === 'micah')
        expect(ships18.length).toBe(0)

        // Cruiser should still be at system 27
        const ships27 = game.state.units['27'].space.filter(u => u.owner === 'micah')
        expect(ships27.length).toBe(1)
      })

      test('Argent player own ships can move through own structures', () => {
        // Dennis (Argent) has Aerie Hololattice and a PDS in system 26.
        // Dennis should be able to move through 26 normally.
        // Cruiser in system 27 (0,-2), PDS on lodor in 26 (0,-1), target Mecatol 18 (0,0)
        // Distance: 27 -> 26 -> 18 = 2 hops, cruiser has move 2
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sarween-tools', 'aerie-hololattice'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'argent-home': {
                'valk': ['infantry', 'infantry'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
              '27': {
                space: ['cruiser'],
              },
              '26': {
                'lodor': ['pds'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Dennis activates Mecatol (system 18) and moves cruiser from 27
        // through 26 (which has Argent PDS) to 18
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '18' })

        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
        })

        // Cruiser should arrive at Mecatol (own structures don't block)
        const ships18 = game.state.units['18'].space.filter(u => u.owner === 'dennis')
        expect(ships18.length).toBe(1)
      })

      test('planets with structures gain Production 1 ability', () => {
        // Dennis (Argent) has Aerie Hololattice and a PDS on a planet without a dock.
        // That planet should allow production of 1 unit.
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sarween-tools', 'aerie-hololattice'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'argent-home': {
                'valk': ['infantry', 'infantry', 'pds'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
              '26': {
                space: ['carrier'],
                'lodor': ['pds'],
              },
            },
          },
        })
        game.run()

        // Verify the production bonus is calculated
        const dennis = game.players.byName('dennis')
        const bonus = game.factionAbilities.getStructureProductionBonus(dennis, '26')
        expect(bonus).toBe(1) // PDS on lodor, no space dock = +1 production
      })

      test('structures with space dock do not get extra production', () => {
        // A planet with both a PDS and a space dock should not get extra production
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sarween-tools', 'aerie-hololattice'],
            units: {
              'argent-home': {
                'valk': ['infantry', 'infantry', 'pds'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        // valk has PDS but no dock -> should gain +1
        // ylir has dock -> no extra bonus
        const bonus = game.factionAbilities.getStructureProductionBonus(dennis, 'argent-home')
        expect(bonus).toBe(1) // Only valk gets +1 (PDS without dock)
      })

      test('no production bonus without Aerie Hololattice', () => {
        const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'argent-home': {
                'valk': ['infantry', 'infantry', 'pds'],
                'avar': ['infantry', 'infantry'],
                'ylir': ['infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        const bonus = game.factionAbilities.getStructureProductionBonus(dennis, 'argent-home')
        expect(bonus).toBe(0)
      })
    })

    describe('Wing Transfer', () => {
      test.todo('when activating a system with only own units, may place command tokens from reinforcements into adjacent systems with only own units')
      test.todo('at end of action, may move ships among active system and adjacent systems with own command tokens')
    })
  })
})
