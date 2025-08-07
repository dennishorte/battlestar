Error.stackTraceLimit = 100

const { factory, ALL_EXPANSIONS } = require('./index.js')
const util = require('../../lib/util.js')

const cardData = factory()

const ALL_AGES = [1,2,3,4,5,6,7,8,9,10,11]

describe('Card data validations', () => {
  describe.each(ALL_EXPANSIONS)('expansion %p', (exp) => {
    test('has five achievements', () => {
      expect(cardData[exp].achievements.length).toBe(5)
    })

    test('has the correct number of age cards', () => {
      expect(cardData[exp].cards.length).toBe(115)
    })

    test('has the correct number of cards in the byName lookup', () => {
      expect(Object.keys(cardData[exp].byName).length).toBe(120)
    })

    test('has the correct number of cards per age', () => {
      const counts = ALL_AGES.map(age => cardData[exp].byAge[age].length)
      expect(counts).toEqual([15,10,10,10,10,10,10,10,10,10,10])
    })

    test('has the correct number of cards per color per age', () => {
      const COLORS = ['red', 'yellow', 'green', 'blue', 'purple']
      const COLOR_DISTRIBUTION = [3,2,2,2,2,2,2,2,2,2,2]
      const actual = {}
      for (const color of COLORS) {
        const cards = cardData[exp].cards.filter(card => card.color === color)
        const counts = Object
          .entries(util.array.groupBy(cards, card => card.age))
          .sort((l, r) => l[0] - r[0])
          .map(([, cards]) => cards.length)
        actual[color] = counts
      }

      const expected = Object.fromEntries(COLORS.map(color => [color, COLOR_DISTRIBUTION]))

      expect(actual).toEqual(expected)
    })
  })
})
