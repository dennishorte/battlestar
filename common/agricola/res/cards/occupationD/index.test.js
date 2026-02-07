const res = require('../../index.js')
const occupationD = require('../occupationD')

describe('OccupationD Cards', () => {

  describe('card data', () => {
    test('all 84 occupations are defined', () => {
      const occupations = occupationD.getOccupations()
      expect(occupations.length).toBe(84)
    })

    test('no minor improvements in this set', () => {
      const minors = occupationD.getMinorImprovements()
      expect(minors.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('reader-d085')
      expect(card.name).toBe('Reader')
      expect(card.type).toBe('occupation')
      expect(card.deck).toBe('occupationD')
    })

    test('all cards have unique ids', () => {
      const occupations = occupationD.getOccupations()
      const ids = occupations.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const occupations = occupationD.getOccupations()
      for (const card of occupations) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('occupationD')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('occupation')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 85-168', () => {
      const occupations = occupationD.getOccupations()
      const numbers = occupations.map(c => c.number).sort((a, b) => a - b)
      for (let i = 85; i <= 168; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('occupationD is registered in cardSets', () => {
      expect(res.cardSets.occupationD).toBeDefined()
      expect(res.cardSets.occupationD.id).toBe('occupationD')
      expect(res.cardSets.occupationD.name).toBe('Occupations D')
    })

    test('occupationD card counts are correct', () => {
      expect(res.cardSets.occupationD.minorCount).toBe(0)
      expect(res.cardSets.occupationD.occupationCount).toBe(84)
    })

    test('getOccupations includes occupationD cards', () => {
      const occupations = res.getOccupations()
      expect(occupations.some(c => c.deck === 'occupationD')).toBe(true)
    })
  })
})
