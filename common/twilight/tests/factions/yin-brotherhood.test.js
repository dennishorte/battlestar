const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yin Brotherhood', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['sarween-tools']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('yin-brotherhood')
      expect(faction.factionTechnologies.length).toBe(3)

      const impulseCore = faction.factionTechnologies.find(t => t.id === 'impulse-core')
      expect(impulseCore.name).toBe('Impulse Core')
      expect(impulseCore.color).toBe('yellow')
      expect(impulseCore.prerequisites).toEqual(['yellow', 'yellow'])
      expect(impulseCore.unitUpgrade).toBeNull()

      const yinSpinner = faction.factionTechnologies.find(t => t.id === 'yin-spinner')
      expect(yinSpinner.name).toBe('Yin Spinner')
      expect(yinSpinner.color).toBe('green')
      expect(yinSpinner.prerequisites).toEqual(['green', 'green'])
      expect(yinSpinner.unitUpgrade).toBeNull()

      const yinAscendant = faction.factionTechnologies.find(t => t.id === 'yin-ascendant')
      expect(yinAscendant.name).toBe('Yin Ascendant')
      expect(yinAscendant.color).toBeNull()
      expect(yinAscendant.prerequisites).toEqual(['yellow', 'green'])
      expect(yinAscendant.unitUpgrade).toBeNull()
    })
  })

  describe('Devotion', () => {
    test('destroys own ship to produce hit after space combat round', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['cruiser', 'destroyer'],
              'darien': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter', 'fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'yin-home', count: 1 },
          { unitType: 'destroyer', from: 'yin-home', count: 1 },
        ],
      })

      // During combat, Yin gets Devotion prompt after each round
      // Choose to destroy destroyer to produce a hit
      t.choose(game, 'Destroy destroyer')

      // Combat should resolve — Yin should win
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Yin should have lost the destroyer (sacrificed) but cruiser survives
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.some(u => u.type === 'cruiser')).toBe(true)
      expect(dennisShips.every(u => u.type !== 'destroyer')).toBe(true)
    })
  })

  describe('Indoctrination', () => {
    test('replaces enemy infantry at ground combat start', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      // Yin invades a planet controlled by Hacan
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Yin) moves carrier + infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 4 },
        ],
      })

      // Indoctrination prompt: spend 2 influence to replace 1 enemy infantry
      t.choose(game, 'Indoctrinate')

      // Ground combat resolves. Yin should win (4+1 vs 2-1 infantry)
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })
  })

  describe('Agent — Brother Milor', () => {
    test.todo('exhaust after a unit is destroyed during combat to place 2 fighters if ship or 2 infantry if ground force')
  })

  describe('Commander — Brother Omar', () => {
    test.todo('satisfies a green technology prerequisite')
    test.todo('when researching tech owned by another player, return 1 infantry to ignore all prerequisites')
  })

  describe('Hero — Dannel of the Tenth', () => {
    test.todo('Quantum Dissemination: commit up to 3 infantry to non-home planets, resolve ground combats without space cannon, then purge')
  })

  describe("Mech — Moyin's Ashes", () => {
    test.todo('DEPLOY: when using Indoctrination, spend 1 additional influence to replace with mech instead of infantry')
  })

  describe('Promissory Note — Greyfire Mutagen', () => {
    test.todo('at start of ground combat against 2+ ground forces, replace 1 opponent infantry with own infantry, then return card to Yin player')
  })

  describe('Faction Technologies', () => {
    describe('Impulse Core', () => {
      test.todo('at start of space combat, may destroy own cruiser or destroyer to produce 1 hit against non-fighter ship')
    })

    describe('Yin Spinner', () => {
      test.todo('after producing units, place up to 2 infantry on any controlled planet or in space area with own ships')
    })

    describe('Yin Ascendant', () => {
      test.todo('when gained or when scoring a public objective, gain alliance ability of a random unused faction')
    })
  })
})
