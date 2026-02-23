const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Council Keleres', () => {
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
})
