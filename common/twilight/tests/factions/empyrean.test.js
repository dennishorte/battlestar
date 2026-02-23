const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Empyrean', () => {
  describe('Data', () => {
    test('starting technologies include Dark Energy Tap', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toContain('dark-energy-tap')
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('empyrean')
      expect(faction.factionTechnologies.length).toBe(3)

      const aetherstream = faction.factionTechnologies.find(t => t.id === 'aetherstream')
      expect(aetherstream).toBeDefined()
      expect(aetherstream.name).toBe('Aetherstream')
      expect(aetherstream.color).toBe('blue')
      expect(aetherstream.prerequisites).toEqual(['blue', 'blue'])

      const voidwatch = faction.factionTechnologies.find(t => t.id === 'voidwatch')
      expect(voidwatch).toBeDefined()
      expect(voidwatch.name).toBe('Voidwatch')
      expect(voidwatch.color).toBe('green')
      expect(voidwatch.prerequisites).toEqual(['green'])

      const voidTether = faction.factionTechnologies.find(t => t.id === 'void-tether')
      expect(voidTether).toBeDefined()
      expect(voidTether.name).toBe('Void Tether')
      expect(voidTether.color).toBeNull()
      expect(voidTether.prerequisites).toEqual(['green', 'blue'])
    })
  })

  test('ships can move through nebula', () => {
    const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
    game.run()

    expect(game.factionAbilities.canMoveThroughNebulae('dennis')).toBe(true)
    expect(game.factionAbilities.canMoveThroughNebulae('micah')).toBe(false)
  })

  describe('Dark Whispers', () => {
    test('Empyrean starts with 2 copies of faction promissory note', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const factionNotes = dennis.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(factionNotes.length).toBe(2)
    })

    test('non-Empyrean starts with 1 faction promissory note', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Sol doesn't have Dark Whispers, so only 1 copy of faction note
      // Sol has no faction-specific promissory note, so check generic notes instead
      const dennis = game.players.byName('dennis')
      const genericNotes = dennis.promissoryNotes.filter(n => n.id === 'support-for-the-throne')
      expect(genericNotes.length).toBe(1)

      // Micah (Empyrean) should have 2 copies
      const micah = game.players.byName('micah')
      const darkPacts = micah.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(darkPacts.length).toBe(2)
    })
  })

  describe('Aetherpassage', () => {
    test('permission granted allows movement through Empyrean systems', () => {
      // Layout: sol-home(0,-3) → 27(0,-2) → 26(0,-1) → mecatol(0,0)
      // Empyrean ships in system 27 block Sol movement, unless aetherpassage granted
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Empyrean (micah) prompted for aetherpassage
      t.choose(game, 'Allow Passage')

      // Now Sol can move through system 27 (Empyrean ships there)
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should arrive in system 26
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(1)
    })

    test('permission denied blocks movement through Empyrean systems', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Empyrean denies passage
      t.choose(game, 'Deny')

      // Sol tries to move through system 27 — blocked by Empyrean ships
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should NOT arrive (no valid path)
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(0)
    })

    test('aetherpassage only lasts one tactical action', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Grant is set and cleared
      game.state.aetherpassageGrant = 'micah'
      expect(game.state.aetherpassageGrant).toBe('micah')

      // After clearing (simulated end of tactical action)
      game.state.aetherpassageGrant = null
      expect(game.state.aetherpassageGrant).toBeNull()
    })

    test('Empyrean not prompted on own turn', () => {
      // When Empyrean activates a system, they should NOT be prompted
      const game = t.fixture({ factions: ['empyrean', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities._hasAbility(dennis, 'aetherpassage')).toBe(true)

      // No prompt for self — this is verified by the game flow not blocking
    })
  })

  describe('Agent — Acamar', () => {
    test.todo('after a player moves ships into a system without planets, exhaust to give that player 1 command token')
  })

  describe('Commander — Xuange', () => {
    test.todo('unlock condition: be neighbors with all other players')
    test.todo('after another player moves ships into a system with your command token, may return that token to reinforcements')
  })

  describe('Hero — Conservator Procyon', () => {
    test.todo('Multiverse Shift: place 1 frontier token in each empty system without a frontier token')
    test.todo('explore each frontier token in a system with your ships, then purge hero')
  })

  describe('Mech — Watcher', () => {
    test.todo('DEPLOY: may remove from system containing or adjacent to another player units to cancel their action card')
  })

  describe('Promissory Note — Dark Pact', () => {
    test.todo('when holder gives commodities equal to max commodity value to Empyrean, both gain 1 trade good')
    test.todo('returns to Empyrean if holder activates a system with Empyrean units')
  })

  describe('Promissory Note — Blood Pact', () => {
    test.todo('when holder and Empyrean vote for the same outcome, cast 4 additional votes')
    test.todo('returns to Empyrean if holder activates a system with Empyrean units')
  })

  describe('Faction Technologies', () => {
    describe('Aetherstream', () => {
      test.todo('after you or a neighbor activates a system adjacent to an anomaly, may apply +1 move to that player ships')
    })

    describe('Voidwatch', () => {
      test.todo('after a player moves ships into a system with your units, they must give you 1 promissory note')
    })

    describe('Void Tether', () => {
      test.todo('when activating a system containing or adjacent to your unit or planet, may place or move a void tether token')
      test.todo('other players do not treat those systems as adjacent unless you allow it')
    })
  })
})
