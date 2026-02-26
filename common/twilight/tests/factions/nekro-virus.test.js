const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Nekro Virus', () => {
  describe('Data', () => {
    test('starting technologies include Dacxive Animators and both Assimilators', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds()
      expect(techs).toEqual(expect.arrayContaining([
        'dacxive-animators',
        'valefar-assimilator-x',
        'valefar-assimilator-y',
      ]))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('nekro-virus')
      expect(faction.factionTechnologies.length).toBe(3)

      const assimX = faction.factionTechnologies.find(ft => ft.id === 'valefar-assimilator-x')
      expect(assimX.name).toBe('Valefar Assimilator X')
      expect(assimX.color).toBeNull()
      expect(assimX.prerequisites).toEqual([])
      expect(assimX.unitUpgrade).toBeNull()

      const assimY = faction.factionTechnologies.find(ft => ft.id === 'valefar-assimilator-y')
      expect(assimY.name).toBe('Valefar Assimilator Y')
      expect(assimY.color).toBeNull()
      expect(assimY.prerequisites).toEqual([])
      expect(assimY.unitUpgrade).toBeNull()

      const assimZ = faction.factionTechnologies.find(ft => ft.id === 'valefar-assimilator-z')
      expect(assimZ.name).toBe('Valefar Assimilator Z')
      expect(assimZ.color).toBeNull()
      expect(assimZ.prerequisites).toEqual([])
      expect(assimZ.unitUpgrade).toBeNull()
    })
  })

  test('cannot research technology normally', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(game.factionAbilities.canResearchNormally(dennis)).toBe(false)

    const micah = game.players.byName('micah')
    expect(game.factionAbilities.canResearchNormally(micah)).toBe(true)
  })

  test('is excluded from agenda voting', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    game.run()

    const votingOrder = game.players.all()
    const participation = game.factionAbilities.getAgendaParticipation(votingOrder)
    expect(participation.excluded).toContain('dennis')
    expect(participation.excluded).not.toContain('micah')
  })

  test('gains tech when opponent unit destroyed in combat', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'nekro-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'mordai-ii': ['space-dock'],
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

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
    })

    // Nekro destroys Hacan fighter — Technological Singularity triggers
    // Choose a tech from Hacan (antimass-deflectors or sarween-tools)
    t.choose(game, 'antimass-deflectors')

    const dennis = game.players.byName('dennis')
    expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
  })

  describe('Agent — Nekro Malleon', () => {
    test('target player can spend command token to gain 2 trade goods', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          tradeGoods: 0,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action > Nekro Malleon
      t.choose(game, 'Component Action')
      t.choose(game, 'nekro-malleon')

      // Choose target player (only micah)
      // micah decides to spend a command token
      t.choose(game, 'Spend Command Token')
      t.choose(game, 'tactics')

      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)
      expect(micah.tradeGoods).toBe(2)

      // Dennis's agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('target player can discard action card to gain 2 trade goods', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        micah: {
          actionCards: ['focused-research', 'direct-hit'],
          tradeGoods: 1,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'nekro-malleon')

      // micah chooses to discard an action card
      t.choose(game, 'Discard Action Card')
      t.choose(game, 'focused-research')

      const micah = game.players.byName('micah')
      expect(micah.actionCards.length).toBe(1)
      expect(micah.tradeGoods).toBe(3)
    })

    test('target player can decline', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          tradeGoods: 5,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'nekro-malleon')

      // micah declines
      t.choose(game, 'Decline')

      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(5)
      expect(micah.commandTokens.tactics).toBe(3)
    })

    test('exhausted agent is not listed in component actions', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // With agent exhausted and no tech component actions, Component Action shouldn't be offered
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Component Action')
    })
  })

  describe('Commander — Nekro Acidos', () => {
    test('unlock condition: assimilators without tokens do not count toward 3 tech threshold', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()

      // Nekro starts with dacxive-animators + assimilator-x + assimilator-y = 3 techs
      // But assimilators without tokens should NOT count
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(3)
      // Commander should still be locked (only 1 effective tech: dacxive-animators)
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('draws 1 action card after gaining technology via Technological Singularity', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'nekro-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'mordai-ii': ['space-dock'],
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

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
      })

      // Nekro destroys Hacan fighter — Technological Singularity triggers
      t.choose(game, 'antimass-deflectors')

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      // Commander draws 1 action card
      expect(dennis.actionCards.length).toBe(1)
    })

    test('does not draw action card when commander is locked', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'nekro-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'mordai-ii': ['space-dock'],
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

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
      })

      // Nekro destroys Hacan fighter — Technological Singularity triggers
      t.choose(game, 'antimass-deflectors')

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      // Commander locked — no action card draw
      expect((dennis.actionCards || []).length).toBe(0)
    })
  })

  describe('Hero — UNIT.DSGN.FLAYESH', () => {
    test('destroys opponent units on planet with tech specialty, gains trade goods and matching tech, then purges', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          tradeGoods: 0,
          units: {
            'nekro-home': {
              'mordai-ii': ['space-dock'],
            },
            // Nekro has units in system 27 (new-albion has green tech specialty, 1 res + 1 inf = 2)
            '27': {
              space: ['cruiser'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Hero via Component Action
      t.choose(game, 'Component Action')
      t.choose(game, 'polymorphic-algorithm')

      // Choose planet: new-albion (green tech specialty, only valid option in system 27)
      // Auto-selected since it's the only planet with tech specialty in a system with Nekro units

      // Choose green tech to gain (new-albion has green specialty)
      // Nekro already has dacxive-animators (green), so choose neural-motivator
      // Note: Singularity does NOT trigger during hero destruction (not combat)
      t.choose(game, 'neural-motivator')

      const dennis = game.players.byName('dennis')
      // Should gain trade goods = resources (1) + influence (1) = 2
      expect(dennis.tradeGoods).toBe(2)

      // Should gain a green technology
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)

      // Hero should be purged
      expect(dennis.isHeroPurged()).toBe(true)

      // Opponent units on new-albion should be destroyed
      const newAlbionUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'micah')
      expect(newAlbionUnits.length).toBe(0)
    })
  })

  describe('Mech — Mordred', () => {
    test('+2 combat when fighting opponent with Valefar assimilator token on their tech', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['dacxive-animators', 'valefar-assimilator-x', 'valefar-assimilator-y'],
          units: {
            '27': {
              'new-albion': ['mech', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
        micah: {
          technologies: ['antimass-deflectors', 'sarween-tools', 'l4-disruptors'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()

      // Simulate assimilator token placed on Letnev's l4-disruptors
      game.state.assimilatorTokens = {
        x: { techId: 'l4-disruptors', ownerName: 'micah' },
      }

      // During combat, Nekro should get -2 modifier (= +2 combat bonus)
      game.state._combatOpponent = { dennis: 'micah', micah: 'dennis' }
      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-2)

      // Opponent (Letnev) should not get the bonus
      const micah = game.players.byName('micah')
      expect(game.factionAbilities.getCombatModifier(micah)).toBe(0)

      // Clean up
      delete game.state._combatOpponent
    })

    test('no combat bonus when opponent has no assimilator token', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()

      game.state._combatOpponent = { dennis: 'micah', micah: 'dennis' }
      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
      delete game.state._combatOpponent
    })
  })

  describe('Promissory Note — Antivirus', () => {
    test('at start of combat, place face-up to prevent Nekro from using Technological Singularity against you', () => {
      // Dennis = Nekro attacks Micah (Hacan) who holds Antivirus
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'nekro-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'mordai-ii': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'antivirus', owner: 'dennis' }],
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
      })

      // At start of combat: Micah is offered to play Antivirus
      t.choose(game, 'Play Antivirus')

      // Nekro destroys Hacan fighter — Technological Singularity should NOT trigger
      // No tech choice prompt — combat just resolves
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(false)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Antivirus'))).toBe(true)
    })

    test('returns to Nekro player when holder activates system with Nekro units', () => {
      // Micah holds face-up Antivirus, then activates system with Dennis's units
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'nekro-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'mordai-ii': ['space-dock'],
            },
            '26': {
              space: ['cruiser'], // Nekro unit in system 26
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'antivirus', owner: 'dennis' }],
          units: {
            '27': {
              space: ['fighter'],
            },
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: attacks system 27, Antivirus triggers at combat start
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
      })

      // Micah plays Antivirus at combat start
      t.choose(game, 'Play Antivirus')

      // Combat resolves (Nekro wins, no Singularity)

      // Micah's turn: activate system 26 (has Dennis's cruiser)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // PN should be returned to Dennis (Nekro)
      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')
      expect(micah.hasPromissoryNote('antivirus')).toBe(false)
      expect(dennis.hasPromissoryNote('antivirus')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Valefar Assimilator X', () => {
      test('place X assimilator token on opponent faction technology instead of gaining it', () => {
        // Use Barony of Letnev as opponent — has faction tech l4-disruptors
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            // Give Letnev their faction tech so it's eligible
            technologies: ['antimass-deflectors', 'sarween-tools', 'l4-disruptors'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // Technological Singularity triggers — now offers assimilator placement
        // Choose to place X token on l4-disruptors
        t.choose(game, 'Place X token on l4-disruptors')

        // Verify assimilator token is placed
        expect(game.state.assimilatorTokens.x).toEqual({
          techId: 'l4-disruptors',
          ownerName: 'micah',
        })

        // Nekro should NOT have gained l4-disruptors as a regular tech in their tech zone
        const dennis = game.players.byName('dennis')
        expect(dennis.getTechIds()).not.toContain('l4-disruptors')
      })

      test('this card gains the text of the token-marked technology', () => {
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['valefar-assimilator-x'],
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            technologies: ['antimass-deflectors', 'l4-disruptors'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // Place X token on l4-disruptors
        t.choose(game, 'Place X token on l4-disruptors')

        // Nekro effectively has l4-disruptors through the assimilator
        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('l4-disruptors')).toBe(true)

        // But NOT in the regular tech zone
        expect(dennis.getTechIds()).not.toContain('l4-disruptors')
      })

      test('cannot place assimilator token on technology that already has one', () => {
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'l4-disruptors'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter', 'fighter'],
              },
            },
          },
        })

        // Pre-place X token on l4-disruptors
        game.testSetBreakpoint('initialization-complete', (game) => {
          game.state.assimilatorTokens = {
            x: { techId: 'l4-disruptors', ownerName: 'micah' },
          }
        })

        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // Technological Singularity triggers — Y is available, but l4-disruptors already has X
        // So only non-faction techs (or faction techs without tokens) should be available
        // Since l4-disruptors is the ONLY faction tech and it already has X token,
        // Y token cannot be placed there, so no assimilator option appears
        // Just pick a regular tech
        t.choose(game, 'antimass-deflectors')

        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)

        // X token should still be on l4-disruptors
        expect(game.state.assimilatorTokens.x).toEqual({
          techId: 'l4-disruptors',
          ownerName: 'micah',
        })
      })
    })

    describe('Valefar Assimilator Y', () => {
      test('place Y assimilator token on opponent faction technology', () => {
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'non-euclidean-shielding'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // Place Y token on non-euclidean-shielding
        t.choose(game, 'Place Y token on non-euclidean-shielding')

        expect(game.state.assimilatorTokens.y).toEqual({
          techId: 'non-euclidean-shielding',
          ownerName: 'micah',
        })
      })

      test('this card gains the text of the token-marked technology', () => {
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['valefar-assimilator-y'],
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            technologies: ['antimass-deflectors', 'non-euclidean-shielding'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // Place Y token on non-euclidean-shielding
        t.choose(game, 'Place Y token on non-euclidean-shielding')

        // Nekro effectively has non-euclidean-shielding through the assimilator
        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('non-euclidean-shielding')).toBe(true)

        // But NOT in the regular tech zone
        expect(dennis.getTechIds()).not.toContain('non-euclidean-shielding')
      })
    })

    describe('Valefar Assimilator Z', () => {
      test('place Z assimilator token on opponent faction sheet, flagship gains that faction flagship text abilities', () => {
        const game = t.fixture({ factions: ['nekro-virus', 'barony-of-letnev'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['valefar-assimilator-z'],
            units: {
              'nekro-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'mordai-ii': ['space-dock'],
              },
            },
          },
          micah: {
            technologies: ['antimass-deflectors'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
        })

        // After destroying Micah's fighter, place Z on Barony's faction sheet
        t.choose(game, 'Place Z on barony-of-letnev')

        expect(game.state.assimilatorTokens.z).toEqual({
          factionId: 'barony-of-letnev',
          ownerName: 'micah',
        })
      })
    })
  })
})
