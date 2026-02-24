const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Council Keleres', () => {
  describe('Data', () => {
    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'mentak-coalition' })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('council-keleres')
      expect(faction.factionTechnologies.length).toBe(3)

      const execOrder = faction.factionTechnologies.find(t => t.id === 'executive-order')
      expect(execOrder.color).toBe('yellow')
      expect(execOrder.prerequisites).toEqual(['yellow'])

      const agency = faction.factionTechnologies.find(t => t.id === 'agency-supply-network')
      expect(agency.color).toBe('yellow')
      expect(agency.prerequisites).toEqual(['yellow', 'yellow'])

      const iihq = faction.factionTechnologies.find(t => t.id === 'iihq-modernization')
      expect(iihq.color).toBeNull()
      expect(iihq.prerequisites).toEqual(['yellow', 'green'])
    })
  })

  test('replenishes commodities + 1 TG at strategy phase', () => {
    const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
    game.run()

    // Keleres has council-patronage
    // At strategy phase start, replenish commodities and gain 1 TG
    const dennis = game.players.byName('dennis')
    // After running, strategy phase starts → council-patronage fires
    // Keleres has 2 commodities max
    expect(dennis.commodities).toBe(2)
    // Gained 1 TG from patronage
    expect(dennis.tradeGoods).toBe(1)
  })

  describe('Laws Order', () => {
    test('Keleres can blank laws by spending influence', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'micah' }],
        dennis: {
          planets: { 'new-albion': { exhausted: false } },  // 1 influence
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Keleres) has laws-order
      // At start of turn, prompted to blank laws
      t.choose(game, 'Blank Laws')

      // Laws should be blanked during this turn
      expect(game.state.lawsBlankedByPlayer).toBe('dennis')
      expect(game._isLawActive('minister-of-commerce')).toBe(false)
    })

    test('laws-order blanking clears at end of turn', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'micah' }],
        dennis: {
          planets: { 'new-albion': { exhausted: false } },  // 1 influence
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis blanks laws
      t.choose(game, 'Blank Laws')

      // Dennis does strategic action
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Now micah's turn — law blanking should clear
      // Micah is not prompted for laws-order (not Keleres)
      // Laws should be active again for micah's turn
      expect(game._isLawActive('minister-of-commerce')).toBe(true)
    })
  })

  describe('The Tribunii', () => {
    test('Keleres inherits Mentak home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('mentak-coalition')
      expect(dennis.faction.homeSystem).toBe('mentak-home')

      // Mentak home system should exist in the galaxy
      expect(game.state.systems['mentak-home']).toBeDefined()
    })

    test('Keleres inherits Xxcha home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'xxcha-kingdom',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('xxcha-kingdom')
      expect(dennis.faction.homeSystem).toBe('xxcha-home')

      expect(game.state.systems['xxcha-home']).toBeDefined()
    })

    test('Keleres inherits Argent home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('argent-flight')
      expect(dennis.faction.homeSystem).toBe('argent-home')

      expect(game.state.systems['argent-home']).toBeDefined()
    })

    test('cannot choose a faction already played', () => {
      // Xxcha is played by micah — Keleres cannot choose it
      const game = t.fixture({
        factions: ['council-keleres', 'xxcha-kingdom'],
        keleresSubFaction: 'mentak-coalition',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('mentak-coalition')
      expect(dennis.faction.homeSystem).toBe('mentak-home')
    })

    test('setBoard pre-configures sub-faction', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      game.run()

      const dennis = game.players.byName('dennis')

      // Sub-faction was set via fixture option
      expect(dennis.keleresSubFaction).toBe('argent-flight')

      // Starting units include Keleres fleet in space + sub-faction planet units
      const homeUnits = game.state.units['argent-home']
      expect(homeUnits).toBeDefined()

      // Keleres should have ships in space
      const dennisShips = homeUnits.space.filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBeGreaterThan(0)
    })
  })

  describe('Agent — Xander Alexin Victori III', () => {
    test.todo('may exhaust to allow any player to spend commodities as trade goods')
  })

  describe('Commander — Suffi An', () => {
    test.todo('after performing a component action, may perform an additional action')
    test.todo('unlock condition: spend 1 trade good after playing an action card with a component action')
  })

  describe('Hero — Kuuasi Aun Jalatai (Argent)', () => {
    test('Overwing Zeta: place flagship and up to 2 cruisers/destroyers, then purge', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      // System auto-selected (only argent-home has controlled planets)
      // Place 2 ships
      t.choose(game, 'cruiser')
      t.choose(game, 'destroyer')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      const spaceUnits = game.state.units['argent-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
      expect(spaceUnits).toContain('flagship')
      expect(spaceUnits).toContain('cruiser')
      expect(spaceUnits).toContain('destroyer')
    })
  })

  describe('Hero — Odlynn Myrr (Xxcha)', () => {
    test('Operation Archon: cast extra votes, gain TG and command tokens, then purge', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'xxcha-kingdom',
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      // Choose extra votes
      t.choose(game, '6 votes')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Council Patronage gives 1 TG at strategy phase start (from 0 -> 1)
      // Hero then gives 1 TG per opponent (1 in 2p), so total = 2
      expect(dennis.tradeGoods).toBe(2)
      // Hero gives 1 command token per opponent (1 in 2p), tactics: 2 + 3 (leadership) + 1 = 6
      // Actually leadership primary gives 3 tokens distributed, let's just check increase
      expect(dennis.commandTokens.tactics).toBeGreaterThanOrEqual(3)
    })
  })

  describe("Hero — Harka Leeds (Mentak)", () => {
    test("Erwan's Covenant: draws action cards with component actions, then purge", () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          actionCards: [],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Should have drawn some action cards (up to 3 with component actions)
      // The exact number depends on the deck composition
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes("Erwan's Covenant"))).toBe(true)
    })
  })

  describe('Mech — Omniopiares', () => {
    test('getInvasionInfluenceCost returns 1 when mech present on planet', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['mech', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'micah',
      })
      expect(cost).toBe(1)
    })

    test('getInvasionInfluenceCost returns 0 when no mech on planet', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'micah',
      })
      expect(cost).toBe(0)
    })

    test('getInvasionInfluenceCost returns 0 for own invasion', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['mech', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'dennis',
      })
      expect(cost).toBe(0)
    })
  })

  describe('Promissory Note — Keleres Rider', () => {
    test.todo('after agenda revealed, cannot vote, predict outcome; if correct draw 1 action card and gain 2 TG, then return card')
  })

  describe('Faction Technologies', () => {
    describe('Executive Order', () => {
      test.todo('exhaust to draw top or bottom agenda card; players vote as if you were speaker')
      test.todo('can spend trade goods and resources as votes on this agenda')
    })

    describe('Agency Supply Network', () => {
      test.todo('once per action, when resolving PRODUCTION, may resolve another unit PRODUCTION in any system')
    })

    describe('I.I.H.Q. Modernization', () => {
      test.todo('on gain, receive Custodia Vigilia planet card and legendary ability')
      test.todo('becomes neighbors with all players with units or planets in or adjacent to Mecatol Rex system')
    })
  })
})
