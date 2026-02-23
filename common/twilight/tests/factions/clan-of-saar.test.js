const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Clan of Saar', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('clan-of-saar')
      expect(faction.factionTechnologies.length).toBe(3)

      const chaos = faction.factionTechnologies.find(ft => ft.id === 'chaos-mapping')
      expect(chaos.color).toBe('blue')
      expect(chaos.prerequisites).toEqual(['blue'])

      const ff2 = faction.factionTechnologies.find(ft => ft.id === 'floating-factory-ii')
      expect(ff2.color).toBe('unit-upgrade')
      expect(ff2.unitUpgrade).toBe('space-dock')
      expect(ff2.prerequisites).toEqual(['yellow', 'yellow'])

      const deorbit = faction.factionTechnologies.find(ft => ft.id === 'deorbit-barrage')
      expect(deorbit.prerequisites).toEqual(['blue', 'red'])
    })
  })

  describe('Scavenge', () => {
    test('gains 1 trade good when gaining planet control', () => {
      // Saar moves ground forces to an uncontrolled planet
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'saar-home': {
              space: ['carrier'],
              'lisis-ii': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['carrier'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis takes tactical action to move into system 37 (has planets)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '37' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: '27', count: 1 }, { unitType: 'infantry', from: '27', count: 1 }],
      })

      // Infantry placed on planet -> planet gained -> scavenge triggers
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })
  })

  describe('Nomadic', () => {
    test.todo('can score objectives without controlling home system planets')
  })

  describe('Floating Factory I', () => {
    test.todo('space dock is placed in space area instead of on a planet')
    test.todo('space dock can move as if it were a ship')
    test.todo('space dock is destroyed if blockaded')
  })

  describe('Flagship — Son of Ragh', () => {
    test.todo('has anti-fighter barrage 6x4')
    test.todo('has capacity 3')
  })

  describe('Mech — Scavenger Zeta', () => {
    test.todo('DEPLOY: after gaining control of a planet, may spend 1 trade good to place 1 mech on that planet')
  })

  describe('Agent — Captain Mendosa', () => {
    test.todo('after a player activates a system, may exhaust to increase move value of 1 ship to match highest on board')
    test.todo('exhausted agent cannot be used')
  })

  describe('Commander — Rowl Sarrig', () => {
    test.todo('unlock condition: have 3 space docks on the game board')
    test.todo('when producing fighters or infantry, may place each at any non-blockaded space dock')
  })

  describe('Hero — Gurno Aggero', () => {
    test.todo('ARMAGEDDON RELAY: choose adjacent system to space dock, destroy all other players infantry and fighters, then purge')
  })

  describe('Promissory Note — Ragh\'s Call', () => {
    test.todo('after committing units to land on a planet, remove all Saar ground forces from that planet and place them on a Saar-controlled planet')
    test.todo('returns to Saar player after use')
  })

  describe('Faction Technologies', () => {
    describe('Chaos Mapping', () => {
      test.todo('other players cannot activate asteroid fields containing Saar ships')
      test.todo('at start of action phase turn, may produce 1 unit in system with a Production unit')
    })

    describe('Floating Factory II', () => {
      test.todo('space dock upgrade with move 2, capacity 5, and production 7')
    })

    describe('Deorbit Barrage', () => {
      test.todo('ACTION: exhaust and spend resources to roll dice against ground forces on a planet up to 2 systems from asteroid field with ships')
    })
  })
})
