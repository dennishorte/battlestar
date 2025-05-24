const { sortManaArray } = require('./cardUtil.js')

describe('sortManaArray', () => {
  describe('Basic functionality', () => {
    test('sorts empty array', () => {
      expect(sortManaArray([])).toEqual([])
    })

    test('handles single element', () => {
      expect(sortManaArray(['x'])).toEqual(['x'])
      expect(sortManaArray(['1'])).toEqual(['1'])
      expect(sortManaArray(['w'])).toEqual(['w'])
    })

    test('handles null/undefined input', () => {
      expect(sortManaArray(null)).toEqual(null)
      expect(sortManaArray(undefined)).toEqual(undefined)
    })
  })

  describe('Variable symbols (XYZ)', () => {
    test('sorts XYZ in alphabetical order', () => {
      expect(sortManaArray(['z', 'x', 'y'])).toEqual(['x', 'y', 'z'])
      expect(sortManaArray(['y', 'z', 'x'])).toEqual(['x', 'y', 'z'])
    })

    test('handles duplicate variables', () => {
      expect(sortManaArray(['y', 'x', 'x', 'z'])).toEqual(['x', 'x', 'y', 'z'])
    })
  })

  describe('Colorless mana', () => {
    test('sorts numbers numerically', () => {
      expect(sortManaArray(['3', '1', '2'])).toEqual(['1', '2', '3'])
      expect(sortManaArray(['10', '2', '1'])).toEqual(['1', '2', '10'])
    })

    test('handles string and number inputs', () => {
      expect(sortManaArray([3, 1, 2])).toEqual(['1', '2', '3'])
      expect(sortManaArray(['3', 1, '2'])).toEqual(['1', '2', '3'])
    })
  })

  describe('Single colors', () => {
    test('sorts all five colors starting with W', () => {
      expect(sortManaArray(['g', 'r', 'b', 'u', 'w'])).toEqual(['w', 'u', 'b', 'r', 'g'])
    })

    test('handles duplicate colors', () => {
      expect(sortManaArray(['r', 'r', 'g'])).toEqual(['r', 'r', 'g'])
      expect(sortManaArray(['g', 'r', 'r'])).toEqual(['r', 'r', 'g'])
    })
  })

  describe('Color optimization', () => {
    test('optimizes two-color combinations', () => {
      expect(sortManaArray(['w', 'g'])).toEqual(['g', 'w']) // GW shorter than WG (g→w = 1 step)
      expect(sortManaArray(['u', 'r'])).toEqual(['u', 'r']) // UR shorter than RU (u→r = 2 steps vs r→u = 3)
      expect(sortManaArray(['g', 'b'])).toEqual(['b', 'g']) // BG shorter than GB (b→g = 2 steps vs g→b = 3)
      expect(sortManaArray(['r', 'w'])).toEqual(['r', 'w']) // RW shorter than WR (r→w = 1 step)
      expect(sortManaArray(['g', 'u'])).toEqual(['g', 'u']) // GU shorter than UG (g→u = 2 steps vs u→g = 3)
    })

    test('handles provided test cases', () => {
      expect(sortManaArray(['b', 'b', 'u', 'r'])).toEqual(['u', 'b', 'b', 'r'])
    })
  })

  describe('Complex symbols', () => {
    test('extracts first color from complex symbols', () => {
      expect(sortManaArray(['2g', 'wu', 'rp'])).toEqual(['rp', '2g', 'wu'])
    })

    test('handles mixed complex and simple symbols', () => {
      expect(sortManaArray(['ub', 'r', 'wu'])).toEqual(['wu', 'ub', 'r'])
    })
  })

  describe('Category ordering', () => {
    test('places variables before colorless', () => {
      expect(sortManaArray(['1', 'x', '2', 'y'])).toEqual(['x', 'y', '1', '2'])
    })

    test('places colorless before colored', () => {
      expect(sortManaArray(['r', '1', 'g'])).toEqual(['1', 'r', 'g'])
    })

    test('handles all categories together', () => {
      expect(sortManaArray(['2', 'x', 'rg', '1', 'wu', 'y']))
        .toEqual(['x', 'y', '1', '2', 'rg', 'wu'])
    })
  })

  describe('Edge cases', () => {
    test('handles unknown symbols gracefully', () => {
      expect(sortManaArray(['q', 'p'])).toEqual(['p', 'q']) // Alphabetical fallback
    })

    test('maintains order for same-type elements when possible', () => {
      const input = ['r', 'r', 'r']
      expect(sortManaArray(input)).toEqual(['r', 'r', 'r'])
    })

    test('handles case insensitivity', () => {
      expect(sortManaArray(['R', 'g', 'W'])).toEqual(['r', 'g', 'w'])
    })

    test('handles very large arrays', () => {
      const largeArray = Array(100).fill('r').concat(Array(100).fill('u'))
      const result = sortManaArray(largeArray)
      expect(result.slice(0, 100)).toEqual(Array(100).fill('u'))
      expect(result.slice(100)).toEqual(Array(100).fill('r'))
    })
  })
})
