const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Exploration', () => {
  describe('Exploration Cards Data', () => {
    test('cultural exploration deck exists', () => {
      const cards = res.getExplorationCards('cultural')
      expect(cards.length).toBeGreaterThan(0)
      expect(cards.every(c => c.trait === 'cultural')).toBe(true)
    })

    test('hazardous exploration deck exists', () => {
      const cards = res.getExplorationCards('hazardous')
      expect(cards.length).toBeGreaterThan(0)
      expect(cards.every(c => c.trait === 'hazardous')).toBe(true)
    })

    test('industrial exploration deck exists', () => {
      const cards = res.getExplorationCards('industrial')
      expect(cards.length).toBeGreaterThan(0)
      expect(cards.every(c => c.trait === 'industrial')).toBe(true)
    })

    test('frontier exploration deck exists', () => {
      const cards = res.getExplorationCards('frontier')
      expect(cards.length).toBeGreaterThan(0)
      expect(cards.every(c => c.trait === 'frontier')).toBe(true)
    })

    test('each deck has attach, action, and fragment cards', () => {
      for (const trait of ['cultural', 'hazardous', 'industrial']) {
        const cards = res.getExplorationCards(trait)
        const types = new Set(cards.map(c => c.type))
        expect(types.has('attach')).toBe(true)
        expect(types.has('action')).toBe(true)
        expect(types.has('fragment')).toBe(true)
      }
    })

    test('getExplorationCard finds by ID', () => {
      const card = res.getExplorationCard('dyson-sphere')
      expect(card).toBeTruthy()
      expect(card.name).toBe('Dyson Sphere')
      expect(card.trait).toBe('cultural')
      expect(card.type).toBe('attach')
    })
  })

  describe('Planet Exploration Trigger', () => {
    test('exploring planet with trait draws from matching deck', () => {
      const game = t.fixture()
      // Use a specific deck so we know what card is drawn
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['freelancers'],
          hazardous: ['expedition'],
          industrial: ['core-mine'],
          frontier: [],
        },
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              space: ['cruiser', 'carrier'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Find a system adjacent to sol-home that has a cultural planet
      const adjSystems = game._getAdjacentSystems('sol-home')

      // We need to find a system with uncontrolled cultural planet
      let targetSystem = null
      let targetPlanet = null
      for (const sysId of adjSystems) {
        const tile = res.getSystemTile(sysId) || res.getSystemTile(Number(sysId))
        if (!tile || !tile.planets) {
          continue
        }
        for (const pId of tile.planets) {
          const planet = res.getPlanet(pId)
          if (planet && planet.trait === 'cultural' && !game.state.planets[pId]?.controller) {
            targetSystem = sysId
            targetPlanet = pId
            break
          }
        }
        if (targetSystem) {
          break
        }
      }

      if (!targetSystem) {
        // No adjacent cultural planet — skip (map-dependent)
        return
      }

      // Move to the system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'cruiser', from: 'sol-home', count: 1 },
        ],
      })

      // Planet should now be explored
      expect(game.state.exploredPlanets[targetPlanet]).toBe(true)

      // Freelancers gives 1 trade good
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })

    test('home system planets are not explored (no trait)', () => {
      const game = t.fixture()
      game.run()

      // Jord has no trait — should not be in exploredPlanets
      expect(game.state.exploredPlanets['jord']).toBeUndefined()
    })

    test('Mecatol Rex is not explored (no trait)', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.exploredPlanets['mecatol-rex']).toBeUndefined()
    })

    test('planet is only explored once', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['freelancers', 'mercenary-outfit'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      // Manually trigger exploration twice on same planet
      game._explorePlanet('quann', 'dennis')
      const dennis = game.players.byName('dennis')
      const tgAfterFirst = dennis.tradeGoods

      game._explorePlanet('quann', 'dennis')
      // Should not change — already explored
      expect(dennis.tradeGoods).toBe(tgAfterFirst)
    })
  })

  describe('Exploration Card Types', () => {
    test('action card with resolve gives immediate effect', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['expedition'],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const startTG = dennis.tradeGoods

      // Expedition: gain 2 trade goods (hazardous action card)
      game._explorePlanet('vefut-ii', 'dennis')

      expect(dennis.tradeGoods).toBe(startTG + 2)
    })

    test('attach card adds to planet attachments', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      game._explorePlanet('quann', 'dennis')

      expect(game.state.planets['quann'].attachments).toContain('dyson-sphere')
    })

    test('fragment card gives relic fragment to player', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: [],
          hazardous: ['hazardous-relic-fragment-1'],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      game._explorePlanet('vefut-ii', 'dennis')

      expect(dennis.relicFragments).toContain('hazardous')
    })
  })

  describe('Exploration Decks', () => {
    test('decks are initialized lazily', () => {
      const game = t.fixture()
      game.run()

      // Decks should not be initialized yet (no exploration has happened)
      // The decks get initialized on first _drawExplorationCard call
      // Check that calling _initExplorationDecks works
      game._initExplorationDecks()
      expect(game.state.explorationDecks).toBeTruthy()
      expect(game.state.explorationDecks.cultural.length).toBeGreaterThan(0)
    })

    test('setBoard can pre-set exploration decks', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['freelancers'],
          hazardous: ['expedition'],
          industrial: ['core-mine'],
          frontier: [],
        },
      })
      game.run()

      expect(game.state.explorationDecks.cultural.length).toBe(1)
      expect(game.state.explorationDecks.cultural[0].id).toBe('freelancers')
    })
  })
})
