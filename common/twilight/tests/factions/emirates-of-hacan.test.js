const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Emirates of Hacan', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors', 'sarween-tools']))
    })

    test('starting units', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()

      const spaceUnits = game.state.units['hacan-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])

      const arretze = game.state.units['hacan-home'].planets['arretze']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(arretze).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('commodities is 6', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(6)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('emirates-of-hacan')
      expect(faction.factionTechnologies.length).toBe(3)
      expect(faction.factionTechnologies.map(t => t.id).sort()).toEqual(
        ['auto-factories', 'production-biomes', 'quantum-datahub-node']
      )
    })
  })

  describe('Guild Ships', () => {
    test('Hacan can trade with non-neighbors', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      const choices = t.currentChoices(game)
      expect(choices).toContain('micah')
    })

    test('non-Hacan cannot trade with non-neighbors', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Masters of Trade', () => {
    test('Hacan uses Trade secondary for free', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
      expect(micah.commandTokens.strategy).toBe(2)
    })

    test('non-Hacan pays strategy token for Trade secondary', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(4)
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe('Arbiters (Action Card Trading)', () => {
    test('canTradeActionCards returns true when Hacan is involved', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(true)
      expect(game.factionAbilities.canTradeActionCards(micah, dennis)).toBe(true)
    })

    test('action cards transfer correctly via Arbiters', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          actionCards: ['sabotage'],
          tradeGoods: 1,
        },
        micah: {
          actionCards: ['direct-hit'],
          tradeGoods: 1,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { actionCards: ['sabotage'] },
        requesting: { actionCards: ['direct-hit'] },
      })
      t.choose(game, 'Accept')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.actionCards.some(c => c.id === 'direct-hit')).toBe(true)
      expect(dennis.actionCards.some(c => c.id === 'sabotage')).toBe(false)
      expect(micah.actionCards.some(c => c.id === 'sabotage')).toBe(true)
      expect(micah.actionCards.some(c => c.id === 'direct-hit')).toBe(false)
    })

    test('non-Hacan cannot trade action cards', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'barony-of-letnev'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(false)
    })
  })

  describe('Agent — Carth of Golden Sands', () => {
    test.todo('exhaust agent to gain 2 commodities')
    test.todo('exhaust agent to replenish another player commodities')
  })

  describe('Commander — Gila the Silvertongue', () => {
    test.todo('spend trade goods for 2x votes during agenda')
  })

  describe('Hero — Harrugh Gefhara', () => {
    test.todo('Galactic Securities Net: reduce production cost to 0, then purge')
  })

  describe('Mech — Pride of Kenara', () => {
    test.todo('planet card can be traded in transaction')
  })

  describe('Promissory Note — Trade Convoys', () => {
    test.todo('holder can trade with non-neighbors')
  })

  describe('Faction Technologies', () => {
    test.todo('Production Biomes: exhaust and spend strategy token for 4 TG')
    test.todo('Quantum Datahub Node: swap strategy cards')
    test.todo('Auto-Factories: gain fleet token when producing 3+ non-fighter ships')
  })
})
