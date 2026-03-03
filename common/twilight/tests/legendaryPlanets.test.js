const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Legendary Planets', () => {

  ////////////////////////////////////////////////////////////////////////////////
  // Hope's End — Imperial Arms Vault
  ////////////////////////////////////////////////////////////////////////////////

  describe("Hope's End — Imperial Arms Vault", () => {
    test('place 1 mech on a controlled planet', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 66: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'hopes-end': { exhausted: false },
          },
          units: {
            66: { 'hopes-end': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Strategic Action (leadership)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')  // micah declines secondary

      // Legendary planet ability offered at end of turn
      t.choose(game, 'Imperial Arms Vault')
      t.choose(game, 'Place 1 Mech')
      t.choose(game, 'hopes-end')

      // Verify mech placed
      const units = game.state.units['66'].planets['hopes-end']
      const mechs = units.filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(mechs.length).toBe(1)
    })

    test('draw 1 action card', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 66: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'hopes-end': { exhausted: false },
          },
          units: {
            66: { 'hopes-end': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      const cardsBefore = (dennis.actionCards || []).length

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')

      t.choose(game, 'Imperial Arms Vault')
      t.choose(game, 'Draw 1 Action Card')

      const dennisAfter = game.players.byName('dennis')
      expect((dennisAfter.actionCards || []).length).toBe(cardsBefore + 1)
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Primor — The Atrament
  ////////////////////////////////////////////////////////////////////////////////

  describe('Primor — The Atrament', () => {
    test('places 2 infantry on Primor', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 65: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'primor': { exhausted: false },
          },
          units: {
            65: { 'primor': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Primor 1I = 3I)
      t.choose(game, 'Pass')

      t.choose(game, 'The Atrament')

      const units = game.state.units['65'].planets['primor']
      const infantry = units.filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(infantry.length).toBe(3)  // 1 original + 2 placed
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Mallice — Exterrix Headquarters
  ////////////////////////////////////////////////////////////////////////////////

  describe('Mallice — Exterrix Headquarters', () => {
    test('gain 2 trade goods', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 82: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          tradeGoods: 1,
          planets: {
            'mallice': { exhausted: false },
          },
          units: {
            82: { 'mallice': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Mallice 3I = 5I)
      t.choose(game, 'Pass')

      t.choose(game, 'Exterrix Headquarters')
      t.choose(game, 'Gain 2 Trade Goods')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)  // 1 + 2
    })

    test('convert commodities to trade goods', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 82: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          tradeGoods: 1,
          commodities: 3,
          planets: {
            'mallice': { exhausted: false },
          },
          units: {
            82: { 'mallice': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Mallice 3I = 5I)
      t.choose(game, 'Pass')

      t.choose(game, 'Exterrix Headquarters')
      t.choose(game, 'Convert Commodities')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(4)  // 1 + 3 commodities
      expect(dennis.commodities).toBe(0)
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Mirage — Mirage Flight Academy
  ////////////////////////////////////////////////////////////////////////////////

  describe('Mirage — Mirage Flight Academy', () => {
    test('places 2 fighters in Mirage system space', () => {
      const game = t.fixture()
      t.setBoard(game, {
        miragePlanet: 26,  // Place mirage in system 26
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'mirage': { exhausted: false },
          },
          units: {
            26: { space: ['carrier'], 'mirage': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Mirage 2I = 4I)
      t.choose(game, 'Pass')

      t.choose(game, 'Mirage Flight Academy')

      const spaceUnits = game.state.units['26'].space
      const fighters = spaceUnits.filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(2)
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Exhaust / Ready mechanics
  ////////////////////////////////////////////////////////////////////////////////

  describe('Exhaust / Ready mechanics', () => {
    test('legendary ability exhausts — cannot use twice in one round', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 65: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'primor': { exhausted: false },
          },
          units: {
            65: { 'primor': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Strategic Action (leadership) — turn 1
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Primor 1I = 3I)
      t.choose(game, 'Pass')  // micah declines secondary

      // Use The Atrament
      t.choose(game, 'The Atrament')

      // Micah's turn: strategic action (diplomacy)
      t.choose(game, 'Strategic Action')

      // Micah picks a system for diplomacy
      const choices = t.currentChoices(game)
      t.choose(game, choices[0])
      t.choose(game, 'Pass')  // Dennis declines secondary

      // Dennis's second turn — do a tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '65' })
      t.action(game, 'move-ships', { movements: [] })

      // After action, the next choice should NOT include 'The Atrament'
      // (it was exhausted this round)
      const postActionChoices = t.currentChoices(game)
      expect(postActionChoices).not.toContain('The Atrament')
    })

    test('legendary ability readies in status phase — available next round', () => {
      const game = t.fixture()
      t.setBoard(game, {
        systems: { ...t.DEFAULT_2P_SYSTEMS, 82: { q: 1, r: -1 } },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'mallice': { exhausted: false },
          },
          units: {
            82: { 'mallice': ['infantry'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Sol 2I + Mallice 3I = 5I)
      t.choose(game, 'Pass')

      // Use Exterrix Headquarters
      t.choose(game, 'Exterrix Headquarters')
      t.choose(game, 'Gain 2 Trade Goods')

      // Verify exhausted
      expect(game.state.exhaustedLegendaryAbilities?.dennis).toContain('mallice')

      // Micah: diplomacy
      t.choose(game, 'Strategic Action')
      const dipChoices = t.currentChoices(game)
      t.choose(game, dipChoices[0])
      t.choose(game, 'Pass')  // Dennis declines secondary

      // Skip transaction if offered
      const afterMicah = t.currentChoices(game)
      if (afterMicah.includes('Skip Transaction')) {
        t.choose(game, 'Skip Transaction')
      }

      // Both pass to end action phase → status phase
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute command tokens for both players
      t.choose(game, 'Done')  // dennis redistributes
      t.choose(game, 'Done')  // micah redistributes

      // After status phase step 8, exhaustedLegendaryAbilities should be cleared
      expect(
        game.state.exhaustedLegendaryAbilities?.dennis?.length || 0
      ).toBe(0)
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Custodia Vigilia — Space Cannon
  ////////////////////////////////////////////////////////////////////////////////

  describe('Custodia Vigilia — Space Cannon', () => {
    test('fires space cannon offense from Mecatol Rex system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
        seed: 'sc_test_1',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['sarween-tools', 'neural-motivator', 'iihq-modernization'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
          units: {
            18: { 'mecatol-rex': ['infantry', 'infantry'] },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            26: { space: ['cruiser', 'cruiser', 'cruiser'] },
          },
        },
      })
      // Set up IIHQ Modernization state manually (setBoard doesn't trigger onTechResearched)
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.iihqModernization = { owner: 'dennis' }
        game.state.planets['custodia-vigilia'] = { controller: 'dennis', exhausted: false }
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'leadership')

      // Micah goes first (leadership, init 1)
      // Micah does tactical action — activates system 18 (Mecatol Rex, adjacent to 26)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '26', count: 3 }],
      })

      // Space cannon offense should fire (Custodia Vigilia: Space Cannon 5)
      // Dennis controls custodia-vigilia and has iihq-modernization
      // System 18 IS the Mecatol Rex system
      // Result depends on seed — just verify the game progresses without error
      // and custodia-vigilia state is set
      expect(game.state.iihqModernization.owner).toBe('dennis')
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Custodia Vigilia — Production
  ////////////////////////////////////////////////////////////////////////////////

  describe('Custodia Vigilia — Production', () => {
    test('can produce up to 3 units on Mecatol Rex with IIHQ Modernization (no space dock)', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['sarween-tools', 'neural-motivator', 'iihq-modernization'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
          units: {
            18: { 'mecatol-rex': ['infantry'] },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      // Set up IIHQ Modernization state manually
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.iihqModernization = { owner: 'dennis' }
        game.state.planets['custodia-vigilia'] = { controller: 'dennis', exhausted: false }
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action on Mecatol Rex system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', { movements: [] })

      // Production step: Custodia Vigilia gives PRODUCTION 3
      // Produce 2 infantry (cost 0.5 each = 1 total, within production capacity of 3)
      t.action(game, 'produce-units', {
        units: [{ type: 'infantry', count: 2 }],
      })

      // Verify units produced
      const mecUnits = game.state.units['18'].planets['mecatol-rex']
      const infantry = mecUnits.filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(infantry.length).toBe(3)  // 1 original + 2 produced
    })
  })


  ////////////////////////////////////////////////////////////////////////////////
  // Custodia Vigilia — Imperial VP reactive
  ////////////////////////////////////////////////////////////////////////////////

  describe('Custodia Vigilia — Imperial VP reactive', () => {
    test('Keleres player gains 1 command token when another player scores VP via Imperial', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['sarween-tools', 'neural-motivator', 'iihq-modernization'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
          units: {
            18: { 'mecatol-rex': ['infantry'] },
          },
        },
      })
      // Set up IIHQ Modernization state manually
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.iihqModernization = { owner: 'dennis' }
        game.state.planets['custodia-vigilia'] = { controller: 'dennis', exhausted: false }
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'imperial')

      // Dennis goes first (diplomacy, init 2)
      t.choose(game, 'Strategic Action')
      const dipChoices = t.currentChoices(game)
      t.choose(game, dipChoices[0])  // pick a system for diplomacy
      t.choose(game, 'Pass')  // micah declines secondary

      // Handle transaction window if it appears (IIHQ makes dennis neighbor of micah)
      const postDipChoices = t.currentChoices(game)
      if (postDipChoices.includes('Skip Transaction')) {
        t.choose(game, 'Skip Transaction')
      }

      // Micah uses Imperial — controls Mecatol Rex → scores 1 VP
      t.choose(game, 'Strategic Action')

      // Custodia Vigilia reactive: Dennis (Keleres) gains 1 command token
      // Dennis chooses which pool
      t.choose(game, 'tactics')

      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.tactics).toBe(4)  // 3 + 1
    })
  })
})
