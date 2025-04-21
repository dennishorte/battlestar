const { processSingleCard } = require('../../scripts/fetch_scryfall_cards.js')
const { util } = require('battlestar-common')
const fs = require('fs')


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
  return {
    input: loadJson(`${__dirname}/res/scryfall_${snakeName}.raw.json`),
    expected: loadJson(`${__dirname}/res/scryfall_${snakeName}.out.json`),
  }
}

describe('Card Processing', () => {
  test('processes a basic card correctly', () => {
    const { input, expected }  = loadFiles('Craw Wurm')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes a double-faced card correctly', () => {
    const { input, expected }  = loadFiles('Accursed Witch')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes a split card correctly', () => {
    const { input, expected }  = loadFiles('Fire Ice')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes dfc land/creatures correctly', () => {
    const { input, expected }  = loadFiles('Akoum Warrior')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
  })

  test('processes sieges correctly', () => {
    const { input, expected }  = loadFiles('Invasion of Vryn')
    const result = processSingleCard(input)
    expect(result).toEqual(expected)
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
