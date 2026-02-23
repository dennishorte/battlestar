const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Embers of Muaat', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['plasma-scoring']))
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction techs are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('embers-of-muaat')
      expect(faction.factionTechnologies.length).toBe(3)

      const magmus = faction.factionTechnologies.find(t => t.id === 'magmus-reactor')
      expect(magmus.color).toBe('red')
      expect(magmus.prerequisites).toEqual(['red', 'red'])
      expect(magmus.unitUpgrade).toBeNull()

      const warSun = faction.factionTechnologies.find(t => t.id === 'prototype-war-sun-ii')
      expect(warSun.color).toBe('unit-upgrade')
      expect(warSun.prerequisites).toEqual(['red', 'red', 'red', 'yellow'])
      expect(warSun.unitUpgrade).toBe('war-sun')

      const stellar = faction.factionTechnologies.find(t => t.id === 'stellar-genesis')
      expect(stellar.color).toBeNull()
      expect(stellar.prerequisites).toEqual(['red', 'yellow'])
      expect(stellar.unitUpgrade).toBeNull()
    })
  })

  describe('Star Forge', () => {
    test('spends strategy token to place fighters in war sun system', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action > Star Forge
      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')

      // Choose 2 Fighters
      t.choose(game, '2 Fighters')

      // War sun is in muaat-home, auto-selects system
      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      // Started with war-sun + 2 fighters, now + 2 fighters = war-sun + 4 fighters
      expect(spaceUnits).toEqual(['fighter', 'fighter', 'fighter', 'fighter', 'war-sun'])

      // Should have spent 1 strategy token
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('can place 1 destroyer instead of fighters', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')
      t.choose(game, '1 Destroyer')

      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['destroyer', 'fighter', 'fighter', 'war-sun'])
    })
  })

  describe('Gashlai Physiology', () => {
    test('ships can move through supernova systems', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()

      // Test the canMoveThroughSupernovae method directly
      expect(game.factionAbilities.canMoveThroughSupernovae('dennis')).toBe(true)
      expect(game.factionAbilities.canMoveThroughSupernovae('micah')).toBe(false)
    })
  })

  describe('Agent — Umbat', () => {
    test.todo('exhaust to let a player produce up to 2 units (cost 4 or less) in a war sun or flagship system')
  })

  describe('Commander — Magmus', () => {
    test('gains 1 trade good after spending strategy token on secondary', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Micah (Hacan) has diplomacy(2), goes first due to lower number
      // Wait — leadership is 1, diplomacy is 2. Dennis picked leadership, micah picked diplomacy.
      // Leadership(1) is lower, so dennis goes first.

      // Dennis uses leadership (primary: gain 3 command tokens)
      t.choose(game, 'Strategic Action')
      // Micah is prompted for leadership secondary
      t.choose(game, 'Use Secondary')

      // Micah spent 1 strategy token. But we care about Dennis (Muaat).
      // Micah goes next: micah uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')  // micah: diplomacy primary, protect hacan-home
      // Dennis is prompted for diplomacy secondary
      t.choose(game, 'Use Secondary')

      // Dennis spent 1 strategy token for the secondary → commander triggers → +1 TG
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
      // Started with 2 strategy, spent 1 for secondary = 1
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('does not gain trade good when commander is locked', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          // Remove the war sun so commander does not auto-unlock
          units: {
            'muaat-home': {
              space: ['fighter', 'fighter'],
              'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership (primary)
      t.choose(game, 'Strategic Action')
      // Micah uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Micah uses diplomacy (primary)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      // Dennis uses diplomacy secondary (spends strategy token)
      t.choose(game, 'Use Secondary')

      // Commander is locked — no TG gain
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
      expect(dennis.commandTokens.strategy).toBe(1)
    })
  })

  describe("Hero — Adjudicator Ba'al", () => {
    test.todo('NOVA SEED: destroy all other units in system and replace tile with Muaat supernova')
    test.todo('hero is purged after use')
  })

  describe('Mech — Ember Colossus', () => {
    test.todo('DEPLOY: when Star Forge is used in this or adjacent system, place 1 infantry with this mech')
  })

  describe('Promissory Note — Fires of the Gashlai', () => {
    test.todo('remove 1 Muaat fleet token to gain war sun unit upgrade technology')
    test.todo('returns to Muaat player after use')
  })

  describe('Faction Technologies', () => {
    test.todo('Magmus Reactor: ships can move into supernovas and gain 1 trade good on production near war sun or supernova')
    test.todo('Prototype War Sun II: war sun gets move 3 and cost 10')
    test.todo('Stellar Genesis: place Avernus token and move it with war suns')
  })
})
