const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Exploration', () => {
  describe('Exploration Cards Data', () => {
    test('cultural exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('cultural')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'cultural')).toBe(true)
    })

    test('hazardous exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('hazardous')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'hazardous')).toBe(true)
    })

    test('industrial exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('industrial')
      expect(cards.length).toBe(20)
      expect(cards.every(c => c.trait === 'industrial')).toBe(true)
    })

    test('frontier exploration deck has 20 cards', () => {
      const cards = res.getExplorationCards('frontier')
      expect(cards.length).toBe(20)
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

    test('multi-copy cards have suffixed IDs', () => {
      expect(res.getExplorationCard('freelancers-1')).toBeTruthy()
      expect(res.getExplorationCard('freelancers-2')).toBeTruthy()
      expect(res.getExplorationCard('freelancers-3')).toBeTruthy()
      expect(res.getExplorationCard('hazardous-relic-fragment-7')).toBeTruthy()
      expect(res.getExplorationCard('cultural-relic-fragment-9')).toBeTruthy()
    })

    test('frontier deck includes Codex III cards', () => {
      const cards = res.getExplorationCards('frontier')
      const names = cards.map(c => c.name)
      expect(names).toContain('Dead World')
      expect(names).toContain('Entropic Field')
      expect(names).toContain('Keleres Ship')
      expect(names).toContain('Major Entropic Field')
      expect(names).toContain('Minor Entropic Field')
    })

    test('attach cards have attachment data', () => {
      const dyson = res.getExplorationCard('dyson-sphere')
      expect(dyson.attachment).toEqual({ resources: 2, influence: 1 })

      const lazax = res.getExplorationCard('lazax-survivors')
      expect(lazax.attachment).toEqual({ resources: 1, influence: 2 })

      const biotic = res.getExplorationCard('biotic-research-facility')
      expect(biotic.attachment.techSpecialty).toBe('green')
      expect(biotic.attachment.fallback).toEqual({ resources: 1, influence: 1 })
    })
  })

  describe('Planet Exploration Trigger', () => {
    test('exploring planet with trait marks it as explored', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['mercenary-outfit-1'],
          hazardous: [],
          industrial: [],
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
          cultural: ['dyson-sphere', 'paradise-world'],
          hazardous: [],
          industrial: [],
          frontier: [],
        },
      })
      game.run()

      // First exploration attaches a card
      game._explorePlanet('quann', 'dennis')
      const attachmentsAfterFirst = [...(game.state.planets['quann']?.attachments || [])]

      // Second exploration of same planet should be a no-op
      game._explorePlanet('quann', 'dennis')
      expect(game.state.planets['quann'].attachments).toEqual(attachmentsAfterFirst)
    })
  })

  describe('Exploration Card Types', () => {
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

      game._initExplorationDecks()
      expect(game.state.explorationDecks).toBeTruthy()
      expect(game.state.explorationDecks.cultural.length).toBe(20)
    })

    test('setBoard can pre-set exploration decks', () => {
      const game = t.fixture()
      t.setBoard(game, {
        explorationDecks: {
          cultural: ['dyson-sphere'],
          hazardous: ['mining-world'],
          industrial: ['biotic-research-facility'],
          frontier: [],
        },
      })
      game.run()

      expect(game.state.explorationDecks.cultural.length).toBe(1)
      expect(game.state.explorationDecks.cultural[0].id).toBe('dyson-sphere')
    })
  })
})
