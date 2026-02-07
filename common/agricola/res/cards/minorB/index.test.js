const res = require('../../index.js')
const minorB = require('../minorB')

describe('MinorB Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorB.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorB.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('upscale-lifestyle-b001')
      expect(card.name).toBe('Upscale Lifestyle')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorB')
    })

    test('all cards have unique ids', () => {
      const minors = minorB.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorB.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorB')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorB.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorB is registered in cardSets', () => {
      expect(res.cardSets.minorB).toBeDefined()
      expect(res.cardSets.minorB.id).toBe('minorB')
      expect(res.cardSets.minorB.name).toBe('Minor Improvements B')
    })

    test('minorB card counts are correct', () => {
      expect(res.cardSets.minorB.minorCount).toBe(84)
      expect(res.cardSets.minorB.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorB cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorB')).toBe(true)
    })
  })
})
