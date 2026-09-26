/**
 * Reality Fracture (set code: fra) play booster generator.
 *
 * Sources:
 * - Slot structure and percentages: WotC, "Collecting Reality Fracture".
 * - Echoed-pair mechanic: the echoed cards sit on one print sheet in pair
 *   order (1A, 1B, 2A, 2B, ...) and each pack takes three consecutive cards,
 *   so every pack has one full pair plus one half of a neighbouring pair.
 *   The print-sheet order isn't public, so the third echoed card is drawn
 *   at random from the other pairs instead of being the true neighbour.
 * - How a slot's percentage splits across individual cards: evenly within
 *   each rarity.
 * - Card treatments (borderless, etc.) are folded into their plain versions
 *   by only looking at collector numbers <= MAIN_SET_MAX, and the Special
 *   Guests common replacement is left out.
 *
 * Pack (14 cards): 6 common, 1 uncommon, 1 common-or-uncommon, 2 matched
 * echoed pair, 1 other echoed card, 1 rare/mythic, 1 foil (any rarity),
 * 1 land.
 */

// Collector numbers of the 43 echoed pairs (33 uncommon, 7 rare, 3 mythic).
const ECHOED_PAIRS = [
  [195, 242], // Ajani Resolute / Ajani Unrelenting (M)
  [196, 227], // Danitha, Sword of Hope / Danitha, Spear of Agony
  [197, 260], // Ghalta the Immovable / Ghalta the Unstoppable
  [198, 230], // Gideon's Memorial / Gideon the Oathless (R)
  [199, 248], // Koth of the Homestead / Koth, the Geomancer
  [200, 231], // Liliana the Faultless / Liliana the Repentant (R)
  [201, 217], // Lyra, Archangel of Dawn / Lyra, Tolarian Archangel (R)
  [203, 275], // Saheeli, Consul of Oversight / Saheeli, Jewel of Avishkar
  [204, 236], // Teyo, Lightshield Expert / Teyo, Diamondblade Mage
  [205, 214], // Thalia, the Survivor / Geist of Saint Thalia
  [206, 253], // Tomik, Orzhov Lawmage / Tomik, Izzet Sparkmage
  [208, 255], // Way of the Mentor / Way of the Warlord
  [209, 269], // Yoshimaru, Beloved Companion / Yoshimaru, Scrappy Stray
  [210, 226], // Yuriko, Blade of the Mighty / Yuriko, Hope from the Shadows
  [211, 243], // Arni, Humble Scribe / Arni, Renowned Champion
  [212, 244], // Chandra, Chill of Compliance / Chandra, Torch of Defiance (M)
  [213, 258], // Fblthp, Impossibly Lost / Fblthp, Knows the Way
  [215, 271], // Hapatra, the Desert Frost / Hapatra, the Desert Fang
  [216, 276], // Jace, Reality Sculptor / Tam, the Possibility (R)
  [218, 235], // Proft, Consulting Detective / Proft, Sinister Mastermind
  [219, 265], // Ruric Thar, Biomagus / Ruric Thar, Magecrusher
  [220, 251], // Samut, Tyrant of Naktamun / Samut, Hazoret's Champion (R)
  [221, 252], // Tetsuko Umezawa, Fugitive / Tetsuko Umezawa, Pursuer
  [222, 280], // Traxos, Academy Guardian / Traxos, Scourge Eternal
  [224, 267], // Way of the Mind Sculptor / Way of the Paradox
  [225, 241], // Yargle, Goliath of Otaria / Yargle, Glutton of Urborg
  [228, 245], // Gallia, Tragic Host / Gallia, the Merrymaker
  [229, 259], // Garruk, Veiled Butcher / Garruk, Curse Breaker (M)
  [232, 262], // Loot, the Anomaly / Loot, the Nexus
  [233, 274], // Mabel, Bitter Recluse / Mabel, Valley Hero
  [234, 202], // Massacre Girl, Most Wanted / Rescue Girl, First Responder
  [237, 266], // Tinybones, Pocket Nuisance / Titanbones, Towering Heart
  [239, 207], // Way of the Necromancer / Way of the Healer
  [240, 256], // Winter, Tormented Loner / Winter, Team Player
  [246, 261], // Jiang Yanggu, Alone / Jiang Yanggu, Never Alone
  [247, 273], // Kiora of Fire and Ashes / Kiora of Salt and Sand
  [249, 263], // Marwyn, the Clearcutter / Marwyn, the Preserver
  [250, 264], // Pia, Determined Rebuilder / Pia, Aether Ascetic
  [254, 223], // Way of the Pyromancer / Way of the Cryomancer
  [257, 270], // Edgar, Moonlit Sovereign / Edgar, Ancient Bloodlord
  [268, 238], // Way of the Wildspeaker / Way of the Deathbringer
  [272, 279], // Karn, Gilded Guardian / Karn, Argent Defender (R)
  [277, 278], // Vraska, Soul of Stone / Vraska, the Cutting Glare (R)
]

const MAIN_SET_MAX = 290
const DEFAULT_BASICS = { from: 281, to: 290 }
const TOWER_BASICS = { from: 382, to: 396 }
// The five "...Commons" and five "...Annex" dual lands; land slot only.
const COMMON_DUALS = [175, 177, 178, 182, 183, 184, 190, 192, 193, 194]

// Slot percentages (WotC), treatments folded into base rarity.
const RARE_SLOT = { rare: 83.3, mythic: 16.7 }
const COMMON_OR_UNCOMMON_SLOT = { common: 23, uncommon: 77 }
const ECHOED_SLOT = { uncommon: 88.9, rare: 6.7, mythic: 1.4 }
const FOIL_SLOT = { common: 49.5, uncommon: 40.5, rare: 6, mythic: 1.2 }
const COMMONS_PER_PACK = 6


////////////////////////////////////////////////////////////////////////////////
// Weighted drawing
// A "sheet" is a list of [card, relative weight] entries.

function _pickWeighted(entries, rng) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rng() * total
  for (const [item, weight] of entries) {
    roll -= weight
    if (roll < 0) {
      return item
    }
  }
  return entries[entries.length - 1][0]
}

// Draw `count` distinct cards from a sheet.
function _draw(sheet, count, rng) {
  const remaining = [...sheet]
  const picked = []
  for (let i = 0; i < count && remaining.length > 0; i++) {
    const card = _pickWeighted(remaining, rng)
    picked.push(card)
    remaining.splice(remaining.findIndex(([c]) => c === card), 1)
  }
  return picked
}

// Spread each rarity's slot percentage evenly over that rarity's cards.
function _rarityWeightedSheet(cards, shares) {
  const counts = {}
  for (const card of cards) {
    counts[card.rarity()] = (counts[card.rarity()] || 0) + 1
  }

  const sheet = []
  for (const card of cards) {
    const share = shares[card.rarity()]
    if (share) {
      sheet.push([card, share / counts[card.rarity()]])
    }
  }
  return sheet
}

function _uniformSheet(cards) {
  return cards.map(c => [c, 1])
}


////////////////////////////////////////////////////////////////////////////////
// Generator

/**
 * @param {Array} cards - MagicCard objects for the whole set
 * @param {Object} options
 * @param {Function} options.rng - Optional random source (default Math.random)
 * @returns {Function} openPack - Returns one pack as an array of MagicCards
 */
function createPackGenerator(cards, options={}) {
  const rng = options.rng || Math.random

  // Only the base printings are used for slot pools. Alternate treatments
  // (291+) and non-numeric collector numbers are skipped.
  const byNumber = new Map()
  for (const card of cards) {
    const number = parseInt(card.collectorNumber(), 10)
    if (Number.isNaN(number)) {
      continue
    }
    if (!byNumber.has(number)) {
      byNumber.set(number, card)
    }
  }

  const cardsInRange = ({ from, to }) =>
    [...byNumber].filter(([n]) => n >= from && n <= to).map(([, c]) => c)

  const echoedNumbers = new Set(ECHOED_PAIRS.flat())
  const landNumbers = new Set(COMMON_DUALS)
  for (let n = DEFAULT_BASICS.from; n <= DEFAULT_BASICS.to; n++) {
    landNumbers.add(n)
  }

  const main = [...byNumber]
    .filter(([n]) => n <= MAIN_SET_MAX && !echoedNumbers.has(n) && !landNumbers.has(n))
    .map(([, c]) => c)
  const ofRarity = rarity => main.filter(c => c.rarity() === rarity)

  const commons = ofRarity('common')
  const uncommons = ofRarity('uncommon')
  const raresMythics = [...ofRarity('rare'), ...ofRarity('mythic')]

  const pairs = ECHOED_PAIRS
    .map(([a, b]) => [byNumber.get(a), byNumber.get(b)])
    .filter(([a, b]) => Boolean(a && b))
  const echoedCards = pairs.flat()

  if (pairs.length === 0) {
    throw new Error('Reality Fracture pack generation requires echoed pair cards')
  }

  const commonSheet = _uniformSheet(commons)
  const uncommonSheet = _uniformSheet(uncommons)
  const commonOrUncommonSheet = _rarityWeightedSheet(
    [...commons, ...uncommons],
    COMMON_OR_UNCOMMON_SLOT,
  )
  const rareMythicSheet = _rarityWeightedSheet(raresMythics, RARE_SLOT)
  const foilSheet = _rarityWeightedSheet([...main, ...echoedCards], FOIL_SLOT)

  // Land groups that have no cards in the data (e.g. tower basics, which are
  // absent from Scryfall default_cards) contribute no weight.
  const landSheet = []
  for (const [groupCards, share] of [
    [cardsInRange(DEFAULT_BASICS), 18.2],
    [cardsInRange(TOWER_BASICS), 27.3],
    [COMMON_DUALS.map(n => byNumber.get(n)).filter(Boolean), 54.5],
  ]) {
    for (const card of groupCards) {
      landSheet.push([card, share / groupCards.length])
    }
  }

  // Which pair a pack gets: its rarity's echoed-slot share, split evenly over
  // the pairs of that rarity.
  const pairsPerRarity = {}
  for (const [a] of pairs) {
    pairsPerRarity[a.rarity()] = (pairsPerRarity[a.rarity()] || 0) + 1
  }
  const pairSheet = pairs.map(pair => [
    pair,
    (ECHOED_SLOT[pair[0].rarity()] || 0) / pairsPerRarity[pair[0].rarity()],
  ])

  return function openPack() {
    const [a, b] = _pickWeighted(pairSheet, rng)
    const otherEchoedSheet = _rarityWeightedSheet(
      echoedCards.filter(c => c !== a && c !== b),
      ECHOED_SLOT,
    )

    return [
      ..._draw(commonSheet, COMMONS_PER_PACK, rng),
      ..._draw(uncommonSheet, 1, rng),
      ..._draw(commonOrUncommonSheet, 1, rng),
      a,
      b,
      ..._draw(otherEchoedSheet, 1, rng),
      ..._draw(rareMythicSheet, 1, rng),
      ..._draw(foilSheet, 1, rng),
      ..._draw(landSheet, 1, rng),
    ]
  }
}


module.exports = {
  createPackGenerator,

  // Exported for tests
  ECHOED_PAIRS,
  COMMON_DUALS,
  DEFAULT_BASICS,
  TOWER_BASICS,
}
