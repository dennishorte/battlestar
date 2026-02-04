const res = require('../index.js')
const occupationB = require('./occupationB.js')


describe('OccupationB Cards', () => {

  describe('card data', () => {
    test('all 84 occupations are defined', () => {
      const occupations = occupationB.getOccupations()
      expect(occupations.length).toBe(84)
    })

    test('no minor improvements in this set', () => {
      const minors = occupationB.getMinorImprovements()
      expect(minors.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('farm-hand-b085')
      expect(card.name).toBe('Farm Hand')
      expect(card.type).toBe('occupation')
      expect(card.deck).toBe('occupationB')
    })

    test('all cards have unique ids', () => {
      const occupations = occupationB.getOccupations()
      const ids = occupations.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const occupations = occupationB.getOccupations()
      for (const card of occupations) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('occupationB')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('occupation')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 85-168', () => {
      const occupations = occupationB.getOccupations()
      const numbers = occupations.map(c => c.number).sort((a, b) => a - b)
      for (let i = 85; i <= 168; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('occupationB is registered in cardSets', () => {
      expect(res.cardSets.occupationB).toBeDefined()
      expect(res.cardSets.occupationB.id).toBe('occupationB')
      expect(res.cardSets.occupationB.name).toBe('Occupations B')
    })

    test('occupationB card counts are correct', () => {
      expect(res.cardSets.occupationB.minorCount).toBe(0)
      expect(res.cardSets.occupationB.occupationCount).toBe(84)
    })

    test('getOccupations includes occupationB cards', () => {
      const occupations = res.getOccupations()
      expect(occupations.some(c => c.deck === 'occupationB')).toBe(true)
    })
  })

})
