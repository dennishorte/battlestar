const res = require('../../index.js')
const minorA = require('../minorA')

describe('MinorA Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorA.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorA.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('shelter-a001')
      expect(card.name).toBe('Shelter')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorA')
    })

    test('all cards have unique ids', () => {
      const minors = minorA.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorA.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorA')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorA.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorA is registered in cardSets', () => {
      expect(res.cardSets.minorA).toBeDefined()
      expect(res.cardSets.minorA.id).toBe('minorA')
      expect(res.cardSets.minorA.name).toBe('Minor Improvements A')
    })

    test('minorA card counts are correct', () => {
      expect(res.cardSets.minorA.minorCount).toBe(84)
      expect(res.cardSets.minorA.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorA cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorA')).toBe(true)
    })
  })
})
