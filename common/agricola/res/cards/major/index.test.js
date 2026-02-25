const res = require('../../index.js')
const major = require('../major')

describe('Major Improvement Cards', () => {

  describe('card data', () => {
    test('all 10 base major improvements are defined', () => {
      const base = major.getCardsByPlayerCount(4)
      expect(base.length).toBe(10)
    })

    test('all 18 major improvements including expansion are defined', () => {
      const all = major.getAllCards()
      expect(all.length).toBe(18)
    })

    test('8 expansion cards for 5-6 players', () => {
      const expansion = major.getAllCards().filter(c => c.expansion === '5-6')
      expect(expansion.length).toBe(8)
    })

    test('getCardsByPlayerCount returns base cards for 4 players', () => {
      const cards = major.getCardsByPlayerCount(4)
      expect(cards.every(c => !c.expansion)).toBe(true)
    })

    test('getCardsByPlayerCount returns all cards for 5+ players', () => {
      const cards = major.getCardsByPlayerCount(5)
      expect(cards.length).toBe(18)
    })

    test('getCardById returns correct card', () => {
      const card = major.getCardById('fireplace-2')
      expect(card.name).toBe('Fireplace')
      expect(card.type).toBe('major')
      expect(card.deck).toBe('major')
    })

    test('getCardByName returns a card', () => {
      const card = major.getCardByName('Well')
      expect(card.id).toBe('well')
    })

    test('all cards have unique ids', () => {
      const all = major.getAllCards()
      const ids = all.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const all = major.getAllCards()
      for (const card of all) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('major')
        expect(card.type).toBe('major')
      }
    })

    test('res.getCardById finds major improvements', () => {
      const card = res.getCardById('fireplace-2')
      expect(card).toBeDefined()
      expect(card.name).toBe('Fireplace')
    })

    test('res.getMajorImprovementById still works', () => {
      const card = res.getMajorImprovementById('clay-oven')
      expect(card).toBeDefined()
      expect(card.name).toBe('Clay Oven')
    })

    test('res.getAllMajorImprovements returns base cards by default', () => {
      const cards = res.getAllMajorImprovements()
      expect(cards.length).toBe(10)
    })

    test('res.getAllMajorImprovements returns all for 5+ players', () => {
      const cards = res.getAllMajorImprovements(5)
      expect(cards.length).toBe(18)
    })
  })
})
