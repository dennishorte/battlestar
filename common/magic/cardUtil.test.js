const CardUtil = require('./cardUtil.js')

describe('CardUtil.extractSymbolsFromText', () => {
  // Basic functionality
  describe('Basic symbol extraction', () => {
    test('single symbol', () => {
      expect(CardUtil.extractSymbolsFromText('{W}')).toEqual(['W'])
      expect(CardUtil.extractSymbolsFromText('{2}')).toEqual(['2'])
      expect(CardUtil.extractSymbolsFromText('{X}')).toEqual(['X'])
    })

    test('multiple symbols', () => {
      expect(CardUtil.extractSymbolsFromText('{W}{U}')).toEqual(['W', 'U'])
      expect(CardUtil.extractSymbolsFromText('{2}{R}{R}')).toEqual(['2', 'R', 'R'])
      expect(CardUtil.extractSymbolsFromText('{3}{W}{U}{B}{R}{G}')).toEqual(['3', 'W', 'U', 'B', 'R', 'G'])
    })

    test('no symbols', () => {
      expect(CardUtil.extractSymbolsFromText('')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('no symbols here')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('cost is 5 mana')).toEqual([])
    })
  })

  // Complex symbols
  describe('Complex mana symbols', () => {
    test('hybrid symbols', () => {
      expect(CardUtil.extractSymbolsFromText('{W/U}')).toEqual(['W/U'])
      expect(CardUtil.extractSymbolsFromText('{2/R}')).toEqual(['2/R'])
      expect(CardUtil.extractSymbolsFromText('{G/W}{B/R}')).toEqual(['G/W', 'B/R'])
    })

    test('phyrexian symbols', () => {
      expect(CardUtil.extractSymbolsFromText('{W/P}')).toEqual(['W/P'])
      expect(CardUtil.extractSymbolsFromText('{U/P}{B/P}')).toEqual(['U/P', 'B/P'])
    })

    test('multi-character symbols', () => {
      expect(CardUtil.extractSymbolsFromText('{10}')).toEqual(['10'])
      expect(CardUtil.extractSymbolsFromText('{15}{20}')).toEqual(['15', '20'])
      expect(CardUtil.extractSymbolsFromText('{100}')).toEqual(['100'])
    })

    test('symbols without slashes', () => {
      expect(CardUtil.extractSymbolsFromText('{WU}')).toEqual(['WU'])
      expect(CardUtil.extractSymbolsFromText('{2W}')).toEqual(['2W'])
      expect(CardUtil.extractSymbolsFromText('{WP}{UP}')).toEqual(['WP', 'UP'])
    })
  })

  // Text with symbols mixed in
  describe('Symbols mixed with text', () => {
    test('symbols with surrounding text', () => {
      expect(CardUtil.extractSymbolsFromText('Pay {3}{R} to cast')).toEqual(['3', 'R'])
      expect(CardUtil.extractSymbolsFromText('Cost: {2}{W}{W}')).toEqual(['2', 'W', 'W'])
      expect(CardUtil.extractSymbolsFromText('Flashback {5}{U} (You may cast...)')).toEqual(['5', 'U'])
    })

    test('symbols with dividers', () => {
      expect(CardUtil.extractSymbolsFromText('{3}{R} // {R/G}')).toEqual(['3', 'R', 'R/G'])
      expect(CardUtil.extractSymbolsFromText('{1}{W} | {2}{U}')).toEqual(['1', 'W', '2', 'U'])
      expect(CardUtil.extractSymbolsFromText('{R} + {G} = {R/G}')).toEqual(['R', 'G', 'R/G'])
    })

    test('multiple sentences with symbols', () => {
      expect(CardUtil.extractSymbolsFromText('Pay {X}{R}. Then pay {2}{G}.')).toEqual(['X', 'R', '2', 'G'])
      expect(CardUtil.extractSymbolsFromText('Cost {1}. Alternative cost {2}{W}.')).toEqual(['1', '2', 'W'])
    })
  })

  // Edge cases and malformed input
  describe('Edge cases', () => {
    test('empty braces', () => {
      expect(CardUtil.extractSymbolsFromText('{}')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{}{W}')).toEqual(['W'])
      expect(CardUtil.extractSymbolsFromText('{W}{}{U}')).toEqual(['W', 'U'])
    })

    test('whitespace in symbols', () => {
      expect(CardUtil.extractSymbolsFromText('{ }')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{  }')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{ W }')).toEqual([' W '])
      expect(CardUtil.extractSymbolsFromText('{W }{U}')).toEqual(['W ', 'U'])
    })

    test('nested braces', () => {
      expect(CardUtil.extractSymbolsFromText('{W{U}R}')).toEqual(['U'])
      expect(CardUtil.extractSymbolsFromText('{a{b}c}')).toEqual(['b'])
      expect(CardUtil.extractSymbolsFromText('{{W}}')).toEqual(['W'])
      expect(CardUtil.extractSymbolsFromText('{W}{{U}}')).toEqual(['W', 'U'])
    })

    test('unmatched braces', () => {
      expect(CardUtil.extractSymbolsFromText('{')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('}')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{W')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('W}')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{W}{U')).toEqual(['W'])
    })

    test('multiple unmatched braces', () => {
      expect(CardUtil.extractSymbolsFromText('{{{')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('}}}')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{W}}{U{')).toEqual(['W'])
    })
  })

  // Special characters and symbols
  describe('Special characters', () => {
    test('symbols with special characters', () => {
      expect(CardUtil.extractSymbolsFromText('{W/U}')).toEqual(['W/U'])
      expect(CardUtil.extractSymbolsFromText('{W-U}')).toEqual(['W-U'])
      expect(CardUtil.extractSymbolsFromText('{W_U}')).toEqual(['W_U'])
      expect(CardUtil.extractSymbolsFromText('{W.U}')).toEqual(['W.U'])
    })

    test('numbers and letters', () => {
      expect(CardUtil.extractSymbolsFromText('{2W}')).toEqual(['2W'])
      expect(CardUtil.extractSymbolsFromText('{W2}')).toEqual(['W2'])
      expect(CardUtil.extractSymbolsFromText('{123ABC}')).toEqual(['123ABC'])
    })

    test('case sensitivity', () => {
      expect(CardUtil.extractSymbolsFromText('{w}')).toEqual(['w'])
      expect(CardUtil.extractSymbolsFromText('{W}')).toEqual(['W'])
      expect(CardUtil.extractSymbolsFromText('{w/U}')).toEqual(['w/U'])
    })
  })

  // Real-world examples
  describe('Real-world Magic card examples', () => {
    test('typical creature costs', () => {
      expect(CardUtil.extractSymbolsFromText('{3}{W}{W}')).toEqual(['3', 'W', 'W'])
      expect(CardUtil.extractSymbolsFromText('{1}{U}{R}')).toEqual(['1', 'U', 'R'])
      expect(CardUtil.extractSymbolsFromText('{W}{U}{B}{R}{G}')).toEqual(['W', 'U', 'B', 'R', 'G'])
    })

    test('split cards', () => {
      expect(CardUtil.extractSymbolsFromText('Fire {1}{R} // Ice {1}{U}')).toEqual(['1', 'R', '1', 'U'])
      expect(CardUtil.extractSymbolsFromText('Left half: {2}{W} Right half: {1}{G}{G}')).toEqual(['2', 'W', '1', 'G', 'G'])
    })

    test('ability costs', () => {
      expect(CardUtil.extractSymbolsFromText('{T}: Add {G}')).toEqual(['T', 'G'])
      expect(CardUtil.extractSymbolsFromText('{2}, {T}: Draw a card')).toEqual(['2', 'T'])
      expect(CardUtil.extractSymbolsFromText('Pay {X}{R}: Deal X damage')).toEqual(['X', 'R'])
    })

    test('complex ability text', () => {
      expect(CardUtil.extractSymbolsFromText('Flashback {5}{U} (You may cast this card from your graveyard for its flashback cost. Then exile it.)')).toEqual(['5', 'U'])
      expect(CardUtil.extractSymbolsFromText('Kicker {2}{W} (You may pay an additional {2}{W} as you cast this spell.)')).toEqual(['2', 'W', '2', 'W'])
    })
  })

  // Performance and boundary cases
  describe('Boundary cases', () => {
    test('very long strings', () => {
      const longString = '{W}'.repeat(100)
      const expected = Array(100).fill('W')
      expect(CardUtil.extractSymbolsFromText(longString)).toEqual(expected)
    })

    test('mixed valid and invalid', () => {
      expect(CardUtil.extractSymbolsFromText('{W}{invalid{nested}}{U}{}')).toEqual(['W', 'nested', 'U'])
      expect(CardUtil.extractSymbolsFromText('{1}unclosed{2}{valid}')).toEqual(['1', '2', 'valid'])
    })

    test('only braces', () => {
      expect(CardUtil.extractSymbolsFromText('{}{}{}')).toEqual([])
      expect(CardUtil.extractSymbolsFromText('{{{}}}{')).toEqual([])
    })

    test('unicode and special characters', () => {
      expect(CardUtil.extractSymbolsFromText('{★}')).toEqual(['★'])
      expect(CardUtil.extractSymbolsFromText('{½}')).toEqual(['½'])
      expect(CardUtil.extractSymbolsFromText('{∞}')).toEqual(['∞'])
    })
  })
})

describe('CardUtil.manaCostFromCastingCost', () => {
  // Basic colored mana symbols
  describe('Basic colored mana', () => {
    test('single colored mana symbols', () => {
      expect(CardUtil.manaCostFromCastingCost('{W}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{U}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{B}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{R}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{G}')).toBe(1)
    })

    test('multiple colored mana symbols', () => {
      expect(CardUtil.manaCostFromCastingCost('{W}{U}')).toBe(2)
      /* expect(CardUtil.manaCostFromCastingCost('{R}{R}{R}')).toBe(3)
       * expect(CardUtil.manaCostFromCastingCost('{W}{U}{B}{R}{G}')).toBe(5) */
    })

    test('case insensitive colored mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{w}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{u}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{W}{u}{B}')).toBe(3)
    })
  })

  // Generic mana costs
  describe('Generic mana', () => {
    test('single digit generic costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{1}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{2}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{9}')).toBe(9)
    })

    test('multi-digit generic costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{10}')).toBe(10)
      expect(CardUtil.manaCostFromCastingCost('{15}')).toBe(15)
      expect(CardUtil.manaCostFromCastingCost('{20}')).toBe(20)
      expect(CardUtil.manaCostFromCastingCost('{100}')).toBe(100)
    })

    test('generic plus colored mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{3}{W}')).toBe(4)
      expect(CardUtil.manaCostFromCastingCost('{2}{U}{U}')).toBe(4)
      expect(CardUtil.manaCostFromCastingCost('{1}{W}{U}{B}{R}{G}')).toBe(6)
    })
  })

  // Variable costs
  describe('Variable costs', () => {
    test('X costs equal zero', () => {
      expect(CardUtil.manaCostFromCastingCost('{X}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('{x}')).toBe(0) // case insensitive
    })

    test('Y and Z costs equal zero', () => {
      expect(CardUtil.manaCostFromCastingCost('{Y}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('{Z}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('{y}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('{z}')).toBe(0)
    })

    test('X with other costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{X}{R}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{X}{X}{U}{U}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2}{X}{G}')).toBe(3)
    })
  })

  // Hybrid mana
  describe('Hybrid mana', () => {
    test('two-color hybrid mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{W/U}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{B/R}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{G/W}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{R/G}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{U/B}')).toBe(1)
    })

    test('two-color hybrid without slash', () => {
      expect(CardUtil.manaCostFromCastingCost('{WU}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{wu}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{br}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{GW}')).toBe(1)
    })

    test('monocolored hybrid mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{2/W}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2/U}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2/B}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2/R}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2/G}')).toBe(2)
    })

    test('monocolored hybrid without slash', () => {
      expect(CardUtil.manaCostFromCastingCost('{2W}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2u}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2B}')).toBe(2)
    })

    test('multiple hybrid symbols', () => {
      expect(CardUtil.manaCostFromCastingCost('{W/U}{W/U}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2/R}{2/R}{2/R}')).toBe(6)
      expect(CardUtil.manaCostFromCastingCost('{G/W}{2/U}')).toBe(3)
    })
  })

  // Phyrexian mana
  describe('Phyrexian mana', () => {
    test('basic phyrexian mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{W/P}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{U/P}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{B/P}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{R/P}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{G/P}')).toBe(1)
    })

    test('phyrexian without slash', () => {
      expect(CardUtil.manaCostFromCastingCost('{WP}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{up}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{BP}')).toBe(1)
    })

    test('multiple phyrexian symbols', () => {
      expect(CardUtil.manaCostFromCastingCost('{W/P}{U/P}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{B/P}{B/P}{B/P}{B/P}')).toBe(4)
    })
  })

  // Special mana symbols
  describe('Special mana symbols', () => {
    test('colorless mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{C}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{c}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{C}{C}')).toBe(2)
    })

    test('snow mana', () => {
      expect(CardUtil.manaCostFromCastingCost('{S}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{s}')).toBe(1)
      expect(CardUtil.manaCostFromCastingCost('{S}{S}{S}')).toBe(3)
    })

    test('mixed special symbols', () => {
      expect(CardUtil.manaCostFromCastingCost('{2}{C}{S}')).toBe(4)
      expect(CardUtil.manaCostFromCastingCost('{C}{W}{S}{U}')).toBe(4)
    })
  })

  // Complex combinations
  describe('Complex mana costs', () => {
    test('typical creature costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{3}{W}{W}')).toBe(5) // Baneslayer Angel
      expect(CardUtil.manaCostFromCastingCost('{1}{U}{R}')).toBe(3) // Izzet Charm
      expect(CardUtil.manaCostFromCastingCost('{W}{U}{B}{R}{G}')).toBe(5) // WUBRG costs
    })

    test('expensive spells', () => {
      expect(CardUtil.manaCostFromCastingCost('{8}{G}{G}')).toBe(10)
      expect(CardUtil.manaCostFromCastingCost('{15}')).toBe(15)
      expect(CardUtil.manaCostFromCastingCost('{X}{X}{1}{W}')).toBe(2) // X=0 for mana value
    })

    test('all symbol types mixed', () => {
      expect(CardUtil.manaCostFromCastingCost('{2}{W/U}{G/P}{C}{S}{X}')).toBe(6)
      expect(CardUtil.manaCostFromCastingCost('{1}{2/R}{B/P}{Y}{W}')).toBe(5)
    })
  })

  // Split cards and dividers
  describe('Split cards with dividers', () => {
    test('split card with // divider', () => {
      expect(CardUtil.manaCostFromCastingCost('{3}{R} // {R/G}')).toBe(5)
      expect(CardUtil.manaCostFromCastingCost('{1}{W} // {2}{U}')).toBe(5)
      expect(CardUtil.manaCostFromCastingCost('{2}{B} // {1}{G}{G}')).toBe(6)
    })

    test('split card with other dividers', () => {
      expect(CardUtil.manaCostFromCastingCost('{R} | {G}')).toBe(2)
      expect(CardUtil.manaCostFromCastingCost('{2}{W} / {1}{U}')).toBe(5)
      expect(CardUtil.manaCostFromCastingCost('{1}{R} + {2}{G}')).toBe(5)
    })

    test('split card with complex costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{X}{W/U} // {2/R}{B/P}')).toBe(4)
      expect(CardUtil.manaCostFromCastingCost('{5}{C} // {3}{S}{W}')).toBe(11)
    })

    test('multiple dividers', () => {
      expect(CardUtil.manaCostFromCastingCost('{1}{R} // {G} // {2}{U}')).toBe(6)
      expect(CardUtil.manaCostFromCastingCost('{W} | {U} | {B} | {R} | {G}')).toBe(5)
    })
  })

  // Edge cases
  describe('Edge cases', () => {
    test('zero mana cost', () => {
      expect(CardUtil.manaCostFromCastingCost('{0}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('')).toBe(0)
    })

    test('only variable costs', () => {
      expect(CardUtil.manaCostFromCastingCost('{X}{Y}{Z}')).toBe(0)
      expect(CardUtil.manaCostFromCastingCost('{X}{X}{X}')).toBe(0)
    })

    test('whitespace and formatting', () => {
      expect(CardUtil.manaCostFromCastingCost(' {2}{W} ')).toBe(3)
      expect(CardUtil.manaCostFromCastingCost('{1}  {U}  {R}')).toBe(3)
    })

    test('mixed case', () => {
      expect(CardUtil.manaCostFromCastingCost('{2}{w/U}{B/p}')).toBe(4)
      expect(CardUtil.manaCostFromCastingCost('{X}{r/G}{C}{s}')).toBe(3)
    })

    test('unusual but valid symbol combinations', () => {
      expect(CardUtil.manaCostFromCastingCost('{20}{W/P}{2/U}{C}{S}{X}')).toBe(25)
      expect(CardUtil.manaCostFromCastingCost('{100}')).toBe(100)
    })

    test('redundant symbols with dividers', () => {
      expect(CardUtil.manaCostFromCastingCost('{2}{R} extra text {G} // more text {1}{U}')).toBe(6)
      expect(CardUtil.manaCostFromCastingCost('Cost: {3}{W} | Alternative: {1}{B}{B}')).toBe(7)
    })
  })
})

describe('CardUtil.sortManaArray', () => {
  describe('Basic functionality', () => {
    test('sorts empty array', () => {
      expect(CardUtil.sortManaArray([])).toEqual([])
    })

    test('handles single element', () => {
      expect(CardUtil.sortManaArray(['x'])).toEqual(['x'])
      expect(CardUtil.sortManaArray(['1'])).toEqual(['1'])
      expect(CardUtil.sortManaArray(['w'])).toEqual(['w'])
    })

    test('handles null/undefined input', () => {
      expect(CardUtil.sortManaArray(null)).toEqual(null)
      expect(CardUtil.sortManaArray(undefined)).toEqual(undefined)
    })
  })

  describe('Variable symbols (XYZ)', () => {
    test('sorts XYZ in alphabetical order', () => {
      expect(CardUtil.sortManaArray(['z', 'x', 'y'])).toEqual(['x', 'y', 'z'])
      expect(CardUtil.sortManaArray(['y', 'z', 'x'])).toEqual(['x', 'y', 'z'])
    })

    test('handles duplicate variables', () => {
      expect(CardUtil.sortManaArray(['y', 'x', 'x', 'z'])).toEqual(['x', 'x', 'y', 'z'])
    })
  })

  describe('Colorless mana', () => {
    test('sorts numbers numerically', () => {
      expect(CardUtil.sortManaArray(['3', '1', '2'])).toEqual(['1', '2', '3'])
      expect(CardUtil.sortManaArray(['10', '2', '1'])).toEqual(['1', '2', '10'])
    })

    test('handles string and number inputs', () => {
      expect(CardUtil.sortManaArray([3, 1, 2])).toEqual(['1', '2', '3'])
      expect(CardUtil.sortManaArray(['3', 1, '2'])).toEqual(['1', '2', '3'])
    })
  })

  describe('Single colors', () => {
    test('sorts all five colors starting with W', () => {
      expect(CardUtil.sortManaArray(['g', 'r', 'b', 'u', 'w'])).toEqual(['w', 'u', 'b', 'r', 'g'])
    })

    test('handles duplicate colors', () => {
      expect(CardUtil.sortManaArray(['r', 'r', 'g'])).toEqual(['r', 'r', 'g'])
      expect(CardUtil.sortManaArray(['g', 'r', 'r'])).toEqual(['r', 'r', 'g'])
    })
  })

  describe('Color optimization', () => {
    test('optimizes two-color combinations', () => {
      expect(CardUtil.sortManaArray(['w', 'g'])).toEqual(['g', 'w']) // GW shorter than WG (g→w = 1 step)
      expect(CardUtil.sortManaArray(['u', 'r'])).toEqual(['u', 'r']) // UR shorter than RU (u→r = 2 steps vs r→u = 3)
      expect(CardUtil.sortManaArray(['g', 'b'])).toEqual(['b', 'g']) // BG shorter than GB (b→g = 2 steps vs g→b = 3)
      expect(CardUtil.sortManaArray(['r', 'w'])).toEqual(['r', 'w']) // RW shorter than WR (r→w = 1 step)
      expect(CardUtil.sortManaArray(['g', 'u'])).toEqual(['g', 'u']) // GU shorter than UG (g→u = 2 steps vs u→g = 3)
    })

    test('handles provided test cases', () => {
      expect(CardUtil.sortManaArray(['b', 'b', 'u', 'r'])).toEqual(['u', 'b', 'b', 'r'])
    })
  })

  describe('Complex symbols', () => {
    test('extracts first color from complex symbols', () => {
      expect(CardUtil.sortManaArray(['2g', 'wu', 'rp'])).toEqual(['rp', '2g', 'wu'])
    })

    test('handles mixed complex and simple symbols', () => {
      expect(CardUtil.sortManaArray(['ub', 'r', 'wu'])).toEqual(['wu', 'ub', 'r'])
    })
  })

  describe('Category ordering', () => {
    test('places variables before colorless', () => {
      expect(CardUtil.sortManaArray(['1', 'x', '2', 'y'])).toEqual(['x', 'y', '1', '2'])
    })

    test('places colorless before colored', () => {
      expect(CardUtil.sortManaArray(['r', '1', 'g'])).toEqual(['1', 'r', 'g'])
    })

    test('handles all categories together', () => {
      expect(CardUtil.sortManaArray(['2', 'x', 'rg', '1', 'wu', 'y']))
        .toEqual(['x', 'y', '1', '2', 'rg', 'wu'])
    })
  })

  describe('Edge cases', () => {
    test('handles unknown symbols gracefully', () => {
      expect(CardUtil.sortManaArray(['q', 'p'])).toEqual(['p', 'q']) // Alphabetical fallback
    })

    test('maintains order for same-type elements when possible', () => {
      const input = ['r', 'r', 'r']
      expect(CardUtil.sortManaArray(input)).toEqual(['r', 'r', 'r'])
    })

    test('handles case insensitivity', () => {
      expect(CardUtil.sortManaArray(['R', 'g', 'W'])).toEqual(['r', 'g', 'w'])
    })

    test('handles very large arrays', () => {
      const largeArray = Array(100).fill('r').concat(Array(100).fill('u'))
      const result = CardUtil.sortManaArray(largeArray)
      expect(result.slice(0, 100)).toEqual(Array(100).fill('u'))
      expect(result.slice(100)).toEqual(Array(100).fill('r'))
    })
  })
})
