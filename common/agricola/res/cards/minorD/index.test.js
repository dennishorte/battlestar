const res = require('../../index.js')
const minorD = require('../minorD')

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
})
