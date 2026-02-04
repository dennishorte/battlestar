const t = require('../../testutil.js')
const res = require('../index.js')
const minorD = require('./minorD.js')


describe('MinorD Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorD.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorD.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('zigzag-harrow-d001')
      expect(card.name).toBe('Zigzag Harrow')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorD')
    })

    test('all cards have unique ids', () => {
      const minors = minorD.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorD.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorD')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorD.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorD is registered in cardSets', () => {
      expect(res.cardSets.minorD).toBeDefined()
      expect(res.cardSets.minorD.id).toBe('minorD')
      expect(res.cardSets.minorD.name).toBe('Minor Improvements D')
    })

    test('minorD card counts are correct', () => {
      expect(res.cardSets.minorD.minorCount).toBe(84)
      expect(res.cardSets.minorD.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorD cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorD')).toBe(true)
    })
  })

  describe('Minor Improvements', () => {

    describe('Cross-Cut Wood (D004)', () => {
      test('gives wood equal to stone in supply', () => {
        const card = res.getCardById('cross-cut-wood-d004')
        const game = t.fixture({ cardSets: ['minorD'] })
        game.run()

        const dennis = t.player(game)
        dennis.stone = 4
        dennis.wood = 0

        card.onPlay(game, dennis)

        expect(dennis.wood).toBe(4)
      })
    })

    describe('Field Clay (D005)', () => {
      test('gives clay for each planted field', () => {
        const card = res.getCardById('field-clay-d005')
        const game = t.fixture({ cardSets: ['minorD'] })
        game.run()

        const dennis = t.player(game)
        dennis.clay = 0
        dennis.getPlantedFields = () => [{ grain: 2 }, { vegetables: 1 }, { grain: 1 }]

        card.onPlay(game, dennis)

        expect(dennis.clay).toBe(3)
      })
    })

    describe('Trident (D007)', () => {
      test('gives food based on round played', () => {
        const card = res.getCardById('trident-d007')
        const game = t.fixture({ cardSets: ['minorD'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        game.state.round = 6
        card.onPlay(game, dennis)
        expect(dennis.food).toBe(4)

        dennis.food = 0
        game.state.round = 9
        card.onPlay(game, dennis)
        expect(dennis.food).toBe(5)
      })
    })

    describe('Lawn Fertilizer (D011)', () => {
      test('modifies pasture capacity for size 1 pastures', () => {
        const card = res.getCardById('lawn-fertilizer-d011')

        // Size 1 pasture without stable
        let capacity = card.modifyPastureCapacity(null, null, 2, 1, false)
        expect(capacity).toBe(3)

        // Size 1 pasture with stable
        capacity = card.modifyPastureCapacity(null, null, 2, 1, true)
        expect(capacity).toBe(6)

        // Size 2 pasture - should not modify
        capacity = card.modifyPastureCapacity(null, null, 4, 2, false)
        expect(capacity).toBe(4)
      })
    })

    describe('Game Trade (D009)', () => {
      test('gives boar and cattle', () => {
        const card = res.getCardById('game-trade-d009')
        const game = t.fixture({ cardSets: ['minorD'] })
        game.run()

        const dennis = t.player(game)
        dennis.animals = { sheep: 0, boar: 0, cattle: 0 }
        dennis.addAnimal = (type, count) => {
          dennis.animals[type] += count
        }

        card.onPlay(game, dennis)

        expect(dennis.animals.boar).toBe(1)
        expect(dennis.animals.cattle).toBe(1)
      })
    })

    describe('Fern Seeds (D008)', () => {
      test('has onPlay hook and correct prereqs', () => {
        const card = res.getCardById('fern-seeds-d008')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({})
        expect(card.prereqs).toEqual({ emptyFields: 1, plantedFields: 2 })
      })
    })

    describe('Dwelling Plan (D002)', () => {
      test('has onPlay hook', () => {
        const card = res.getCardById('dwelling-plan-d002')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ food: 1 })
      })
    })

    describe('Furrows (D003)', () => {
      test('costs nothing and has onPlay hook', () => {
        const card = res.getCardById('furrows-d003')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({})
      })
    })

    describe("Stork's Nest (D010)", () => {
      test('has onReturnHome hook', () => {
        const card = res.getCardById('storks-nest-d010')
        expect(card.onReturnHome).toBeDefined()
        expect(card.cost).toEqual({ reed: 1 })
        expect(card.prereqs).toEqual({ occupations: 5 })
      })
    })

    describe('Petrified Wood (D006)', () => {
      test('has onPlay hook for exchange', () => {
        const card = res.getCardById('petrified-wood-d006')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({})
        expect(card.prereqs).toEqual({ occupations: 2 })
      })
    })

  })

})
