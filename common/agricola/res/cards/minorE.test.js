const t = require('../../testutil.js')
const res = require('../index.js')
const minorE = require('./minorE.js')


describe('MinorE Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorE.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorE.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('pole-barns-e001')
      expect(card.name).toBe('Pole Barns')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorE')
    })

    test('all cards have unique ids', () => {
      const minors = minorE.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorE.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorE')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorE.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorE is registered in cardSets', () => {
      expect(res.cardSets.minorE).toBeDefined()
      expect(res.cardSets.minorE.id).toBe('minorE')
      expect(res.cardSets.minorE.name).toBe('Minor Improvements E')
    })

    test('minorE card counts are correct', () => {
      expect(res.cardSets.minorE.minorCount).toBe(84)
      expect(res.cardSets.minorE.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorE cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorE')).toBe(true)
    })
  })

  describe('Minor Improvements', () => {

    describe('Recount (E006)', () => {
      test('gives resources for those with 4+ in supply', () => {
        const card = res.getCardById('recount-e006')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 5
        dennis.clay = 4
        dennis.stone = 3
        dennis.reed = 4

        card.onPlay(game, dennis)

        expect(dennis.wood).toBe(6) // Had 5, got 1
        expect(dennis.clay).toBe(5) // Had 4, got 1
        expect(dennis.stone).toBe(3) // Had 3, no bonus
        expect(dennis.reed).toBe(5) // Had 4, got 1
      })
    })

    describe('Pumpernickel (E007)', () => {
      test('gives 4 food', () => {
        const card = res.getCardById('pumpernickel-e007')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onPlay(game, dennis)

        expect(dennis.food).toBe(4)
      })
    })

    describe('Farmers Market (E008)', () => {
      test('gives 1 vegetable', () => {
        const card = res.getCardById('farmers-market-e008')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.vegetables = 0

        card.onPlay(game, dennis)

        expect(dennis.vegetables).toBe(1)
      })
    })

    describe('Misanthropy (E035)', () => {
      test('gives bonus points based on family size', () => {
        const card = res.getCardById('misanthropy-e035')

        const mockPlayer4 = { getFamilySize: () => 4 }
        expect(card.getEndGamePoints(mockPlayer4)).toBe(2)

        const mockPlayer3 = { getFamilySize: () => 3 }
        expect(card.getEndGamePoints(mockPlayer3)).toBe(3)

        const mockPlayer2 = { getFamilySize: () => 2 }
        expect(card.getEndGamePoints(mockPlayer2)).toBe(5)

        const mockPlayer5 = { getFamilySize: () => 5 }
        expect(card.getEndGamePoints(mockPlayer5)).toBe(0)
      })
    })

    describe('Ox Skull (E037)', () => {
      test('gives 1 food on play', () => {
        const card = res.getCardById('ox-skull-e037')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onPlay(game, dennis)

        expect(dennis.food).toBe(1)
      })

      test('gives 3 bonus points if no cattle at end', () => {
        const card = res.getCardById('ox-skull-e037')

        const noCattle = { getAnimalCount: () => 0 }
        expect(card.getEndGamePoints(noCattle)).toBe(3)

        const hasCattle = { getAnimalCount: () => 2 }
        expect(card.getEndGamePoints(hasCattle)).toBe(0)
      })
    })

    describe('Land Register (E034)', () => {
      test('gives 2 bonus points if no unused spaces', () => {
        const card = res.getCardById('land-register-e034')

        const noUnused = { getUnusedSpaces: () => 0 }
        expect(card.getEndGamePoints(noUnused)).toBe(2)

        const hasUnused = { getUnusedSpaces: () => 3 }
        expect(card.getEndGamePoints(hasUnused)).toBe(0)
      })
    })

    describe('Fodder Beets (E044)', () => {
      test('schedules food for odd rounds', () => {
        const card = res.getCardById('fodder-beets-e044')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()
        game.state.round = 4

        const dennis = t.player(game)
        card.onPlay(game, dennis)

        // Should schedule food for rounds 5, 7, 9, 11, 13 (odd rounds after round 4)
        expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][11]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
      })
    })

    describe('Fruit Ladder (E045)', () => {
      test('schedules food for even rounds', () => {
        const card = res.getCardById('fruit-ladder-e045')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()
        game.state.round = 3

        const dennis = t.player(game)
        card.onPlay(game, dennis)

        // Should schedule food for rounds 4, 6, 8, 10, 12, 14 (even rounds after round 3)
        expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
      })
    })

    describe('Waterlily Pond (E046)', () => {
      test('schedules food for next 2 rounds', () => {
        const card = res.getCardById('waterlily-pond-e046')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()
        game.state.round = 5

        const dennis = t.player(game)
        card.onPlay(game, dennis)

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
      })
    })

    describe('Working Gloves (E060)', () => {
      test('gives 1 food on play', () => {
        const card = res.getCardById('working-gloves-e060')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onPlay(game, dennis)

        expect(dennis.food).toBe(1)
      })
    })

    describe('Almsbag (E065)', () => {
      test('gives grain based on completed rounds', () => {
        const card = res.getCardById('almsbag-e065')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()
        game.state.round = 7 // 6 completed rounds

        const dennis = t.player(game)
        dennis.grain = 0

        card.onPlay(game, dennis)

        // 6 completed rounds / 2 = 3 grain
        expect(dennis.grain).toBe(3)
      })
    })

    describe('Profiteering (E082)', () => {
      test('gives 1 food on play', () => {
        const card = res.getCardById('profiteering-e082')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onPlay(game, dennis)

        expect(dennis.food).toBe(1)
      })
    })

    describe('Bookmark (E028)', () => {
      test('schedules free occupation 3 rounds later', () => {
        const card = res.getCardById('bookmark-e028')
        const game = t.fixture({ cardSets: ['minorE'] })
        game.run()
        game.state.round = 5

        const dennis = t.player(game)
        card.onPlay(game, dennis)

        expect(game.state.scheduledFreeOccupation[dennis.name]).toContain(8)
      })
    })

    describe('Iron Oven (E063)', () => {
      test('has baking rate of 6', () => {
        const card = res.getCardById('iron-oven-e063')
        expect(card.bakingRate).toBe(6)
        expect(card.maxBakePerAction).toBe(1)
        expect(card.vps).toBe(2)
      })
    })

    describe('Simple Oven (E064)', () => {
      test('has baking rate of 3', () => {
        const card = res.getCardById('simple-oven-e064')
        expect(card.bakingRate).toBe(3)
        expect(card.maxBakePerAction).toBe(1)
        expect(card.vps).toBe(1)
      })
    })

  })

})
