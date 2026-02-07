const res = require('../../index.js')
const minorC = require('../minorC')

describe('MinorC Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorC.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorC.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('overhaul-c001')
      expect(card.name).toBe('Overhaul')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorC')
    })

    test('all cards have unique ids', () => {
      const minors = minorC.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorC.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorC')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorC.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorC is registered in cardSets', () => {
      expect(res.cardSets.minorC).toBeDefined()
      expect(res.cardSets.minorC.id).toBe('minorC')
      expect(res.cardSets.minorC.name).toBe('Minor Improvements C')
    })

    test('minorC card counts are correct', () => {
      expect(res.cardSets.minorC.minorCount).toBe(84)
      expect(res.cardSets.minorC.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorC cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorC')).toBe(true)
    })
  })
})
