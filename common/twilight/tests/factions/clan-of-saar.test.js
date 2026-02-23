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
      t.choose(game, 'Pass') // decline Captain Mendosa agent
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
    test('after activating a system, may exhaust to boost a ship to match highest move on board', () => {
      // Dennis (Saar) has carriers (move 1) and a cruiser (move 2).
      // Carrier at home can't normally reach system 26 (2 hops away).
      // Mendosa boosts carrier to move 2 (matching cruiser), allowing the move.
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'saar-home': {
              space: ['carrier', 'cruiser'],
              'lisis-ii': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)

      // Dennis activates system 26 (2 hops from home: home -> 27 -> 26)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Mendosa prompt should appear (carrier has move 1, cruiser has move 2)
      t.choose(game, 'Exhaust Captain Mendosa')

      // Move the carrier (now boosted to move 2) to system 26
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: 'saar-home', count: 1 }],
      })

      // Re-fetch player after game replays
      const dennisAfter = game.players.byName('dennis')
      expect(dennisAfter.isAgentReady()).toBe(false)

      // Carrier should have moved to system 26
      const carrierInTarget = game.state.units['26'].space
        .filter(u => u.owner === 'dennis' && u.type === 'carrier')
      expect(carrierInTarget.length).toBe(1)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'saar-home': {
              space: ['carrier', 'cruiser'],
              'lisis-ii': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 26 (2 hops)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // No Mendosa prompt should appear — agent is exhausted
      // Should go straight to move-ships
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Exhaust Captain Mendosa')
    })

    test('no prompt when no ships would benefit from boost', () => {
      // Dennis only has cruisers (move 2), which is already the highest on the board
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'saar-home': {
              space: ['cruiser', 'cruiser'],
              'lisis-ii': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 27 (adjacent)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // No Mendosa prompt — all ships already at highest move value
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Exhaust Captain Mendosa')
    })
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
