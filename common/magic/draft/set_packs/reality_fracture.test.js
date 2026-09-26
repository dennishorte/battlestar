const seedrandom = require('seedrandom')

const { MagicCard } = require('../../MagicCard.js')
const { makeSetPacks } = require('../pack.js')
const {
  createPackGenerator,
  ECHOED_PAIRS,
  COMMON_DUALS,
  DEFAULT_BASICS,
} = require('./reality_fracture.js')


const ECHOED_NUMBERS = new Set(ECHOED_PAIRS.flat())
const LAND_NUMBERS = new Set([...COMMON_DUALS])
for (let n = DEFAULT_BASICS.from; n <= DEFAULT_BASICS.to; n++) {
  LAND_NUMBERS.add(n)
}

// A subset of the real echoed pairs: 1 mythic, 1 rare, 2 uncommon.
const TEST_PAIRS = [
  [195, 242, 'mythic'],
  [198, 230, 'rare'],
  [196, 227, 'uncommon'],
  [197, 260, 'uncommon'],
]

function fakeCard(collectorNumber, rarity, opts={}) {
  return new MagicCard(null, {
    _id: `fra-${collectorNumber}`,
    source: 'scryfall',
    data: {
      set: 'fra',
      collector_number: String(collectorNumber),
      rarity,
      layout: 'normal',
      card_faces: [{
        name: opts.name || `Card ${collectorNumber}`,
        type_line: opts.typeLine || 'Creature',
      }],
    },
  })
}

function fakeSet() {
  const cards = []

  // Main pool
  for (let n = 1; n <= 10; n++) {
    cards.push(fakeCard(n, 'common'))
  }
  for (let n = 20; n <= 29; n++) {
    cards.push(fakeCard(n, 'uncommon'))
  }
  for (let n = 40; n <= 45; n++) {
    cards.push(fakeCard(n, 'rare'))
  }
  for (let n = 50; n <= 51; n++) {
    cards.push(fakeCard(n, 'mythic'))
  }

  // Land slot
  for (const n of COMMON_DUALS) {
    cards.push(fakeCard(n, 'common', { name: `Dual ${n}`, typeLine: 'Land' }))
  }
  for (let n = DEFAULT_BASICS.from; n <= DEFAULT_BASICS.to; n++) {
    cards.push(fakeCard(n, 'common', { name: `Basic ${n}`, typeLine: 'Basic Land — Plains' }))
  }

  // Echoed pairs
  for (const [a, b, rarity] of TEST_PAIRS) {
    cards.push(fakeCard(a, rarity))
    cards.push(fakeCard(b, rarity))
  }

  return cards
}

function num(card) {
  return parseInt(card.collectorNumber(), 10)
}

function isMainCard(card) {
  const n = num(card)
  return n <= 290 && !ECHOED_NUMBERS.has(n) && !LAND_NUMBERS.has(n)
}

function isEchoed(card) {
  return ECHOED_NUMBERS.has(num(card))
}

function isLandSlotCard(card) {
  return LAND_NUMBERS.has(num(card))
}

function isSamePair(a, b) {
  return ECHOED_PAIRS.some(
    ([x, y]) => (num(a) === x && num(b) === y) || (num(a) === y && num(b) === x)
  )
}


describe('reality fracture pack generation', () => {
  test('pack has 14 cards', () => {
    const openPack = createPackGenerator(fakeSet(), { rng: seedrandom('a') })
    expect(openPack()).toHaveLength(14)
  })

  test('slots are filled from the right pools', () => {
    const openPack = createPackGenerator(fakeSet(), { rng: seedrandom('b') })
    const pack = openPack()

    // Six commons
    expect(pack.slice(0, 6).every(c => isMainCard(c) && c.rarity() === 'common')).toBe(true)

    // One uncommon
    expect(isMainCard(pack[6]) && pack[6].rarity() === 'uncommon').toBe(true)

    // One common-or-uncommon
    expect(isMainCard(pack[7]) && ['common', 'uncommon'].includes(pack[7].rarity())).toBe(true)

    // Matched echoed pair
    expect(isEchoed(pack[8])).toBe(true)
    expect(isEchoed(pack[9])).toBe(true)
    expect(isSamePair(pack[8], pack[9])).toBe(true)

    // One other echoed card (not part of the matched pair)
    expect(isEchoed(pack[10])).toBe(true)
    expect(!isSamePair(pack[10], pack[8])).toBe(true)

    // One rare or mythic
    expect(isMainCard(pack[11]) && ['rare', 'mythic'].includes(pack[11].rarity())).toBe(true)

    // One foil from the main set or echoed cards (never a land-slot card)
    expect(!isLandSlotCard(pack[12])).toBe(true)
    expect(parseInt(pack[12].collectorNumber(), 10) <= 290).toBe(true)

    // One land
    expect(isLandSlotCard(pack[13])).toBe(true)
  })

  test('commons are distinct within a pack', () => {
    const openPack = createPackGenerator(fakeSet(), { rng: seedrandom('c') })
    for (let i = 0; i < 50; i++) {
      const commons = openPack().slice(0, 6).map(c => c.collectorNumber())
      expect(new Set(commons).size).toBe(6)
    }
  })

  test('pair rarities appear roughly at slot rates over many packs', () => {
    const openPack = createPackGenerator(fakeSet(), { rng: seedrandom('d') })
    const counts = { mythic: 0, rare: 0, uncommon: 0 }
    for (let i = 0; i < 1000; i++) {
      counts[openPack()[8].rarity()] += 1
    }
    // Slot rates: 88.9% uncommon, 6.7% rare, 1.4% mythic — loose bounds
    expect(counts.uncommon).toBeGreaterThan(800)
    expect(counts.rare).toBeGreaterThan(20)
    expect(counts.mythic).toBeGreaterThan(0)
  })

  test('land slot draws only duals and basics', () => {
    const openPack = createPackGenerator(fakeSet(), { rng: seedrandom('e') })
    let sawDual = false
    let sawBasic = false
    for (let i = 0; i < 200; i++) {
      const land = openPack()[13]
      expect(isLandSlotCard(land)).toBe(true)
      if (COMMON_DUALS.includes(num(land))) {
        sawDual = true
      }
      else {
        sawBasic = true
      }
    }
    expect(sawDual).toBe(true)
    expect(sawBasic).toBe(true)
  })

  test('throws when echoed pair cards are missing', () => {
    const cards = fakeSet().filter(c => !isEchoed(c))
    expect(() => createPackGenerator(cards, { rng: seedrandom('x') })).toThrow('echoed pair')
  })
})

describe('makeSetPacks dispatch', () => {
  test('uses the reality fracture generator for set code fra', () => {
    const packs = makeSetPacks(fakeSet(), {
      numPacks: 1,
      numPlayers: 1,
      setCode: 'fra',
      rng: seedrandom('f'),
    })

    expect(packs).toHaveLength(1)
    const pack = packs[0]
    expect(pack).toHaveLength(14)

    // Cards are converted to pack-card shape and a matched pair is present
    expect(pack.every(c => typeof c.id === 'string' && c.name && c._id)).toBe(true)
    const ids = new Set(pack.map(c => c.id))
    expect(ids.size).toBe(14)

    // The pack contains both halves of an echoed pair — proof the FRA
    // generator ran rather than the default rarity-based one.
    const cardNumbers = new Set(pack.map(c => parseInt(c._id.split('-')[1], 10)))
    const hasPair = ECHOED_PAIRS.some(([a, b]) => cardNumbers.has(a) && cardNumbers.has(b))
    expect(hasPair).toBe(true)
  })

  test('falls back to the default generator for other sets', () => {
    const packs = makeSetPacks(fakeSet(), {
      numPacks: 1,
      numPlayers: 1,
      setCode: 'xyz',
      rng: seedrandom('g'),
    })

    // Default pack: 1 rare/mythic + 3 uncommons + 10 commons
    expect(packs[0]).toHaveLength(14)
  })
})
