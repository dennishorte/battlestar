const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('L1Z1X Mindnet', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator', 'plasma-scoring']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('l1z1x-mindnet')
      expect(faction.factionTechnologies.length).toBe(3)

      const inheritance = faction.factionTechnologies.find(t => t.id === 'inheritance-systems')
      expect(inheritance.color).toBe('yellow')
      expect(inheritance.prerequisites).toEqual(['yellow', 'yellow'])
      expect(inheritance.unitUpgrade).toBeNull()

      const superDread = faction.factionTechnologies.find(t => t.id === 'super-dreadnought-ii')
      expect(superDread.color).toBe('unit-upgrade')
      expect(superDread.prerequisites).toEqual(['blue', 'blue', 'yellow'])
      expect(superDread.unitUpgrade).toBe('dreadnought')

      const fealty = faction.factionTechnologies.find(t => t.id === 'fealty-uplink')
      expect(fealty.color).toBeNull()
      expect(fealty.prerequisites).toEqual(['red', 'green'])
      expect(fealty.unitUpgrade).toBeNull()
    })
  })

  describe('Assimilate', () => {
    test('replaces enemy PDS and docks when gaining planet', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // System 27 = New Albion + Starpoint — use 37 = Arinam + Meer for different planet
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['carrier', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'pds', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (L1Z1X) moves 2 carriers + 6 infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'l1z1x-home', count: 2 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 6 },
        ],
      })

      // After ground combat (dennis wins 6 infantry vs 1 + structures)
      // L1Z1X assimilate should replace enemy PDS and space dock
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Check structures belong to dennis now
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)

      // Should have assimilated PDS and space dock
      expect(newAlbion).toContain('pds')
      expect(newAlbion).toContain('space-dock')
    })
  })

  describe('Harrow', () => {
    test('non-fighter ships bombard during ground combat rounds', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // L1Z1X invades with 2 dreadnoughts (bombardment) + carrier with infantry
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
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
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
        ],
      })

      // Ground combat with Harrow: 2 dreadnoughts bombard (5x1 each) every round
      // Plus regular bombardment before combat, plus 4 infantry in ground combat
      // L1Z1X should overwhelm 5 defending infantry
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('dennis')
    })
  })

  describe('Agent — I48S', () => {
    test.todo('exhaust when another player activates a system with your units to remove 1 fleet token')
  })

  describe('Commander — 2RAM', () => {
    test.todo('dreadnoughts and war suns participate in ground combat as ground forces')
    test.todo('locked commander does not allow ships in ground combat')
  })

  describe('Hero — The Helmsman', () => {
    test.todo('DARK SPACE NAVIGATION: place flagship and up to 2 dreadnoughts in empty system and purge')
  })

  describe('Mech — Annihilator', () => {
    test.todo('DEPLOY: mech has bombardment ability usable while not in ground combat')
  })

  describe('Promissory Note — Cybernetic Enhancements', () => {
    test.todo('at start of holder turn, remove 1 L1Z1X strategy token and holder gains 1 strategy token')
    test.todo('returns to L1Z1X player after use')
  })

  describe('Faction Technologies', () => {
    test.todo('Inheritance Systems: exhaust to gain a tech with same or fewer prerequisites')
    test.todo('Super Dreadnought II: upgraded dreadnought cannot be destroyed by Direct Hit')
    test.todo('Fealty Uplink: gain 1 command token when scoring public objective with most tokens on board')
  })
})
