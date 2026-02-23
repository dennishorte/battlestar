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
    test.todo('may exhaust to choose a player who may discard 1 action card or spend 1 command token to gain 2 trade goods')
    test.todo('exhausted agent cannot be used')
  })

  describe('Commander — Nekro Acidos', () => {
    test.todo('unlock condition: own 3 technologies (Valefar Assimilator counts only if X or Y token is on a technology)')
    test.todo('after gaining a technology, may draw 1 action card')
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
