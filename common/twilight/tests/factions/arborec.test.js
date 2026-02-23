const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Arborec', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['magen-defense-grid']))
    })

    test('starting units', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['arborec-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'fighter', 'fighter'])

      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(nestphar).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('Letani Warrior I infantry has production ability', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.unitOverrides.infantry.name).toBe('Letani Warrior I')
      expect(faction.unitOverrides.infantry.combat).toBe(8)
      expect(faction.unitOverrides.infantry.abilities).toContain('production-1')
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.factionTechnologies.length).toBe(3)

      const lw2 = faction.factionTechnologies.find(ft => ft.id === 'letani-warrior-ii')
      expect(lw2.unitUpgrade).toBe('infantry')
      expect(lw2.prerequisites).toEqual(['green', 'green'])

      const bio = faction.factionTechnologies.find(ft => ft.id === 'bioplasmosis')
      expect(bio.color).toBe('green')
      expect(bio.prerequisites).toEqual(['green', 'green'])

      const psycho = faction.factionTechnologies.find(ft => ft.id === 'psychospore')
      expect(psycho.prerequisites).toEqual(['red', 'green'])
    })

    test('mech has sustain damage and production', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.mech.name).toBe('Letani Behemoth')
      expect(faction.mech.cost).toBe(2)
      expect(faction.mech.combat).toBe(6)
      expect(faction.mech.abilities).toContain('sustain-damage')
      expect(faction.mech.abilities).toContain('production-2')
      expect(faction.mech.abilities).toContain('planetary-shield')
    })
  })

  describe('Mitosis', () => {
    test('places 1 infantry on controlled planet during status phase', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: choose planet
      t.choose(game, 'nestphar')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Arborec should have 1 more infantry on nestphar
      // Started with 4 infantry + 1 mitosis = 5
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(nestphar.length).toBe(5)
    })

    test('can pass on Mitosis', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: pass
      t.choose(game, 'Pass')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Infantry count unchanged — still 4
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(nestphar.length).toBe(4)
    })
  })

  describe('Mech — Letani Behemoth', () => {
    test.todo('DEPLOY: during Mitosis, may replace infantry with mech instead of placing infantry')
  })

  describe('Agent — Letani Ospha', () => {
    test.todo('after a player activates a system with their structure, may exhaust to let them replace infantry with mech')
    test.todo('exhausted agent cannot be used')
  })

  describe('Commander — Dirzuga Rophal', () => {
    test.todo('unlock condition: have 12 ground forces on planets you control')
    test.todo('when producing infantry, place equal number of additional infantry on active system or space dock planet')
  })

  describe('Hero — Letani Miasmiala', () => {
    test.todo('ULTRASONIC EMITTER: produce any number of units in systems with ground forces, then purge')
  })

  describe('Promissory Note — Stymie', () => {
    test.todo('after another player moves ships into system with your units, place command token from their reinforcements')
    test.todo('returns to Arborec player after use')
  })

  describe('Faction Technologies', () => {
    describe('Letani Warrior II', () => {
      test.todo('infantry upgrade with production-2 and combat 7')
      test.todo('after destroyed, roll die — on 6+, revive to home system next turn')
    })

    describe('Bioplasmosis', () => {
      test.todo('at end of status phase, may move infantry between controlled planets in same or adjacent systems')
    })

    describe('Psychospore', () => {
      test.todo('ACTION: exhaust to remove command token from system with infantry, place 1 infantry')
    })
  })
})
