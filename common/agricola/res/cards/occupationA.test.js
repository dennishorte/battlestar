const res = require('../index.js')
const occupationA = require('./occupationA.js')


describe('OccupationA Cards', () => {

  describe('card data', () => {
    test('all 84 occupations are defined', () => {
      const occupations = occupationA.getOccupations()
      expect(occupations.length).toBe(84)
    })

    test('no minor improvements in this set', () => {
      const minors = occupationA.getMinorImprovements()
      expect(minors.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('homekeeper-a085')
      expect(card.name).toBe('Homekeeper')
      expect(card.type).toBe('occupation')
      expect(card.deck).toBe('occupationA')
    })

    test('all cards have unique ids', () => {
      const occupations = occupationA.getOccupations()
      const ids = occupations.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const occupations = occupationA.getOccupations()
      for (const card of occupations) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('occupationA')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('occupation')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 85-168', () => {
      const occupations = occupationA.getOccupations()
      const numbers = occupations.map(c => c.number).sort((a, b) => a - b)
      for (let i = 85; i <= 168; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('Adoptive Parents', () => {
    test('has allowImmediateOffspringAction flag', () => {
      const card = res.getCardById('adoptive-parents-a092')
      expect(card.allowImmediateOffspringAction).toBe(true)
    })
  })

  describe('card set registration', () => {
    test('occupationA is registered in cardSets', () => {
      expect(res.cardSets.occupationA).toBeDefined()
      expect(res.cardSets.occupationA.id).toBe('occupationA')
      expect(res.cardSets.occupationA.name).toBe('Occupations A')
    })

    test('occupationA card counts are correct', () => {
      expect(res.cardSets.occupationA.minorCount).toBe(0)
      expect(res.cardSets.occupationA.occupationCount).toBe(84)
    })

    test('getOccupations includes occupationA cards', () => {
      const occupations = res.getOccupations()
      expect(occupations.some(c => c.deck === 'occupationA')).toBe(true)
    })
  })

})
