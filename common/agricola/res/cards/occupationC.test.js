const res = require('../index.js')
const occupationC = require('./occupationC.js')


describe('OccupationC Cards', () => {

  describe('card data', () => {
    test('all 84 occupations are defined', () => {
      const occupations = occupationC.getOccupations()
      expect(occupations.length).toBe(84)
    })

    test('no minor improvements in this set', () => {
      const minors = occupationC.getMinorImprovements()
      expect(minors.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('den-builder-c085')
      expect(card.name).toBe('Den Builder')
      expect(card.type).toBe('occupation')
      expect(card.deck).toBe('occupationC')
    })

    test('all cards have unique ids', () => {
      const occupations = occupationC.getOccupations()
      const ids = occupations.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const occupations = occupationC.getOccupations()
      for (const card of occupations) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('occupationC')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('occupation')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 85-168', () => {
      const occupations = occupationC.getOccupations()
      const numbers = occupations.map(c => c.number).sort((a, b) => a - b)
      for (let i = 85; i <= 168; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('occupationC is registered in cardSets', () => {
      expect(res.cardSets.occupationC).toBeDefined()
      expect(res.cardSets.occupationC.id).toBe('occupationC')
      expect(res.cardSets.occupationC.name).toBe('Occupations C')
    })

    test('occupationC card counts are correct', () => {
      expect(res.cardSets.occupationC.minorCount).toBe(0)
      expect(res.cardSets.occupationC.occupationCount).toBe(84)
    })

    test('getOccupations includes occupationC cards', () => {
      const occupations = res.getOccupations()
      expect(occupations.some(c => c.deck === 'occupationC')).toBe(true)
    })
  })

})
