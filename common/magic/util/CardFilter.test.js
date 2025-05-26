const CardFilter = require('./CardFilter.js')
const CardWrapper = require('./CardWrapper.js')
const fs = require('fs')
const path = require('path')

describe('CardFilter', () => {
  let testCards = {}

  beforeAll(() => {
    // Load all test card data
    const testDataDir = path.join(__dirname, '..', '..', '..', 'api', 'tests', 'scripts', 'res')
    const cardFiles = fs.readdirSync(testDataDir).filter(file => file.endsWith('.out.json'))

    cardFiles.forEach(file => {
      const cardData = JSON.parse(fs.readFileSync(path.join(testDataDir, file), 'utf8'))
      const cardName = file.replace('scryfall_', '').replace('.out.json', '')
      testCards[cardName] = new CardWrapper(cardData)
    })
  })

  describe('constructor', () => {
    test('should create filter with basic options', () => {
      const filter = new CardFilter({
        kind: 'name',
        value: 'Lightning Bolt',
        operator: 'and'
      })

      expect(filter.kind).toBe('name')
      expect(filter.value).toBe('Lightning Bolt')
      expect(filter.operator).toBe('and')
    })

    test('should set default values for optional properties', () => {
      const filter = new CardFilter({
        kind: 'cmc',
        value: '3'
      })

      expect(filter.operator).toBeNull()
      expect(filter.or).toBe(false)
      expect(filter.only).toBe(false)
    })

    test('should accept all color properties', () => {
      const filter = new CardFilter({
        kind: 'colors',
        red: true,
        green: true,
        white: null,
        blue: true
      })

      expect(filter.red).toBe(true)
      expect(filter.green).toBe(true)
      expect(filter.black).toBeNull()
      expect(filter.white).toBeNull()
      expect(filter.blue).toBe(true)
    })
  })

  describe('legality filters', () => {
    test('should match cards legal in modern format', () => {
      const filter = new CardFilter({
        kind: 'legality',
        value: 'modern'
      })

      // Fire // Ice and Craw Wurm are legal in modern
      expect(filter.matches(testCards.fire_ice)).toBe(true)
      expect(filter.matches(testCards.craw_wurm)).toBe(true)

      // Blessed Hippogriff is not legal in modern
      expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
    })

    test('should not match cards not legal in specified format', () => {
      const filter = new CardFilter({
        kind: 'legality',
        value: 'standard'
      })

      // None of our test cards should be legal in standard
      expect(filter.matches(testCards.fire_ice)).toBe(false)
      expect(filter.matches(testCards.craw_wurm)).toBe(false)
      expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
      expect(filter.matches(testCards.spirit_token)).toBe(false)
    })

    test('should handle legacy format filtering', () => {
      const filter = new CardFilter({
        kind: 'legality',
        value: 'legacy'
      })

      // Fire // Ice, Craw Wurm, and Blessed Hippogriff are legal in legacy
      expect(filter.matches(testCards.fire_ice)).toBe(true)
      expect(filter.matches(testCards.craw_wurm)).toBe(true)
      expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

      // Spirit token is not legal in any format
      expect(filter.matches(testCards.spirit_token)).toBe(false)
    })

    test('should handle commander format filtering', () => {
      const filter = new CardFilter({
        kind: 'legality',
        value: 'commander'
      })

      // Fire // Ice, Craw Wurm, and Blessed Hippogriff are legal in commander
      expect(filter.matches(testCards.fire_ice)).toBe(true)
      expect(filter.matches(testCards.craw_wurm)).toBe(true)
      expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

      // Spirit token is not legal in any format
      expect(filter.matches(testCards.spirit_token)).toBe(false)
    })
  })

  describe('color filters', () => {
    describe('colors kind', () => {
      test('should match single color cards', () => {
        const redFilter = new CardFilter({
          kind: 'colors',
          red: true
        })

        // Fire // Ice has red and blue colors
        expect(redFilter.matches(testCards.fire_ice)).toBe(true)

        // Craw Wurm is green only
        expect(redFilter.matches(testCards.craw_wurm)).toBe(false)

        // Blessed Hippogriff is white only
        expect(redFilter.matches(testCards.blessed_hippogriff)).toBe(false)
      })

      test('should match multicolor cards with OR logic', () => {
        const filter = new CardFilter({
          kind: 'colors',
          red: true,
          blue: true,
          or: true
        })

        // Fire // Ice has both red and blue
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Akoum Warrior is red only
        expect(filter.matches(testCards.akoum_warrior)).toBe(true)

        // Craw Wurm is green only
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match multicolor cards with AND logic', () => {
        const filter = new CardFilter({
          kind: 'colors',
          red: true,
          blue: true,
          or: false // AND logic (default)
        })

        // Fire // Ice has both red and blue
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Akoum Warrior is red only (missing blue)
        expect(filter.matches(testCards.akoum_warrior)).toBe(false)

        // Craw Wurm is green only
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match exact colors with only flag', () => {
        const filter = new CardFilter({
          kind: 'colors',
          red: true,
          blue: true,
          only: true
        })

        // Fire // Ice has exactly red and blue
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Arlin Kord has red and green (not exact match)
        expect(filter.matches(testCards.arlin_kord)).toBe(false)

        // Akoum Warrior is red only (missing blue)
        expect(filter.matches(testCards.akoum_warrior)).toBe(false)
      })

      test('should handle colorless cards', () => {
        const colorlessFilter = new CardFilter({
          kind: 'colors'
          // No color properties set
        })

        // Blinding Drone is colorless (devoid)
        expect(colorlessFilter.matches(testCards.blinding_drone)).toBe(true)

        // Branchloft Pathway is colorless (land)
        expect(colorlessFilter.matches(testCards.branchloft_pathway)).toBe(true)

        // Fire // Ice has colors
        expect(colorlessFilter.matches(testCards.fire_ice)).toBe(false)
      })

      test('should handle devoid cards as colorless', () => {
        const redFilter = new CardFilter({
          kind: 'colors',
          red: true
        })

        // Blinding Drone has devoid, so it's colorless despite blue mana cost
        expect(redFilter.matches(testCards.blinding_drone)).toBe(false)
      })
    })

    describe('identity kind', () => {
      test('should match color identity including mana symbols in text', () => {
        const blueFilter = new CardFilter({
          kind: 'identity',
          blue: true
        })

        // Fire // Ice has blue in its color identity
        expect(blueFilter.matches(testCards.fire_ice)).toBe(true)

        // Blinding Drone has blue in mana cost (color identity)
        expect(blueFilter.matches(testCards.blinding_drone)).toBe(true)

        // Craw Wurm is green identity only
        expect(blueFilter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match color identity with produced mana', () => {
        const whiteFilter = new CardFilter({
          kind: 'identity',
          white: true
        })

        // Branchloft Pathway can produce white mana
        expect(whiteFilter.matches(testCards.branchloft_pathway)).toBe(true)

        // Blessed Hippogriff is white
        expect(whiteFilter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Craw Wurm has no white in identity
        expect(whiteFilter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match color identity with color indicators', () => {
        const blackFilter = new CardFilter({
          kind: 'identity',
          black: true
        })

        // Spirit token has black in color indicator
        expect(blackFilter.matches(testCards.spirit_token)).toBe(true)

        // Craw Wurm has no black
        expect(blackFilter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle identity filtering with only flag', () => {
        const filter = new CardFilter({
          kind: 'identity',
          green: true,
          white: true,
          only: true
        })

        // Branchloft Pathway has exactly green and white identity
        expect(filter.matches(testCards.branchloft_pathway)).toBe(true)

        // Arlin Kord has green and red (not exact match)
        expect(filter.matches(testCards.arlin_kord)).toBe(false)

        // Craw Wurm is green only (missing white)
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })
    })
  })

  describe('text field filters', () => {
    describe('name filtering', () => {
      test('should match card names with and operator', () => {
        const filter = new CardFilter({
          kind: 'name',
          value: 'fire',
          operator: 'and'
        })

        // Fire // Ice contains "fire" in name
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Craw Wurm does not contain "fire"
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should exclude card names with not operator', () => {
        const filter = new CardFilter({
          kind: 'name',
          value: 'wurm',
          operator: 'not'
        })

        // Craw Wurm contains "wurm" so should be excluded
        expect(filter.matches(testCards.craw_wurm)).toBe(false)

        // Fire // Ice does not contain "wurm" so should match
        expect(filter.matches(testCards.fire_ice)).toBe(true)
      })

      test('should match any of multiple names with or operator', () => {
        const filter = new CardFilter({
          kind: 'name',
          value: ['Fire', 'Spirit'],
          operator: 'or'
        })

        // Fire // Ice has "Fire" in name
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Spirit token has "Spirit" in name
        expect(filter.matches(testCards.spirit_token)).toBe(true)

        // Craw Wurm has neither
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle case insensitive matching', () => {
        const filter = new CardFilter({
          kind: 'name',
          value: 'FIRE',
          operator: 'and'
        })

        // Should match "Fire" despite case difference
        expect(filter.matches(testCards.fire_ice)).toBe(true)
      })

      test('should handle multi-face card names', () => {
        const filter = new CardFilter({
          kind: 'name',
          value: 'blessing',
          operator: 'and'
        })

        // Blessed Hippogriff // Tyr's Blessing contains "blessing"
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Fire // Ice does not contain "blessing"
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })
    })

    describe('text filtering', () => {
      test('should match oracle text with and operator', () => {
        const filter = new CardFilter({
          kind: 'text',
          value: 'damage',
          operator: 'and'
        })

        // Fire // Ice oracle text contains "damage"
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Spirit token does not contain "damage"
        expect(filter.matches(testCards.spirit_token)).toBe(false)
      })

      test('should exclude oracle text with not operator', () => {
        const filter = new CardFilter({
          kind: 'text',
          value: 'flying',
          operator: 'not'
        })

        // Blessed Hippogriff has "Flying" so should be excluded
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)

        // Craw Wurm has no oracle text so should match
        expect(filter.matches(testCards.craw_wurm)).toBe(true)
      })

      test('should match any oracle text with or operator', () => {
        const filter = new CardFilter({
          kind: 'text',
          value: ['Flying', 'Devoid'],
          operator: 'or'
        })

        // Blessed Hippogriff has "Flying"
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Blinding Drone has "Devoid"
        expect(filter.matches(testCards.blinding_drone)).toBe(true)

        // Craw Wurm has neither
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle multi-face card oracle text', () => {
        const filter = new CardFilter({
          kind: 'text',
          value: 'indestructible',
          operator: 'and'
        })

        // Blessed Hippogriff // Tyr's Blessing has "indestructible" in adventure side
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Fire // Ice does not contain "indestructible"
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })
    })

    describe('flavor text filtering', () => {
      test('should match flavor text with and operator', () => {
        const filter = new CardFilter({
          kind: 'flavor',
          value: 'terrifying',
          operator: 'and'
        })

        // Craw Wurm has flavor text containing "terrifying"
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Fire // Ice has no flavor text
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })

      test('should exclude flavor text with not operator', () => {
        const filter = new CardFilter({
          kind: 'flavor',
          value: 'forest',
          operator: 'not'
        })

        // Craw Wurm has "forest" in flavor text so should be excluded
        expect(filter.matches(testCards.craw_wurm)).toBe(false)

        // Blinding Drone has different flavor text so should match
        expect(filter.matches(testCards.blinding_drone)).toBe(true)
      })

      test('should handle cards without flavor text', () => {
        const filter = new CardFilter({
          kind: 'flavor',
          value: 'anything',
          operator: 'and'
        })

        // Fire // Ice has no flavor text
        expect(filter.matches(testCards.fire_ice)).toBe(false)

        // Spirit token has no flavor text
        expect(filter.matches(testCards.spirit_token)).toBe(false)
      })
    })

    describe('set filtering', () => {
      test('should match cards from specific set', () => {
        const filter = new CardFilter({
          kind: 'set',
          value: 'dmr',
          operator: 'and'
        })

        // Fire // Ice is from dmr set
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Craw Wurm is from m10 set
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should exclude cards from specific set', () => {
        const filter = new CardFilter({
          kind: 'set',
          value: 'm10',
          operator: 'not'
        })

        // Craw Wurm is from m10 so should be excluded
        expect(filter.matches(testCards.craw_wurm)).toBe(false)

        // Fire // Ice is from dmr so should match
        expect(filter.matches(testCards.fire_ice)).toBe(true)
      })

      test('should match multiple sets with or operator', () => {
        const filter = new CardFilter({
          kind: 'set',
          value: ['dmr', 'clb'],
          operator: 'or'
        })

        // Fire // Ice is from dmr
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Blessed Hippogriff is from clb
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Craw Wurm is from m10
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })
    })

    describe('type filtering', () => {
      test('should match creature types', () => {
        const filter = new CardFilter({
          kind: 'type',
          value: 'creature',
          operator: 'and'
        })

        // Craw Wurm is a creature
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Fire // Ice is instant
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })

      test('should match instant and sorcery types', () => {
        const filter = new CardFilter({
          kind: 'type',
          value: 'instant',
          operator: 'and'
        })

        // Fire // Ice is instant
        expect(filter.matches(testCards.fire_ice)).toBe(true)

        // Craw Wurm is creature
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match planeswalker types', () => {
        const filter = new CardFilter({
          kind: 'type',
          value: 'planeswalker',
          operator: 'and'
        })

        // Arlinn Kord is a planeswalker
        expect(filter.matches(testCards.arlin_kord)).toBe(true)

        // Craw Wurm is creature
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match land types', () => {
        const filter = new CardFilter({
          kind: 'type',
          value: 'land',
          operator: 'and'
        })

        // Branchloft Pathway is a land
        expect(filter.matches(testCards.branchloft_pathway)).toBe(true)

        // Craw Wurm is creature
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle multi-face card types', () => {
        const filter = new CardFilter({
          kind: 'type',
          value: 'adventure',
          operator: 'and'
        })

        // Blessed Hippogriff // Tyr's Blessing has adventure
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Fire // Ice does not have adventure
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })
    })
  })

  describe('number field filters', () => {
    describe('cmc filtering', () => {
      test('should match cards with exact cmc using = operator', () => {
        const filter = new CardFilter({
          kind: 'cmc',
          value: '4',
          operator: '='
        })

        // Fire // Ice, Blessed Hippogriff, Arlinn Kord, and Invasion of Vryn all have CMC 4
        expect(filter.matches(testCards.fire_ice)).toBe(true)
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)
        expect(filter.matches(testCards.arlin_kord)).toBe(true)
        expect(filter.matches(testCards.invasion_of_vryn)).toBe(true)

        // Craw Wurm has CMC 6
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match cards with cmc >= value', () => {
        const filter = new CardFilter({
          kind: 'cmc',
          value: '5',
          operator: '>='
        })

        // Craw Wurm and Akoum Warrior have CMC 6
        expect(filter.matches(testCards.craw_wurm)).toBe(true)
        expect(filter.matches(testCards.akoum_warrior)).toBe(true)

        // Fire // Ice has CMC 4
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })

      test('should match cards with cmc <= value', () => {
        const filter = new CardFilter({
          kind: 'cmc',
          value: '3',
          operator: '<='
        })

        // Blinding Drone has CMC 2
        expect(filter.matches(testCards.blinding_drone)).toBe(true)

        // Spirit token has CMC 0
        expect(filter.matches(testCards.spirit_token)).toBe(true)

        // Fire // Ice has CMC 4
        expect(filter.matches(testCards.fire_ice)).toBe(false)
      })

      test('should handle split cards cmc calculation', () => {
        const filter = new CardFilter({
          kind: 'cmc',
          value: '4',
          operator: '='
        })

        // Fire // Ice is a split card with combined CMC of 4
        expect(filter.matches(testCards.fire_ice)).toBe(true)
      })
    })

    describe('power filtering', () => {
      test('should match creatures with exact power', () => {
        const filter = new CardFilter({
          kind: 'power',
          value: '6',
          operator: '='
        })

        // Craw Wurm has power 6
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Blessed Hippogriff has power 2
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
      })

      test('should match creatures with power >= value', () => {
        const filter = new CardFilter({
          kind: 'power',
          value: '4',
          operator: '>='
        })

        // Craw Wurm has power 6
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Akoum Warrior has power 4
        expect(filter.matches(testCards.akoum_warrior)).toBe(true)

        // Blessed Hippogriff has power 2
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
      })

      test('should match creatures with power <= value', () => {
        const filter = new CardFilter({
          kind: 'power',
          value: '2',
          operator: '<='
        })

        // Blessed Hippogriff has power 2
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Blinding Drone has power 1
        expect(filter.matches(testCards.blinding_drone)).toBe(true)

        // Craw Wurm has power 6
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle non-creature cards', () => {
        const filter = new CardFilter({
          kind: 'power',
          value: '1',
          operator: '>='
        })

        // Fire // Ice is an instant (no power)
        expect(filter.matches(testCards.fire_ice)).toBe(false)

        // Arlinn Kord is a planeswalker (no power)
        expect(filter.matches(testCards.arlin_kord)).toBe(false)
      })

      test('should handle variable power (*)', () => {
        const filter = new CardFilter({
          kind: 'power',
          value: '0',
          operator: '>='
        })

        // Spirit token has * power which should not match numeric comparisons
        expect(filter.matches(testCards.spirit_token)).toBe(false)
      })
    })

    describe('toughness filtering', () => {
      test('should match creatures with exact toughness', () => {
        const filter = new CardFilter({
          kind: 'toughness',
          value: '4',
          operator: '='
        })

        // Craw Wurm has toughness 4
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Blessed Hippogriff has toughness 3
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
      })

      test('should match creatures with toughness >= value', () => {
        const filter = new CardFilter({
          kind: 'toughness',
          value: '4',
          operator: '>='
        })

        // Craw Wurm has toughness 4
        expect(filter.matches(testCards.craw_wurm)).toBe(true)

        // Akoum Warrior has toughness 5
        expect(filter.matches(testCards.akoum_warrior)).toBe(true)

        // Blessed Hippogriff has toughness 3
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(false)
      })

      test('should match creatures with toughness <= value', () => {
        const filter = new CardFilter({
          kind: 'toughness',
          value: '3',
          operator: '<='
        })

        // Blessed Hippogriff has toughness 3
        expect(filter.matches(testCards.blessed_hippogriff)).toBe(true)

        // Blinding Drone has toughness 3
        expect(filter.matches(testCards.blinding_drone)).toBe(true)

        // Craw Wurm has toughness 4
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle variable toughness (*)', () => {
        const filter = new CardFilter({
          kind: 'toughness',
          value: '0',
          operator: '>='
        })

        // Spirit token has * toughness which should not match numeric comparisons
        expect(filter.matches(testCards.spirit_token)).toBe(false)
      })
    })

    describe('loyalty filtering', () => {
      test('should match planeswalkers with exact loyalty', () => {
        const filter = new CardFilter({
          kind: 'loyalty',
          value: '3',
          operator: '='
        })

        // Arlinn Kord has loyalty 3
        expect(filter.matches(testCards.arlin_kord)).toBe(true)

        // Craw Wurm is not a planeswalker
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match planeswalkers with loyalty >= value', () => {
        const filter = new CardFilter({
          kind: 'loyalty',
          value: '2',
          operator: '>='
        })

        // Arlinn Kord has loyalty 3
        expect(filter.matches(testCards.arlin_kord)).toBe(true)

        // Craw Wurm is not a planeswalker
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match planeswalkers with loyalty <= value', () => {
        const filter = new CardFilter({
          kind: 'loyalty',
          value: '5',
          operator: '<='
        })

        // Arlinn Kord has loyalty 3
        expect(filter.matches(testCards.arlin_kord)).toBe(true)

        // Craw Wurm is not a planeswalker
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle non-planeswalker cards', () => {
        const filter = new CardFilter({
          kind: 'loyalty',
          value: '1',
          operator: '>='
        })

        // Fire // Ice is an instant (no loyalty)
        expect(filter.matches(testCards.fire_ice)).toBe(false)

        // Craw Wurm is a creature (no loyalty)
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })
    })

    describe('defense filtering', () => {
      test('should match battles with exact defense', () => {
        const filter = new CardFilter({
          kind: 'defense',
          value: '4',
          operator: '='
        })

        // Invasion of Vryn has defense 4
        expect(filter.matches(testCards.invasion_of_vryn)).toBe(true)

        // Craw Wurm is not a battle
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match battles with defense >= value', () => {
        const filter = new CardFilter({
          kind: 'defense',
          value: '3',
          operator: '>='
        })

        // Invasion of Vryn has defense 4
        expect(filter.matches(testCards.invasion_of_vryn)).toBe(true)

        // Craw Wurm is not a battle
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should match battles with defense <= value', () => {
        const filter = new CardFilter({
          kind: 'defense',
          value: '5',
          operator: '<='
        })

        // Invasion of Vryn has defense 4
        expect(filter.matches(testCards.invasion_of_vryn)).toBe(true)

        // Craw Wurm is not a battle
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })

      test('should handle non-battle cards', () => {
        const filter = new CardFilter({
          kind: 'defense',
          value: '1',
          operator: '>='
        })

        // Fire // Ice is an instant (no defense)
        expect(filter.matches(testCards.fire_ice)).toBe(false)

        // Craw Wurm is a creature (no defense)
        expect(filter.matches(testCards.craw_wurm)).toBe(false)
      })
    })
  })

  describe('error handling', () => {
    test('should throw error for unhandled string operators', () => {
      const filter = new CardFilter({
        kind: 'name',
        value: 'test',
        operator: 'invalid'
      })

      expect(() => {
        filter.matches(testCards.fire_ice)
      }).toThrow('Unhandled string operator: invalid')
    })

    test('should throw error for unhandled numeric operators', () => {
      const filter = new CardFilter({
        kind: 'cmc',
        value: '3',
        operator: 'invalid'
      })

      expect(() => {
        filter.matches(testCards.fire_ice)
      }).toThrow('Unhandled numeric operator: invalid')
    })

    test('should throw error for unhandled filter fields', () => {
      const filter = new CardFilter({
        kind: 'invalid_field',
        value: 'test',
        operator: 'and'
      })

      expect(() => {
        filter.matches(testCards.fire_ice)
      }).toThrow('Unhandled filter field: invalid_field')
    })
  })

  describe('edge cases', () => {
    test('should handle cards with missing properties', () => {
      const filter = new CardFilter({
        kind: 'power',
        value: '1',
        operator: '>='
      })

      // Fire // Ice is an instant with no power property
      expect(filter.matches(testCards.fire_ice)).toBe(false)

      // Arlinn Kord is a planeswalker with no power property
      expect(filter.matches(testCards.arlin_kord)).toBe(false)
    })

    test('should handle empty filter values', () => {
      const filter = new CardFilter({
        kind: 'name',
        value: '',
        operator: 'and'
      })

      // Empty string should match all cards (since all names contain empty string)
      expect(filter.matches(testCards.fire_ice)).toBe(true)
      expect(filter.matches(testCards.craw_wurm)).toBe(true)
    })

    test('should handle special numeric values (-999)', () => {
      // Create a mock card with -999 power to test the special case
      const mockCard = {
        power: () => '-999',
        numFaces: () => 1
      }

      const filter = new CardFilter({
        kind: 'power',
        value: '0',
        operator: '>='
      })

      // Cards with -999 power should not match any numeric filter
      expect(filter.matches(mockCard)).toBe(false)
    })

    test('should handle multi-face cards consistently', () => {
      const nameFilter = new CardFilter({
        kind: 'name',
        value: 'ice',
        operator: 'and'
      })

      const textFilter = new CardFilter({
        kind: 'text',
        value: 'tap',
        operator: 'and'
      })

      // Fire // Ice should match both name and text filters across faces
      expect(nameFilter.matches(testCards.fire_ice)).toBe(true)
      expect(textFilter.matches(testCards.fire_ice)).toBe(true)

      // Blessed Hippogriff // Tyr's Blessing should handle adventure correctly
      const adventureFilter = new CardFilter({
        kind: 'text',
        value: 'indestructible',
        operator: 'and'
      })
      expect(adventureFilter.matches(testCards.blessed_hippogriff)).toBe(true)
    })
  })

  describe('complex filter combinations', () => {
    test('should handle multiple color requirements', () => {
      // Test exact color identity matching with multiple colors
      const exactRedBlueFilter = new CardFilter({
        kind: 'identity',
        red: true,
        blue: true,
        only: true
      })

      // Fire // Ice has exactly red and blue identity
      expect(exactRedBlueFilter.matches(testCards.fire_ice)).toBe(true)

      // Arlinn Kord has red and green (not exact match)
      expect(exactRedBlueFilter.matches(testCards.arlin_kord)).toBe(false)

      // Test OR logic with colors
      const redOrGreenFilter = new CardFilter({
        kind: 'colors',
        red: true,
        green: true,
        or: true
      })

      // Fire // Ice has red
      expect(redOrGreenFilter.matches(testCards.fire_ice)).toBe(true)

      // Craw Wurm has green
      expect(redOrGreenFilter.matches(testCards.craw_wurm)).toBe(true)

      // Blessed Hippogriff has white (neither red nor green)
      expect(redOrGreenFilter.matches(testCards.blessed_hippogriff)).toBe(false)
    })

    test('should handle combined text and numeric filters', () => {
      // Test creature type with specific power
      const creatureFilter = new CardFilter({
        kind: 'type',
        value: 'creature',
        operator: 'and'
      })

      const powerFilter = new CardFilter({
        kind: 'power',
        value: '4',
        operator: '>='
      })

      // Craw Wurm is a creature with power 6
      expect(creatureFilter.matches(testCards.craw_wurm)).toBe(true)
      expect(powerFilter.matches(testCards.craw_wurm)).toBe(true)

      // Akoum Warrior is a creature with power 4
      expect(creatureFilter.matches(testCards.akoum_warrior)).toBe(true)
      expect(powerFilter.matches(testCards.akoum_warrior)).toBe(true)

      // Blessed Hippogriff is a creature with power 2 (fails power filter)
      expect(creatureFilter.matches(testCards.blessed_hippogriff)).toBe(true)
      expect(powerFilter.matches(testCards.blessed_hippogriff)).toBe(false)

      // Fire // Ice is not a creature
      expect(creatureFilter.matches(testCards.fire_ice)).toBe(false)
      expect(powerFilter.matches(testCards.fire_ice)).toBe(false)
    })

    test('should handle edge cases with transform cards', () => {
      // Test that transform cards work with various filter types
      const planeswalkerFilter = new CardFilter({
        kind: 'type',
        value: 'planeswalker',
        operator: 'and'
      })

      const loyaltyFilter = new CardFilter({
        kind: 'loyalty',
        value: '2',
        operator: '>='
      })

      const redFilter = new CardFilter({
        kind: 'colors',
        red: true
      })

      // Arlinn Kord is a red planeswalker with loyalty 3
      expect(planeswalkerFilter.matches(testCards.arlin_kord)).toBe(true)
      expect(loyaltyFilter.matches(testCards.arlin_kord)).toBe(true)
      expect(redFilter.matches(testCards.arlin_kord)).toBe(true)

      // Test adventure cards
      const adventureFilter = new CardFilter({
        kind: 'type',
        value: 'adventure',
        operator: 'and'
      })

      const whiteFilter = new CardFilter({
        kind: 'colors',
        white: true
      })

      // Blessed Hippogriff // Tyr's Blessing is a white adventure
      expect(adventureFilter.matches(testCards.blessed_hippogriff)).toBe(true)
      expect(whiteFilter.matches(testCards.blessed_hippogriff)).toBe(true)

      // Test battle cards
      const battleFilter = new CardFilter({
        kind: 'type',
        value: 'battle',
        operator: 'and'
      })

      const defenseFilter = new CardFilter({
        kind: 'defense',
        value: '3',
        operator: '>='
      })

      // Invasion of Vryn is a battle with defense 4
      expect(battleFilter.matches(testCards.invasion_of_vryn)).toBe(true)
      expect(defenseFilter.matches(testCards.invasion_of_vryn)).toBe(true)
    })
  })
})
