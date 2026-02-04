const res = require('../index.js')
const occupationE = require('./occupationE.js')


describe('OccupationE Cards', () => {

  describe('card data', () => {
    test('all 84 occupations are defined', () => {
      const occupations = occupationE.getOccupations()
      expect(occupations.length).toBe(84)
    })

    test('no minor improvements in this set', () => {
      const minors = occupationE.getMinorImprovements()
      expect(minors.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('master-tanner-e085')
      expect(card.name).toBe('Master Tanner')
      expect(card.type).toBe('occupation')
      expect(card.deck).toBe('occupationE')
    })

    test('all cards have unique ids', () => {
      const occupations = occupationE.getOccupations()
      const ids = occupations.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const occupations = occupationE.getOccupations()
      for (const card of occupations) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('occupationE')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('occupation')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 85-168', () => {
      const occupations = occupationE.getOccupations()
      const numbers = occupations.map(c => c.number).sort((a, b) => a - b)
      for (let i = 85; i <= 168; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('occupationE is registered in cardSets', () => {
      expect(res.cardSets.occupationE).toBeDefined()
      expect(res.cardSets.occupationE.id).toBe('occupationE')
      expect(res.cardSets.occupationE.name).toBe('Occupations E')
    })

    test('occupationE card counts are correct', () => {
      expect(res.cardSets.occupationE.minorCount).toBe(0)
      expect(res.cardSets.occupationE.occupationCount).toBe(84)
    })

    test('getOccupations includes occupationE cards', () => {
      const occupations = res.getOccupations()
      expect(occupations.some(c => c.deck === 'occupationE')).toBe(true)
    })
  })

})
