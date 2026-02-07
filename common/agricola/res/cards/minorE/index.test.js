const res = require('../../index.js')
const minorE = require('../minorE')

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
})
