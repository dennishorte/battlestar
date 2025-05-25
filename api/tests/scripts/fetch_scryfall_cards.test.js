import { processSingleCard } from '../../scripts/fetch_scryfall_cards.js'
import { util } from 'battlestar-common'
import fs from 'fs'
import { describe, test, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'

function loadFiles(cardName) {
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

  const snakeName = util.toSnakeCase(cardName)
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return {
    input: loadJson(`${__dirname}/res/scryfall_${snakeName}.raw.json`),
    expected: loadJson(`${__dirname}/res/scryfall_${snakeName}.out.json`),
  }
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

  test('filters out excluded layout types', () => {
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
      set: "TST"
    }

    const result = processSingleCard(input)
    expect(result).toBeNull()
  })
})
