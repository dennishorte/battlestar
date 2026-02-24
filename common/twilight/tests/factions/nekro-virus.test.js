const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Nekro Virus', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['dacxive-animators']))
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

      // Enter Component Action menu
      t.choose(game, 'Component Action')

      // With agent exhausted and no tech component actions, nekro-malleon should not appear
      // The game should have logged "No component actions available" and returned
      // So we should be on micah's turn now
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Commander — Nekro Acidos', () => {
    test.todo('unlock condition: own 3 technologies (Valefar Assimilator counts only if X or Y token is on a technology)')

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
    test.todo('POLYMORPHIC ALGORITHM: choose planet with tech specialty in system with your units, destroy other units, gain trade goods and matching tech, then purge')
  })

  describe('Mech — Mordred', () => {
    test.todo('DEPLOY: applies +2 to combat rolls against opponent with X or Y token on their technologies')
  })

  describe('Promissory Note — Antivirus', () => {
    test.todo('at start of combat, place face-up to prevent Nekro from using Technological Singularity against you')
    test.todo('returns to Nekro player when holder activates system with Nekro units')
  })

  describe('Faction Technologies', () => {
    describe('Valefar Assimilator X', () => {
      test.todo('place X assimilator token on opponent faction technology instead of gaining it')
      test.todo('this card gains the text of the token-marked technology')
      test.todo('cannot place assimilator token on technology that already has one')
    })

    describe('Valefar Assimilator Y', () => {
      test.todo('place Y assimilator token on opponent faction technology instead of gaining it')
      test.todo('this card gains the text of the token-marked technology')
      test.todo('cannot place assimilator token on technology that already has one')
    })

    describe('Valefar Assimilator Z', () => {
      test.todo('place Z assimilator token on opponent faction sheet, flagship gains that faction flagship text abilities')
    })
  })
})
