import { processSingleCard, processCards } from '../../scripts/fetch_scryfall_cards.js'
import { util } from 'battlestar-common'
import fs from 'fs'
import { describe, test, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadJson(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8')
    return JSON.parse(data)
  }
  catch (e) {
    console.log('Error loading file: ' + filename)
    throw e
  }
}

function loadFiles(cardName) {
  const snakeName = util.toSnakeCase(cardName)
  return {
    input: loadJson(`${__dirname}/res/scryfall_${snakeName}.raw.json`),
    expected: loadJson(`${__dirname}/res/scryfall_${snakeName}.out.json`),
  }
}

function loadRaw(fixtureName) {
  return loadJson(`${__dirname}/res/scryfall_${fixtureName}.raw.json`)
}

function loadExpected(fixtureName) {
  return loadJson(`${__dirname}/res/scryfall_${fixtureName}.out.json`)
}

describe('Card Processing', () => {
  test('processes a basic card correctly', () => {
    const { input, expected } = loadFiles('Craw Wurm')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes a double-faced card correctly', () => {
    const { input, expected } = loadFiles('Accursed Witch')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes a split card correctly', () => {
    const { input, expected } = loadFiles('Fire Ice')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  describe('double faced cards', () => {
    test('processes dfc land/creatures correctly', () => {
      const { input, expected } = loadFiles('Akoum Warrior')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('dfc land/land', () => {
      const { input, expected } = loadFiles('Branchloft Pathway')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })
  })

  test('processes sieges correctly', () => {
    const { input, expected } = loadFiles('Invasion of Vryn')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  describe('adventure', () => {
    test('process adventures correctly', () => {
      const { input, expected } = loadFiles('Blessed Hippogriff')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('handle adventures with different color faces', () => {
      const { input, expected } = loadFiles('Callous Sell Sword')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('also works with omens', () => {

    })
  })

  describe('color indicators', () => {
    test('process a token correctly', () => {
      const { input, expected } = loadFiles('Spirit Token')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('process a double-faced card correctly', () => {
      const { input, expected } = loadFiles('Arlin Kord')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('process a devoid card correctly', () => {
      const { input, expected } = loadFiles('Blinding Drone')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })
  })

  describe('layout coverage', () => {
    test('processes a saga card correctly', () => {
      const input = loadRaw('saga')
      const expected = loadExpected('saga')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('processes a modal_dfc card correctly', () => {
      const input = loadRaw('modal_dfc')
      const expected = loadExpected('modal_dfc')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('processes a card with produced_mana on a multi-face card', () => {
      const input = loadRaw('produced_mana_multi')
      const expected = loadExpected('produced_mana_multi')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })
  })

  describe('prefilterVersions', () => {
    test('filters out non-English cards', () => {
      const input = {
        id: "card-id-789",
        name: "Carta de Prueba",
        lang: "es",
        mana_cost: "{1}{R}",
        type_line: "Criatura — Mago",
        oracle_text: "Esta es una carta de prueba.",
        power: "2",
        toughness: "1",
        legalities: {
          standard: "legal"
        },
        image_uris: {
          art_crop: "https://example.com/image.jpg"
        },
        colors: ["R"],
        cmc: 2,
        rarity: "common",
        set: "TST"
      }

      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out art_series layout', () => {
      const input = {
        id: "card-id-101",
        name: "Art Card",
        lang: "en",
        layout: "art_series",
        mana_cost: "{1}{W}",
        type_line: "Card",
        oracle_text: "This is an art card.",
        legalities: {
          standard: "not_legal"
        },
        image_uris: {
          art_crop: "https://example.com/art.jpg"
        },
        colors: ["W"],
        cmc: 2,
        rarity: "special",
        set: "TST"
      }

      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out vanguard layout', () => {
      const input = loadRaw('vanguard')
      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out double_faced_token layout', () => {
      const input = loadRaw('double_faced_token')
      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out scheme layout', () => {
      const input = loadRaw('scheme')
      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out textless cards', () => {
      const input = loadRaw('textless')
      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('allows full_art cards when no normal version exists', () => {
      const input = loadRaw('full_art')
      const expected = loadExpected('full_art')
      const result = processSingleCard(input)
      expect(result).toEqual(expected)
    })

    test('filters out full_art cards when a normal version exists in the batch', () => {
      const fullArt = loadRaw('full_art')
      fullArt.collector_number = '380'
      const normalVersion = {
        ...JSON.parse(JSON.stringify(fullArt)),
        id: 'normal-forest-id',
        full_art: false,
        collector_number: '381',
      }

      const results = processCards([fullArt, normalVersion])
      // Only the normal version should remain
      expect(results).toHaveLength(1)
      expect(results[0].data.card_faces[0].name).toBe('Forest')
      expect(results[0].data.collector_number).toBe('381')
    })

    test('keeps full_art card when it is the only version in the batch', () => {
      const fullArt = loadRaw('full_art')
      fullArt.collector_number = '382'
      const results = processCards([fullArt])
      expect(results).toHaveLength(1)
      expect(results[0].data.card_faces[0].name).toBe('Forest')
      expect(results[0].data.collector_number).toBe('382')
    })
  })

  describe('generateAltNames', () => {
    test('card with printed_name produces two entries in output', () => {
      const input = loadRaw('printed_name_single')
      const results = processCards([input])
      expect(results).toHaveLength(2)

      // First entry uses the original name
      expect(results[0].data.card_faces[0].name).toBe('Iron Spider, Stark Upgrade')

      // Second entry uses the printed_name as the name
      expect(results[1].data.card_faces[0].name).toBe('Fizik, Etherium Mechanic')
    })

    test('multi-face card with printed_name on faces produces two entries', () => {
      const input = loadRaw('printed_name_multi')
      const results = processCards([input])
      expect(results).toHaveLength(2)

      // First entry uses original face names
      expect(results[0].data.card_faces[0].name).toBe('Peter Parker')
      expect(results[0].data.card_faces[1].name).toBe('Amazing Spider-Man')

      // Second entry uses printed_name values
      expect(results[1].data.card_faces[0].name).toBe('Surris, Spidersilk Innovator')
      expect(results[1].data.card_faces[1].name).toBe('Surris, Silk-Tech Vanguard')
    })
  })

  describe('postfilterVersions', () => {
    test('filters out cards with "Card" in type_line', () => {
      const input = {
        id: "card-id-102",
        name: "Test Card",
        lang: "en",
        mana_cost: "{1}{B}",
        type_line: "Card — Special",
        oracle_text: "This is a special card.",
        legalities: {
          standard: "not_legal"
        },
        image_uris: {
          art_crop: "https://example.com/special.jpg"
        },
        colors: ["B"],
        cmc: 2,
        rarity: "common",
        set: "TST",
        collector_number: "1"
      }

      const result = processSingleCard(input)
      expect(result).toBeNull()
    })

    test('filters out cards missing type_line', () => {
      const input = {
        id: "card-id-103",
        name: "No Type Card",
        lang: "en",
        mana_cost: "{2}",
        oracle_text: "A card with no type line.",
        legalities: {
          standard: "not_legal"
        },
        image_uris: {
          art_crop: "https://example.com/notype.jpg"
        },
        cmc: 2,
        rarity: "common",
        set: "TST",
        collector_number: "2"
      }

      const result = processSingleCard(input)
      expect(result).toBeNull()
    })
  })

  describe('processCards', () => {
    function makeCard(overrides) {
      return {
        id: "batch-card-" + Math.random(),
        name: "Batch Test Card",
        lang: "en",
        layout: "normal",
        mana_cost: "{1}{G}",
        type_line: "Creature — Beast",
        oracle_text: "Trample",
        power: "3",
        toughness: "3",
        legalities: { standard: "legal" },
        image_uris: { art_crop: "https://example.com/batch.jpg" },
        colors: ["G"],
        rarity: "common",
        set: "TST",
        collector_number: String(Math.floor(Math.random() * 100000)),
        digital: false,
        textless: false,
        full_art: false,
        ...overrides,
      }
    }

    test('processes multiple cards and returns array of { _id, source, data } objects', () => {
      const card1 = makeCard({ name: "Batch Alpha", collector_number: "901" })
      const card2 = makeCard({ name: "Batch Beta", collector_number: "902" })
      const results = processCards([card1, card2])

      expect(results).toHaveLength(2)
      for (const result of results) {
        expect(result).toHaveProperty('_id')
        expect(result).toHaveProperty('source', 'scryfall')
        expect(result).toHaveProperty('data')
        expect(result._id).toBe(result.data._id)
      }
    })

    test('mixed batch with filterable and valid cards returns correct subset', () => {
      const validCard = makeCard({ name: "Batch Gamma", collector_number: "903" })
      const filteredCard = makeCard({ name: "Batch Vanguard", collector_number: "904", layout: "vanguard" })
      const results = processCards([validCard, filteredCard])

      // vanguard is filtered out, valid card passes through
      expect(results).toHaveLength(1)
      expect(results[0].data.card_faces[0].name).toBe('Batch Gamma')
    })
  })
})
