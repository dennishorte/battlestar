const t = require('../testutil.js')
const res = require('../res/index.js')

describe('Faction Assignment', () => {
  describe('pre-set factions', () => {
    test('assigns factions in order when explicitly specified', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'clan-of-saar'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.factionId).toBe('yin-brotherhood')
      expect(micah.factionId).toBe('clan-of-saar')
    })
  })

  describe('random factions', () => {
    test('assigns factions from shuffled pool when no factions specified', () => {
      const game = t.fixture({ factions: [] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      const allFactionIds = res.getAllFactionIds()

      // Both players should have valid factions
      expect(allFactionIds).toContain(dennis.factionId)
      expect(allFactionIds).toContain(micah.factionId)
      // Players should have different factions
      expect(dennis.factionId).not.toBe(micah.factionId)
    })

    test('different seeds produce different faction assignments', () => {
      const game1 = t.fixture({ factions: [], seed: 'seed_a' })
      game1.run()
      const game2 = t.fixture({ factions: [], seed: 'seed_b' })
      game2.run()

      const factions1 = game1.players.all().map(p => p.factionId)
      const factions2 = game2.players.all().map(p => p.factionId)

      // Different seeds should (almost certainly) produce different assignments
      expect(factions1).not.toEqual(factions2)
    })

    test('same seed produces same faction assignments', () => {
      const game1 = t.fixture({ factions: [], seed: 'deterministic' })
      game1.run()
      const game2 = t.fixture({ factions: [], seed: 'deterministic' })
      game2.run()

      const factions1 = game1.players.all().map(p => p.factionId)
      const factions2 = game2.players.all().map(p => p.factionId)

      expect(factions1).toEqual(factions2)
    })

    test('players are fully initialized with random factions', () => {
      const game = t.fixture({ factions: [] })
      game.run()

      // Both players should have starting techs and units from their assigned faction
      for (const player of game.players.all()) {
        const faction = res.getFaction(player.factionId)
        expect(faction).toBeTruthy()

        // Starting technologies should be present
        for (const techId of faction.startingTechnologies) {
          expect(player.hasTechnology(techId)).toBe(true)
        }

        // Home system should have units
        const homeSystem = faction.homeSystem
        const spaceUnits = game.state.units[homeSystem].space
          .filter(u => u.owner === player.name)
        expect(spaceUnits.length).toBeGreaterThan(0)
      }
    })
  })

  describe('faction selection', () => {
    test('players choose factions when randomFactions is false', () => {
      const game = t.fixture({ factions: [], randomFactions: false })
      game.run()

      // First player (dennis) picks a faction
      const choices = t.currentChoices(game)
      expect(choices.length).toBe(res.getAllFactionIds().length)
      expect(choices).toContain('Federation of Sol')
      expect(choices).toContain('Emirates of Hacan')

      t.choose(game, 'Federation of Sol')

      // Second player (micah) picks — Federation of Sol should be gone
      const choices2 = t.currentChoices(game)
      expect(choices2).not.toContain('Federation of Sol')
      expect(choices2.length).toBe(res.getAllFactionIds().length - 1)

      t.choose(game, 'Emirates of Hacan')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.factionId).toBe('federation-of-sol')
      expect(micah.factionId).toBe('emirates-of-hacan')
    })

    test('selected factions are fully initialized', () => {
      const game = t.fixture({ factions: [], randomFactions: false })
      game.run()

      t.choose(game, 'Barony of Letnev')
      t.choose(game, 'The Naalu Collective')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Dennis: Barony of Letnev
      expect(dennis.factionId).toBe('barony-of-letnev')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)

      // Micah: Naalu Collective
      expect(micah.factionId).toBe('naalu-collective')
      expect(micah.hasTechnology('neural-motivator')).toBe(true)
      expect(micah.hasTechnology('sarween-tools')).toBe(true)

      // Both should have units in their home systems
      const letnevUnits = game.state.units['letnev-home'].space
        .filter(u => u.owner === 'dennis')
      expect(letnevUnits.length).toBeGreaterThan(0)

      const naaluUnits = game.state.units['naalu-home'].space
        .filter(u => u.owner === 'micah')
      expect(naaluUnits.length).toBeGreaterThan(0)
    })

    test('faction selection works with 3 players', () => {
      const game = t.fixture({ numPlayers: 3, factions: [], randomFactions: false })
      game.run()

      t.choose(game, 'The Arborec')
      t.choose(game, 'The Winnu')

      // Third player should not see Arborec or Winnu
      const choices3 = t.currentChoices(game)
      expect(choices3).not.toContain('The Arborec')
      expect(choices3).not.toContain('The Winnu')
      expect(choices3.length).toBe(res.getAllFactionIds().length - 2)

      t.choose(game, 'The Nomad')

      expect(game.players.byName('dennis').factionId).toBe('arborec')
      expect(game.players.byName('micah').factionId).toBe('winnu')
      expect(game.players.byName('scott').factionId).toBe('nomad')
    })
  })
})
